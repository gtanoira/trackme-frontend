import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// Services
import { AuthsService } from '../../shared/auths.service';
import { ErrorMessageService } from '../../shared/error-message.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  // Define variables
  loginForm: FormGroup;
  returnUrl: string;  // url to go after login
  error  = '';
  userId: number;

  constructor(
    private route: ActivatedRoute,
    private authsService: AuthsService,
    private errorMessageService: ErrorMessageService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // redirect to home if already logged in
    if (this.authsService.currentUserValue) {
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

    // Authenticate the user against the LOGIN server and obtain the JWT token and User data
    this.authsService.login(this.username.value, this.password.value).subscribe(
      userId => {
        if (this.returnUrl === '' || this.returnUrl === '/') {
          this.router.navigate(['/main']);
        } else {}
          this.router.navigate([this.returnUrl]);
      },
      error => {
        this.errorMessageService.changeErrorMessage(error);
        this.router.navigate(['/login']);
      }
    );
  }
}
