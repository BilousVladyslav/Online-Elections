import { Component, OnInit, Output, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { } from "@angular/material";
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { EmailRegex } from 'src/app/shared/regexes/email.regex';
import { PasswordRegex } from 'src/app/shared/regexes/password.regex';
import { NameRegex } from 'src/app/shared/regexes/name.regex';
import { FormControlMustMatchValidate } from 'src/app/shared/validators/form-control-match.validate';
import { RegisterService } from 'src/app/core/services/registration.service';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { LoginModel } from 'src/app/shared/models/login.model';
import { RegisterUserModel } from 'src/app/shared/models/register-user.model';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  registerForm: FormGroup;
  private subscription: Subscription;
  errorMessage: string = null;

  constructor(
    private fb: FormBuilder,
    private authorizationService: AuthorizationService,
    private registerService: RegisterService,
    private router: Router

  ) { }

  ngOnInit(): void {
    this.createForm();
  }

  createForm(): void {
    this.registerForm = this.fb.group({
      Email: new FormControl(
        '', [Validators.required, Validators.pattern(EmailRegex.Regex)]),
      Password: new FormControl(
        '', [Validators.required, Validators.minLength(6), Validators.pattern(PasswordRegex.Regex)]),
      ConfirmPassword: new FormControl(
        '', [Validators.required]),
      FirstName: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      LastName: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
    },
      {
        validator: FormControlMustMatchValidate('Password', 'ConfirmPassword')
      })
  }

  onSubmit(): void {
    if (this.registerForm.status === "VALID") {
      this.registerComplete()
    }
  }

  registerComplete(): void {
    var registerUsertViewModel = <RegisterUserModel>this.registerForm.value;
    this.register_user(registerUsertViewModel);
  }

  register_user(registerViewModel: RegisterUserModel): void {
    this.subscription = this.registerService.register(registerViewModel).subscribe(
      res => {
        let loginModel = <LoginModel>{
          username: registerViewModel.username,
          password: registerViewModel.password
        }
        this.login(loginModel);
      },
      errors => {
        this.errorMessage = errors.message
      });
  }


  login(loginModel: LoginModel) {
    this.authorizationService.login(loginModel).subscribe(x => this.router.navigate(['/']))
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }



}
