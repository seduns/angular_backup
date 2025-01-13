import { Injectable } from '@angular/core';
import { RoutesService, eLayoutType } from '@abp/ng.core';
import { AuthService } from '@abp/ng.core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RouteInitializationService {
  private routesInitialized = new BehaviorSubject<boolean>(false); // BehaviorSubject to track route initialization status

  constructor(
    private routesService: RoutesService,
    private authService: AuthService
  ) {}

  initializeRoutes(): void {
    const token = this.authService.getAccessToken();
    if (token) {
      const payload = this.parseJwt(token);
      this.setRoutesBasedOnRoles(payload);
    }
  
    // Directly check if the user is authenticated
    if (this.authService.isAuthenticated && !this.routesInitialized.value) {
      this.initializeRoutes(); // Initialize routes when user logs in
      this.routesInitialized.next(true); // Ensure routes are not re-added
    }
  }
  
  private parseJwt(token: string): any {
    try {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);
      return decodedToken;
    } catch (error) {
      console.error('Invalid JWT token:', error);
      return null;
    }
  }

  private setRoutesBasedOnRoles(payload: any): void {
    const roles = payload?.role ? (Array.isArray(payload.role) ? payload.role : [payload.role]) : [];
    const isManager = roles.includes('manager');
    const isAdmin = roles.includes('admin');
    const isOfficer = roles.includes('officer');

    const baseRoutes = [
      {
        path: '/app',
        name: 'Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
    ];

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

    const adminRoutes = [
      {
        path: '/chat-base',
        name: 'BroRakyat',
        iconClass: 'fas fa-info-circle',
        order: 5,
        layout: eLayoutType.application,
      },
    ];

    const roleSpecificRoutes = [
      ...(isAdmin ? adminRoutes : []), // Admin routes
      ...(isOfficer || !isManager ? surveyRoutes : []), // Survey routes for officers or non-managers
    ];

    this.routesService.add([...baseRoutes, ...roleSpecificRoutes]);
  }
}
