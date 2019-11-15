import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// Services
import { AuthenticationService } from '../shared/authentication.service';
import { ErrorMessageService } from '../shared/error-message.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private errorMessageService: ErrorMessageService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(
        map(
          res => res
        ),
        catchError(
          err => {
            console.log('*** INTERCEPTOR error:', err);
            let error: string;

            // 401: Unauthorized returned from api
            if (err.status === 401) {
              this.authenticationService.logout();
              // Print the error message and go to LOGIN
              this.errorMessageService.changeErrorMessage('TRK-0005(E): your session has expired, try login again.');
              this.router.navigate(['/login']);
              error = 'TRK-0005(E): your session has expired, try login again.';

            // 404: NOT FOUND
            } else if (err.status === 404) {
              if (err.url.indexOf('user_token')) {
                error = 'TRK-0007(E): the username and/or password are incorrect';
              } else {
                error = `TRK-0006(E): there\'s no connection to the host. Error: ${err.message} `;
              }

            // Unknown: Check host conection
            } else if (err.statusText === 'Unknown Error' || err.status === 0) {
              error = 'TRK-0006(E): there\'s no connection to the host. Error: ' + err.message;

            // Everything else errors
            } else {
              error = err.message || err.statusText;
            }

            return throwError(error);
          }
        )
      );
  }
}
