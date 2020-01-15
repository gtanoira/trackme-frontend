/*
  AUTHENTICATION  &  AUTHORIZATIONS methods

  This service is responsible for authenticate (login) a user against the DBase and
  to authorize the user (security access) to all the programs and features of the app.

  El sistema de SEGURIDAD está basado en un objeto de formato JSON, cuya estructura es la siguiente:
  {
    "pgm<name>": {
      "cpt<name>": {
        <propertyKey>: <propertyValue>
        "access":      "off",
        "btnSave":     "off"
        "...":         "..."
      },

      "cpt<name>": { ...
      }
    },

    "pgm<name>": { ...
    }
  }

  El JSON se encuentra en el "sessionStorage" en la variable "currentUser.authorizations"

  El concepto es que este JSON determina toda la seguiradad de cada programa o app que se maneje en este
  proyecto Angular.

  La estructura jerárquica es simple:
    1.   Programa ID o APP
    1.1.    Componente ID
    1.1.1      Propiedad / valor
  Y ésta estructura se repite para cada programa que este proyecto maneje.

  ¿Cómo se determina la seguridad?
  Excepto para los programas (pgm<name>), la ausencia de un componente (cpt<name>) o propiedad (propertyKey)
  determina que el acceso es TOTAL. En el JSON solo se debe escribir si se quiere RESTRINGIR algo, pero no hace
  falta escribir si se quiere dar acceso.

  Pero para el caso de los programas (pgm<name>) es al REVES. El pgm<name> debe existir en el JSON si se quiere
  dar acceso al usuario a dicho progama. La ausencia del programa (pgm<name>) en el JSON hace que el sistema
  no navegue a dicho programa.

*/
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError, concat, AsyncSubject, of } from 'rxjs';
import { catchError, map, tap, mergeMap, switchMap, mapTo } from 'rxjs/operators';
import { Router } from '@angular/router';

// Libraries
import * as jwt_decode from 'jwt-decode';

// Models
import { Menu } from '../models/menu';
import { User } from '../models/user';

// Environment
import { environment } from '../environments/environment';

// Services
import { ErrorMessageService } from './error-message.service'

@Injectable({ providedIn: 'root' })
export class AuthsService {

  // Define variables
  private currentUserSubject: BehaviorSubject<User>;
  public  currentUser: Observable<User>;

  // Define user CACHE variables
  private userAuthorizationsCache: object;

  constructor(
    private errorMessageService: ErrorMessageService,
    private http: HttpClient,
    private router: Router
  ) {
    this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(sessionStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  /* **********************************************************************************
   * AUTHENTICATION methods
  */

  // GETTERS
  // Get the user info
  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  // HTTP request to obtain the user data: name, email, id, authorizations
  private getUserDataFromApi(userId: number) {
    return this.http.get<any>(
      `${environment.envData.loginServer}/api/v1/users/${userId}.json`
    ).pipe(
      tap(
        data => {
          // Read the user data and store them in the sessionStorage
          try {
            const userData = {
              id: data.id,
              email: data.email,
              firstName: data.first_name,
              lastName: data.last_name,
              fullName: `${data.first_name} ${data.last_name}`,
              companyId: data.company_id
            };

            // Save the user authorizations into the cache
            this.userAuthorizationsCache = (data.authorizations === null) ? {} : JSON.parse(data.authorizations);

            // Save user info in the browser session storage, to keep user logged in between page refreshes
            sessionStorage.setItem('currentUser', JSON.stringify(userData));
            this.currentUserSubject.next(userData);

          } catch (e) {
            throwError('TRK-0008(E): the user data received from the backend is incorrect');
          }
        }
      )
    );
  }

  // Creates all the main menu options (programs) for the logged user
  private createMainMenu() {
    return this.http.get<any>(
      `${environment.envData.loginServer}/api/v1/menues.json`
    ).pipe(
      tap(
        pgmsApp => {
          // Define variables
          let pgmsUser = [];  // All programs the user has access
          const mnuUser = [] as Menu[];  // User main menu with all the info needed

          // Obtain the ID's of the programs
          pgmsUser = Object.keys(this.userAuthorizationsCache);

          // Get rid of all the programs that the user has NO access
          pgmsApp.forEach(
            program => {
              if (pgmsUser.includes(program.pgmId)) {
                // Has Access
                mnuUser.push(program);
              }
            }
          );
          // Save and store the main menu in the cache
          sessionStorage.setItem('mainMenu', JSON.stringify(mnuUser));
        }
      ),
      catchError(
        error => {
          // tslint:disable-next-line: max-line-length
          return throwError(`API-0011(E): error calling http://<loginServer>/api/v1/menues - Error: ${error.message}`);
        }
      )
    );
  }

  // Retrieves the user main menu
  public getMainMenu(): Observable<Menu[]> {
    return of(<Menu[]>JSON.parse(sessionStorage.getItem('mainMenu')));
  }

  // LOGIN and user AUTENTICACION against DBase. JWT token.
  public login(username: string, password: string): Observable<any> {

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
    return getJwtToken.pipe(
      switchMap(userId => this.getUserDataFromApi(userId)),
      switchMap(userData => this.createMainMenu())
    );
  }

  public logout() {
    // Remover los datos del usuario del sessionStorage
    sessionStorage.removeItem('currentUser');
    sessionStorage.removeItem('jwtToken');
    sessionStorage.removeItem('mainMenu');
    this.currentUserSubject.next(null);
    // Set Program Title
    this.errorMessageService.changeAppProgramTitle('Login');
    // Ir al Login
    this.router.navigate(['/login']);
  }

  /* **********************************************************************************
   * AUTHORIZATIONS methods
  */

  // Check and recreates if necesary user authorizations
  public existsUserAuths(): Observable<boolean> {

    if (this.userAuthorizationsCache) {
      // User auths exists
      return of(true);

    } else {
      // User auths DOESN't exists, recreat user auths
      return this.getUserDataFromApi(this.currentUserValue.id).pipe(
        map(
         data => true
        ),
        catchError(
        err => of(false)
        )
      );
    }
  }

  /* ******************************************************
   * COMPANY schema authorizations
  */
  // Get all the company's id the user can access
  public getAllowCompanies(): number[] {
    const companies: number[] = this.userAuthorizationsCache['companiesAllow'] ? this.userAuthorizationsCache['companiesAllow'] : [];

    if (!companies) {
      companies.push(this.currentUserValue.companyId);
    }

    return companies;
  }

  /* ******************************************************
   * COMPONENT schema (of a program) authorizations
  */
  // Esta rutina determina si se permite el acceso a un componente dentro de un programa
  public componentAccess(programId: string, componentId: string): boolean {
    // Asignar TRUE, ya que siempre se tiene acceso TOTAL al menos que
    // se especifique lo contrario
    let retorno = true;

    // Is a user login?
    if (this.currentUserValue) {

      // Obtener las authorizations del progamId
      const programAuthorizations: object = this.userAuthorizationsCache[programId];
      if (programAuthorizations) {

        // Obtener las authorizations del componente
        const componentAuthorizations = programAuthorizations[componentId];
        if (componentAuthorizations) {

          // Obtener la propiedad "access"
          if (componentAuthorizations.access && componentAuthorizations.access === 'off') {
            retorno = false;
          } else {
            retorno = true;
          }

        } else {
          // El componente NO existe, garantizar acceso TOTAL
          retorno = true;
        }

      } else {
        // NO tiene acceso al programa
        retorno = false;
      }

    } else {
      // No hay un usuario logueado
      retorno = false;
    }
    return retorno;
  }

  // Esta rutina devuelve el valor de una propiedad (propertyId) de un componenete dado (componentId)
  // Si la propiedad (propertyId) NO existe, se devuelve null
  public componentPropertyValue(programId: string, componentId: string, propertyId: string): any {

    // Asignar NULL, ya que es el valor por defecto si la propiedad (propertyId) No existe
    const retorno = null;

    // IS a user log in?
    if (this.currentUserValue) {

      // Obtener las authorizations del progamId
      const programAuthorizations: object = this.userAuthorizationsCache[programId];
      if (programAuthorizations) {

        // Obtener las authorizations del componente
        const componentAuthorizations = programAuthorizations[componentId];
        if (componentAuthorizations) {

          // Obtener la propiedad propertyId
          if (componentAuthorizations[propertyId]) {
            return componentAuthorizations[propertyId];
          }
        }
      }
    }
    return retorno;
  }

  /* ******************************************************
   * PROGRAM schema authorizations
  */
  // Validate if the user can access a PROGRAM
  public programAccess(programId: string): boolean {

    // Asignar FALSE, ya que por defecto, NO se tiene acceso al menos que se especifique lo contrario
    // Para tener acceso a un programa, basta con que el ID del programa figure dentro del JSON
    // de authorizations del usuario
    let retorno = false;

    // Is there a login user?
    if (this.currentUserValue) {

      // Obtener las authorizations del programId
      const programAuthorizations: object = this.userAuthorizationsCache[programId];
      if (programAuthorizations) {

        // Chequear si existe por las dudas la propiedad "access"
        if (programAuthorizations['access'] && programAuthorizations['access'] === 'off') {
          retorno = false;
        } else {
          retorno = true;
        }

      } else {
        // NO tiene acceso al programa
        retorno = false;
      }

    } else {
      // No hay un usuario logueado
      retorno = false;
    }
    return retorno;
  }

  /* ******************************************************
   * USER DEFAULTS schema authorizations
  */
  // User default LANGUAGE
  public userDefaultLanguage(): string {
    return this.userAuthorizationsCache['userDefaults'] ? this.userAuthorizationsCache['userDefaults']['language'] : 'en';
  }

  // User default UNIT LENGTH
  public userDefaultUnitLength(): string {
    return this.userAuthorizationsCache['userDefaults'] ? this.userAuthorizationsCache['userDefaults']['unitLength'] : 'inch';
  }

  // User default UNIT WEIGHT
  public userDefaultUnitWeight(): string {
    return this.userAuthorizationsCache['userDefaults'] ? this.userAuthorizationsCache['userDefaults']['unitWeight'] : 'pound';
  }

  // User default UNIT VOLUMETRIC
  public userDefaultUnitVolumetric(): string {
    return this.userAuthorizationsCache['userDefaults'] ? this.userAuthorizationsCache['userDefaults']['unitVolumetric'] : 'kg3';
  }

  // User default WAREHOUSE
  public userDefaultWarehouse(): number {
    return this.userAuthorizationsCache['userDefaults'] ? this.userAuthorizationsCache['userDefaults']['warehouseId'] : null;
  }
}
