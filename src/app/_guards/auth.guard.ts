import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

// Services
import { AuthenticationService } from '../../shared/authentication.service';
import { AuthorizationService } from '../../shared/authorization.service';
import { ErrorMessageService } from '../../shared/error-message.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private authorizationService: AuthorizationService,
    private errorMessageService: ErrorMessageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentUser = this.authenticationService.currentUserValue;
    // Chequear que el usuario exista
    if (currentUser) {

      // Chequear que la ruta posea un programId para permitr el acceso
      if (route.data.idProgram) {

        // Is HomePage
        if (route.data.idProgram === 'homePage') {
          // Set Program Title
          this.errorMessageService.changeAppProgramTitle('Home Page');
          // Ir a la Home Page o Menú Principal
          return true;

        // Check user access
        } else {
          if (this.authorizationService.programAccess(route.data.idProgram)) {
            // YES: user has access
            // Set Program Title
            this.errorMessageService.changeAppProgramTitle(route.data.nameProgram);
            return true;
          } else {
            // NO: user has NO access
            this.errorMessageService.changeErrorMessage(`API-0013(E): you don't have access to this program ${route.data.idProgram}`);
            return false;
          }
        }

      } else {
        // NO ACCESS, role not authorised so redirect to home page
        this.errorMessageService.changeErrorMessage(`API-0027(E): no posee acceso a la APP ${route.data.nameProgram}`);
        // Set Program Title
        this.errorMessageService.changeAppProgramTitle('Login');
        this.router.navigate(['/login']);
        return false;
      }

    } else {
      // Set Program Title
      this.errorMessageService.changeAppProgramTitle('Login');
      // User does not exist, go to login
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return true;
    }
  }
}
