import { eLayoutType, RoutesService } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '@abp/ng.core';
import { JwtHelperService } from '@auth0/angular-jwt';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService, AuthService], multi: true },
];

function configureRoutes(routes: RoutesService, authService: AuthService) {
  return () => new Promise<void>((resolve) => {
    const token = authService.getAccessToken();
    const payload = parseJwt(token);
    // console.log('Token:', token || 'No token');
    const roles = payload?.role ? (Array.isArray(payload.role) ? payload.role : [payload.role]) : [];
    const isManager = roles.includes('manager');
    const isAdmin = roles.includes('admin');
    const isOfficer = roles.includes('officer');
    
    // Base routes for all users
    const baseRoutes = [
      {
        path: '/app',  
        name: 'Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
    ];

    // Survey routes for non-officer roles
    const surveyRoutes = [
      {
        name: 'Survey',
        iconClass: 'fas fa-clipboard',
        order: 2,
        layout: eLayoutType.application,
      },
      {
        path: '/survey',
        parentName: 'Survey',
        name: 'Survey Information',
        iconClass: 'fas fa-info-circle',
        order: 3,
        layout: eLayoutType.application,  
      },
      {
        path: '/bar-chart',
        parentName: 'Survey',
        name: 'Product',
        iconClass: 'fas fa-chart-bar',
        order: 4,
        layout: eLayoutType.application,
      },
    ];

    // Chat route for admins
    const adminRoutes = [
      {
        path: '/chat-base',
        name: 'BroRakyat',
        iconClass: 'fas fa-info-circle',
        order: 5,
        layout: eLayoutType.application,
      },
    ];

    // Routes for specific roles (admin, officer, etc.)
    const roleSpecificRoutes = [
      ...(isAdmin ? adminRoutes : []), // Admin routes
      ...(isOfficer || !isManager ? surveyRoutes : []), // Survey routes for officers or non-managers
    ];

    // Add base and role-specific routes
    routes.add([...baseRoutes, ...roleSpecificRoutes]);

    // Resolve the promise after adding routes
    resolve();
  });
}

function parseJwt(token: string): any {
  try {
    if (!token) return null;
    const payloadBase64 = token.split('.')[1];
    const payloadJson = atob(payloadBase64);
    const jwtHelper = new JwtHelperService();
    const decodedToken = jwtHelper.decodeToken(token); // Decode the JWT token
    // console.log(decodedToken);
    return JSON.parse(payloadJson);
  } catch (error) {
    console.error('Invalid JWT token:', error);
    return null;  
  }
}
