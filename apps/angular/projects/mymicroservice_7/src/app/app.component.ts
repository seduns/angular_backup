import { AuthService, LoginParams, RoutesService } from '@abp/ng.core';
import { ReturnStatement } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Brickkk';

  isAuthenticated: boolean = false;
  userName: string | null = null;
  userRoles: string[] = []; // Array to hold roles
  availableRoutes: any[] = []; // Filtered routes based on user roles
  hasInitialized: boolean = false; // Flag to track initialization status

  constructor(
    private authService: AuthService,
    private routesService: RoutesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    const returnUrl = this.route.snapshot.queryParams['ReturnUrl'];

    if (returnUrl) {
      // Navigate to the specified ReturnUrl
      this.router.navigateByUrl(returnUrl);

      // Clean up the URL by removing query parameters
      this.router.navigate([], {
        queryParams: {},
        replaceUrl: true,
      });
    }
    console.log('Url: ', returnUrl);
    // Check if the page has already been initialized
    if (this.hasInitialized) {
      return; // Skip if already initialized
    }

    this.hasInitialized = true; // Set initialization flag to true

    // Check if the user is authenticated
    this.isAuthenticated = this.authService.isAuthenticated;

    if (this.isAuthenticated) {
      this.setUserDetails(); // Retrieve user details and roles
      // console.log('User authenticated');
      
      // Subscribe to the filtered routes based on user roles
      this.routesService.tree$.subscribe((routes) => {
        this.filterRoutesByRole(routes); // Filter routes based on user roles
      });
    } else {
      this.setUserDetails(); // Retrieve user details and roles
      // console.log('User not authenticated');
    }
  }

  // This method sets the user details after extracting them from the token
  private setUserDetails(): void {
    const token = this.authService.getAccessToken(); // Get the access token
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token); // Decode the JWT token

      // Extract user details (assuming 'preferred_username' claim is present)
      this.userName = decodedToken?.preferred_username || 'Unknown User';

      // Extract user roles (assuming 'role' is a claim in the JWT payload)
      this.userRoles = decodedToken?.role || []; // Adjust the claim name as necessary

      // console.log(decodedToken); // Log the decoded token
      // console.log('Logged-in user:', this.userName);
      // console.log('User roles:', this.userRoles); // Log the roles
    } else {
      // console.log('No token available');
    }
  }

  // Filters routes dynamically based on user roles
  private filterRoutesByRole(routes: any[]): void {
    if (!routes) {
      // console.log('No routes available');
      return;
    }

    // Filter routes based on user roles
    this.availableRoutes = routes.filter(route =>
      this.userRoles.some(role => route.roles?.includes(role)) // Check if any of the user's roles match the route's roles
    );

    // console.log('Available Routes for User:', this.availableRoutes); // Log the filtered routes
  }

  

  // Log out the user and clear user details and token
  logout(LoginParams: LoginParams): void {
    this.authService.logout().subscribe(() => {
      // Clear user details and available routes after logout
      this.isAuthenticated = false;
      this.userName = null;
      this.userRoles = [];
      this.availableRoutes = [];

      // console.log('User logged out');
      // console.log('User details cleared');
    });
  }

  // Add a method to reset the state of your component
private resetState(): void {
  this.isAuthenticated = false;
  this.userName = null;
  this.userRoles = [];
  this.availableRoutes = [];
  
  // Optionally, refetch data, reinitialize routes, etc.
  // console.log('State reset successfully');
}

// Call this method after successful login or token refresh
login(loginParams: LoginParams): void {
  this.authService.login(loginParams).subscribe({
    next: (token) => {
      this.isAuthenticated = true;
      this.setUserDetails(); // Set user details after login

      // Reset or reinitialize state after login if necessary
      this.resetState();
      
      // console.log('User logged in');
    },
    error: (error) => {
      console.error('Login failed', error); // Handle login failure
    },
  });
}
}

