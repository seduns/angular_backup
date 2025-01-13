import { Injectable } from '@angular/core';
import { AuthService as AbpAuthService } from '@abp/ng.core';
import { Subject } from 'rxjs';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root',
})
export class CustomAuthService extends AbpAuthService {
//   private tokenChangeSubject = new Subject<void>();

//   onTokenChange$ = this.tokenChangeSubject.asObservable();

//   override login(params: any): Observable<any> {
//     return super.login(params).pipe(
//       tap(() => {
//         this.tokenChangeSubject.next(); // Notify token change
//       })
//     );
//   }

//   override refreshToken(): Promise<any> {
//     return super.refreshToken().then((response) => {
//       this.tokenChangeSubject.next(); // Notify token change
//       return response;
//     });
//   }

// //   override logout(queryParams?: any): Observable<any> {
// //     return super.logout(queryParams).pipe(
// //       tap(() => {
// //         this.tokenChangeSubject.next(); // Notify token change
// //       })
// //     );
// //   }
}
