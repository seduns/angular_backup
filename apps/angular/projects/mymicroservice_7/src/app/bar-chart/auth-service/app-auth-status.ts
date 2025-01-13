import { Component, OnInit } from '@angular/core';
import { CustomAuthService } from './custom-auth-service'; // Adjust the path

@Component({
  selector: 'app-auth-status',
  template: '',
  styles: [],
})
export class AuthStatusComponent  {
  // constructor(private customAuthService: CustomAuthService) {}

  // ngOnInit(): void {
  //   this.customAuthService.onTokenChange$.subscribe(() => {
  //     console.log('Token has changed!');
  //     // You can implement logic here to update the UI based on the token change
  //   });
  // }
}
