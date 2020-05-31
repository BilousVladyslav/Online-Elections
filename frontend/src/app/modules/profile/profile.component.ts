import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { ProfileService } from "../../core/services/profile.service";
import { UserProfileModel } from "../../shared/models/user-profile.model";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { NameRegex } from 'src/app/shared/regexes/name.regex'
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  subscription: Subscription;
  user: UserProfileModel = new UserProfileModel();
  userProfileForm: FormGroup;
  color: ThemePalette = 'primary';

  constructor(private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(L10N_LOCALE) public locale: L10nLocale) {
  }

  ngOnInit() {
    this.GetUserProfile();
    this.CreateForm();
  }

  CreateForm() {
    this.userProfileForm = this.fb.group({
      username: [{ value: this.user.username}],
      email: [{ value: this.user.email}],
      first_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
      last_name: new FormControl(
        '', [Validators.required, Validators.maxLength(50), Validators.pattern(NameRegex.Regex)]),
    });
  }

  GetUserProfile() {
    this.subscription = this.profileService.GetUserProfile()
      .subscribe(data => {
        this.user = data;
      });
  }

  EditUserProfile() {
    this.subscription = this.profileService.EditUserProfile(this.user)
      .subscribe(data => {
        this.user = data;
      });
  }

  DeleteUserProfile() {
    this.subscription = this.profileService.DeleteUserProfile()
      .subscribe(data => {
        this.authorizationService.logout();
        this.router.navigate(['/']);
      });
  }

  onSubmit() {
    this.EditUserProfile();
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }

}
