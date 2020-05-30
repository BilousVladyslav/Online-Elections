import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { PasswordRegex } from 'src/app/shared/regexes/password.regex';
import { LoginModel } from 'src/app/shared/models/login.model';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'login-component',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  submited: boolean;
  returnUrl: string;
  loginForm: FormGroup;
  errorMessage: string;

  constructor(
    private authenticationService: AuthorizationService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale
  ) {
    if (this.authenticationService.currentUser) {
      this.router.navigate(['/']);
    }
    this.submited = false;
  }

  createForm(): void {
    this.loginForm = this.fb.group({
      username: new FormControl(
        '', [Validators.required]),
      password: new FormControl(
        '', [Validators.required])
    });
  }

  ngOnInit() {
    this.createForm();
  }

  onSubmit(): void {
    this.submited = true;
    var loginViewModel = <LoginModel>this.loginForm.value;
    if (this.loginForm.valid)
      this.login(loginViewModel);
  }

  login(loginViewModel: LoginModel): void {
    this.subscription = this.authenticationService
      .login(loginViewModel)
      .subscribe(
        res => this.router.navigate([this.returnUrl]),
        errors => this.errorMessage = errors.message);
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
