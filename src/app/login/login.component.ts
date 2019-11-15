import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

// Services
import { AuthenticationService } from '../../shared/authentication.service';
import { ErrorMessageService } from '../../shared/error-message.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  returnUrl: string;
  error  = '';

  constructor(
    private route: ActivatedRoute,
    private authenticationService: AuthenticationService,
    private errorMessageService: ErrorMessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }

    // Set subtitle
    this.errorMessageService.changeAppProgramTitle('Login');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // GETTERS:convenience getter for easy access to form fields
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  onSubmit() {

    // Borrar la linea de errores
    this.errorMessageService.changeErrorMessage('');

    // Chequear que el FORM sea válido
    if (this.loginForm.invalid) {
      this.errorMessageService.changeErrorMessage('The username and/or password are incorrect. Please check and try again.');
      return;
    }

    // spinning ON
    this.loading = true;

    // Authenticate the user against the LOGIN server and obtain the JWT token and User data
    this.authenticationService.login(this.username.value, this.password.value).subscribe(
      data => {
        if (data) {
          this.router.navigate([this.returnUrl]);
        } else {
          this.loading = false;
          this.router.navigate(['/pgmClientOrders']);
        }
      },
      error => {
        this.errorMessageService.changeErrorMessage(error);
        this.loading = false;
        this.router.navigate(['/login']);
      }
    );
  }
}
