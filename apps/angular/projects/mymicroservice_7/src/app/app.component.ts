import { AuthService } from '@abp/ng.core';
import { Component, OnInit } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'mymicroservice_7';

  isAuthenticated: boolean = false;
  userName: string | null = null;

  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isAuthenticated;
  }

  ngOnInit(): void {
    // Check if the user is authenticated
    this.isAuthenticated = this.authService.isAuthenticated;

    if (this.isAuthenticated) {
      this.setUserDetails(); // Retrieve user details
    } else {
      console.log('User is not authenticated');
    }
  }

  private setUserDetails(): void {
    const token = this.authService.getAccessToken(); // Get the access token
    if (token) {
      const jwtHelper = new JwtHelperService();
      const decodedToken = jwtHelper.decodeToken(token);

      // Extract user details (assuming 'name' claim is present)
      this.userName = decodedToken?.preferred_username || 'Unknown User';

      console.log(decodedToken);

      console.log('Logged-in user:', this.userName);
    } else {
      console.log('No token available');
    }
  }
}
