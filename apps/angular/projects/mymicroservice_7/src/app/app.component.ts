import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { LoginParams } from '@abp/ng.core/lib/models/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  title = 'mymicroservice_7'

  isAuthenticated: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    // Check if the user is authenticated
    this.isAuthenticated = this.authService.isAuthenticated;
    

    // Get the current route
    const currentRoute = this.router.url;

    // If the user is not authenticated and trying to access the admin route
    if (!this.isAuthenticated && this.isAdminRoute(currentRoute)) {
      const loginParams: LoginParams = {
        username: '',   // Replace with actual username
        password: '',   // Replace with actual password
        rememberMe: false,
        redirectUrl: '',
        
      };

      // Attempt to log the user in
      this.authService.login(loginParams).subscribe({
        next: (response) => {
          console.log('User logged in:', response);
          this.isAuthenticated = true;  // Set authentication state to true
        },
        error: (error) => {
          console.error('Login failed:', error);
          // Optionally, navigate to a different route if login fails
          this.router.navigate(['/']); // Redirect to home or another page
        }
      });
    } else if (this.isAuthenticated) {
      console.log('User is already authenticated');
    }
  }

  // Method to check if the current route is an admin route
  private isAdminRoute(route: string): boolean {
    return route.startsWith('/survey'); // Adjust based on your actual admin path
  }
}
