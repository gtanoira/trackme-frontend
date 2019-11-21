/*
  Este componente es el principal del sistema y muestra la página ppal del portal y el
  esquema de menúes
*/
import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';

// Services
import { ErrorMessageService } from '../shared/error-message.service';
import { AuthsService } from '../shared/auths.service';

// Environment
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  // Variables messages for entire app
  public programSubtitle = '';
  public errorMessage = '';
  public errorLineClasses = '';

  // Define variables for Main Menu
  public  openClass = '';  // CSS class for toggle between open and close the main menu
  private isMainMenuOpen = false;  // To open and close the main menu

  // Toolbar variables
  toolbarUser = '';
  toolbarLoginServer = '';
  toolbarEnvironment = '';

  // Program Title render in screen
  private subsProgramSubtitle: Subscription;
  private subsErrorMessages: Subscription;
  private subsCurrentUser: Subscription;
  private subsErrorLine: Subscription;   // Error line

  constructor(
    public  authsService: AuthsService,
    private domSanitizer: DomSanitizer,
    public  errorMessageService: ErrorMessageService,
    private matIconRegistry: MatIconRegistry
  ) {

    // Definir iconos
    // Add
    this.matIconRegistry.addSvgIcon(
      'add',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/add.svg')
    );
    // Add Green
    this.matIconRegistry.addSvgIcon(
      'add_green',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/add_green.svg')
    );
    // Close
    this.matIconRegistry.addSvgIcon(
      'close',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/close.svg')
    );
    // Data-Table
    this.matIconRegistry.addSvgIcon(
      'data-table',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/data-table.svg')
    );
    // Delete Red
    this.matIconRegistry.addSvgIcon(
      'delete_red',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/delete_red.svg')
    );
    // EnvironmentInfo
    this.matIconRegistry.addSvgIcon(
      'env_info',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/info-24px.svg')
    );
    // Form
    this.matIconRegistry.addSvgIcon(
      'form',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/form.svg')
    );
    // Home
    this.matIconRegistry.addSvgIcon(
      'home_main',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/home-24px.svg')
    );
    // Logout
    this.matIconRegistry.addSvgIcon(
      'logout',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/exit_to_app-24px.svg')
    );
    // Password
    this.matIconRegistry.addSvgIcon(
      'user_password',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/lock-24px.svg')
    );
    // Reload
    this.matIconRegistry.addSvgIcon(
      'reload',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/recycle.svg')
    );
    // Save
    this.matIconRegistry.addSvgIcon(
      'save',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/save.svg')
    );
    // SpreadSheet
    this.matIconRegistry.addSvgIcon(
      'spreadsheet',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/spreadsheet.svg')
    );
    // User
    this.matIconRegistry.addSvgIcon(
      'user_toolbar',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/account_circle-24px.svg')
    );

    // Subscribe to the currentProgramTitle, to show program's title on the screen
    this.subsProgramSubtitle = this.errorMessageService.currentProgramTitle.subscribe(
      title => this.programSubtitle = title
    );

    // Subscribe to toolbarUser
    this.subsCurrentUser = this.authsService.currentUser.subscribe(
      user => this.toolbarUser = (user) ? user.fullName : 'no user'
    );

    // Subscribir a los errores del módulo, para que sean mostrados en la pantalla
    this.subsErrorLine = this.errorMessageService.formCurrentMessage.subscribe(
      message => {
        // Close error line
        this.errorLineClasses = '';

        // Send new error message
        if (message) {
          setTimeout(() => {
            this.errorMessage = message;
            this.errorLineClasses = 'fm-open';
          }, 700);
        }
      }
    );
  }

  ngOnInit() {
    // Borrar posible mensaje de error
    this.errorMessageService.changeErrorMessage('');

    // Toolbar
    this.toolbarLoginServer = environment.envData.loginServer;

    // Set Program Title
    this.errorMessageService.changeAppProgramTitle('Home Page');
  }

  ngOnDestroy () {
    this.subsErrorLine.unsubscribe();
    this.subsProgramSubtitle.unsubscribe();
    this.subsErrorMessages.unsubscribe();
    this.subsCurrentUser.unsubscribe();
  }

  // Open-Close the main menu
  public showMainMenu() {
    // Open,Close only if is a user logged in
    if (this.authsService.currentUserValue) {
      if (this.isMainMenuOpen) {
        // Close Main Menu
        this.openClass = '';
      } else {
        // Open Main Menu
        this.openClass = 'mainmenu-open';
      }
      this.isMainMenuOpen = !this.isMainMenuOpen;
    }
  }

  // Logout button
  public logoutBtn() {
    // Close if the main menu it's open
    if (this.isMainMenuOpen) { this.showMainMenu(); }

    // Logout user
    this.authsService.logout();
  }
}
