import { eLayoutType, RoutesService } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';
import { AuthService } from '@abp/ng.core'; // Import AuthService to check user roles

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService, AuthService], multi: true }, // Added AuthService as a dependency
];

// Route configuration function
function configureRoutes(routes: RoutesService, authService: AuthService) {
  return () => {
    const token = authService.getAccessToken(); // Get the token
    const payload = parseJwt(token); // Decode the token to extract user roles

    const isManager = payload?.role === 'manager'; 
    const isAdmin = payload?.role === 'admin'; 
    const isOfficer = payload?.role === 'officer'; 

    // Add routes only if the user is a manager
    
      routes.add([
        {
          path: '/app', // Home path
          name: 'Home', // Menu label
          iconClass: 'fas fa-home', // Home icon
          order: 1, // Menu order
          layout: eLayoutType.application, // Application layout type
        },
      ]);
      
      
      // These routes are visible to everyone
      if(isAdmin || isOfficer || isManager) {
        
        routes.add([
          {
            path: '/app', // Home path
            name: 'Home', // Menu label
            iconClass: 'fas fa-home', // Home icon
            order: 1, // Menu order
            layout: eLayoutType.application, // Application layout type
          },
          {
            // path: '/', // Root path
            name: 'Survey', // Survey form label
          iconClass: 'fas fa-clipboard', // List icon for survey form
          order: 2, // Set the order to 2 to distinguish it from the home route
          layout: eLayoutType.application,
        },
        {
          path: '/survey', // Survey path
          parentName: 'Survey', // Parent route is the Survey Form
          name: 'Survey Information', // Survey menu item
          iconClass: 'fas fa-clipboard', // Use correct class for the clipboard icon
          order: 3, // Survey should be the first item under Survey Form
          layout: eLayoutType.application,
        },
        ,
        {
          path: '/bar-chart', // Home path
          parentName: 'Survey', // Parent route is the Survey Form
          name: 'Product', // Menu label
          iconClass: 'fas fa-clipboard', // Use correct class for the clipboard icon
          order: 4, // Menu order
          layout: eLayoutType.application, // Application layout type
        },
       
        
      ]);
    }
    
  };
}
  

// Helper function to parse the JWT token and extract user info
function parseJwt(token: string): any {
  if (!token) return null;
  const payloadBase64 = token.split('.')[1];
  const payloadJson = atob(payloadBase64);
  return JSON.parse(payloadJson);
}
