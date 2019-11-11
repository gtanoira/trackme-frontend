/*
  Este componente es el principal del sistema y muestra la página ppal del portal y el
  esquema de menúes
*/
import { Component, ElementRef, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material/icon';
import {MDCDrawer} from '@material/drawer';
//const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));

// Services
import { ErrorMessageService } from '../shared/error-message.service';
import { AuthenticationService } from '../shared/authentication.service';

// Environment
import { environment } from '../environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnChanges, OnDestroy {

  // Error Messages from the entire APP
  public formErrorMessage = '';
  public errorLineClasses = '';

  // Toolbar variables
  toolbarUser   = '';
  toolbarLoginServer  = '';
  toolbarEnvironment = '';
  // Program Title render in screen
  public currentProgramTitle = 'Home';
  public errorLine: Subscription;   // Error line

  constructor(
    public authenticationService: AuthenticationService,
    private domSanitizer: DomSanitizer,
    private errorMessageService: ErrorMessageService,
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
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/information.svg')
    );
    // Form
    this.matIconRegistry.addSvgIcon(
      'form',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/form.svg')
    );
    // Home
    this.matIconRegistry.addSvgIcon(
      'home_main',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/home_main.svg')
    );
    // Logout
    this.matIconRegistry.addSvgIcon(
      'logout',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/logout.svg')
    );
    // Password
    this.matIconRegistry.addSvgIcon(
      'user_password',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/lock.svg')
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
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/images/avatar.svg')
    );

    // Subscribir a los errores del módulo, para que sean mostrados en la pantalla
    this.errorMessageService.formCurrentMessage
      .subscribe(
        message => this.formErrorMessage = message
      );

    // Subscribe to the currentProgramTitle, to show program's title on the screen
    this.errorMessageService.currentProgramTitle
      .subscribe(
        message => this.currentProgramTitle = message
      );

    // Subscibir el Toolbar user
    this.authenticationService.currentUser
      .subscribe(
        user => this.toolbarUser = (user) ? user.fullName : ''
      );

    // Subscribir a los errores del módulo, para que sean mostrados en la pantalla
    this.errorLine = this.errorMessageService.formCurrentMessage.subscribe(
      message => {
        if (message === null || message.trim() === '') {

          // Cerrar la linea de error
          this.errorLineClasses = '';

        } else {

          // Chequear si la linea de error esta abierta o cerrada
          if (this.formErrorMessage !== null || this.formErrorMessage.trim() !== '') {

            // Cerrar la linea de error
            this.errorLineClasses = '';
            setTimeout(() => {
              this.formErrorMessage = message;
              this.errorLineClasses = 'fm__open';
            }, 550);
          } else {
            // Abrir la linea de error con el nuevo mensaje
            this.formErrorMessage = message;
            this.errorLineClasses = 'fm__open';
          }
        }
      }
    );

  }

  ngOnInit() {
    // Borrar posible mensaje de error
    this.errorMessageService.changeErrorMessage(null);
    // Toolbar
    this.toolbarLoginServer = environment.envData.loginServer;
    this.toolbarEnvironment = environment.envData.mode;
  }

  ngOnChanges() {
    // Set Program Title
    this.errorMessageService.changeAppProgramTitle('Customer Orders');
  }

  ngOnDestroy() {
  }

}
