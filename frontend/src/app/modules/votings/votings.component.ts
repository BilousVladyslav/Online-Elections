import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subscription } from "rxjs";
import { ProfileService } from "../../core/services/profile.service";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import { L10N_LOCALE, L10nLocale } from "angular-l10n";

@Component({
  selector: 'app-votings',
  templateUrl: './votings.component.html',
  styleUrls: ['./votings.component.css']
})
export class VotingsComponent implements OnInit {
  subscription: Subscription;

  constructor(private profileService: ProfileService,
    private authorizationService: AuthorizationService,
    private router: Router,
    @Inject(L10N_LOCALE) public locale: L10nLocale) {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {
    if (this.subscription)
      this.subscription.unsubscribe();
  }
}
