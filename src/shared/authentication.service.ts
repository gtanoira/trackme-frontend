/*
   Este servicio ofrece los métodos necesarios para autenticar a los usuarios contra una Active Directory (AD) de
   Microsoft via el protocolo LDAP, contra un backend en Django on Python
   Este servicio llama se conecta via una API al Django quien es el que luego realiza la autenticación del usuario
   a través del LDAP.
*/
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, never } from 'rxjs';
import { catchError, map, mergeMap, flatMap, mergeMapTo, tap } from 'rxjs/operators';
import { Router } from '@angular/router';

// Libraries
import * as jwt_decode from 'jwt-decode';

// Models
import { User } from '../models/user';

// Environment
import { environment } from '../environments/environment';

// Services
import { ErrorMessageService } from './error-message.service'

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(
    private errorMessageService: ErrorMessageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // GETTERS
  // Get the user info store on the browser sessionStorage
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // HTTP reqeust to obtain the user data
  getUserDataFromApi(userId: number) {
    return this.http.get<any>(
      `${environment.envData.loginServer}/api/v1/users/${userId}.json`
    ).pipe(
      tap(
        data => {
          // Read the user data and store them in the sessionStorage
          try {
            const userData = {
              id:             data.id,
              email:          data.email,
              firstName:      data.first_name,
              lastName:       data.last_name,
              fullName:       `${data.first_name} ${data.last_name}`,
              authorizations: (data.authorizations === null) ? {} : JSON.parse(data.authorizations)
            };

            // store user details in local storage to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            this.currentUserSubject.next(userData);

          } catch (e) {
            throwError('TRK-0008(E): the user data received from the backend is incorrect');
          }
        }
      )
    );
  }

  // LOGIN y AUTENTICACION del usuario que se quiere loguear
  login(username: string, password: string): Observable<any> {

    // Body
    const loginData = {
      auth: {
        email: username,
        password: password
      }
    };

    // HTTP request to obtain JWT Token
    const getJwtToken = this.http.post<any>(
      `${environment.envData.loginServer}/user_token`,
      loginData
    ).pipe(
      map(
        jwtToken => {

          // Store token in sessionStorage
          sessionStorage.setItem('jwtToken', jwtToken['jwt']);

          // Decode JWT token
          const tokenDecoded = jwt_decode(jwtToken['jwt']);

          // Get UserId
          return tokenDecoded['sub'];
        }
      )
    );

    // Authenticate user
    return getJwtToken
      .pipe(
        mergeMap(
          userId => this.getUserDataFromApi(userId)
        ),
        catchError (
          err => {
            if (err.statusText === 'Unknown Error') {
              return throwError(`TRK-0010(E): cannot reach API ${err.url}. Error: ${err.error.message}`);
            } else {
              // Check by status code
              switch (err.status) {
                case 400: { return throwError('TRK-0012(E): bad request to LOGIN server.'); break; }
                default: { return throwError('TRK-0011(E): the username or password are incorrect.'); break; }
              }
            }
          }
        )
      );
  }

  logout() {
    // Remover los datos del usuario del sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('jwtToken');
    this.currentUserSubject.next(null);
    // Set Program Title
    this.errorMessageService.changeAppProgramTitle('Login');
    // Ir al Login
    this.router.navigate(['/login']);
  }
}
