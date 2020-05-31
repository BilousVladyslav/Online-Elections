import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationService } from 'src/app/core/services/authorization.service';
import {
  L10N_CONFIG,
  L10nConfig,
  L10N_LOCALE,
  L10nLocale,
  L10nTranslationService
} from "angular-l10n";

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  private subscription: Subscription;
  querryFormControl: FormControl;

  schema = this.l10nConfig.schema;
  isLogged: boolean = false;
  is_organizer: boolean = false;

  selectedLanguage = this.schema[0].locale;

  constructor(
    private router: Router,
    private autorizationService: AuthorizationService,
    @Inject(L10N_LOCALE) public locale: L10nLocale,
    @Inject(L10N_CONFIG) private l10nConfig: L10nConfig,
    private translation: L10nTranslationService
  ) {
    autorizationService.isLoggedIn.subscribe(x => this.isLogged = x);
    this.isOrganizer();
  }

  ngOnInit() {
    this.querryFormControl = new FormControl('');
    this.isOrganizer();
    this.translation.onError().subscribe({
      next: (error: any) => {
        if (error) console.log(error);
      }
    });
  }

  logOut() {
    this.autorizationService.logout();
    this.is_organizer = false;
    this.router.navigate(['/']);
  }

  isOrganizer(): boolean {
    this.subscription = this.autorizationService
      .IsOrganizer.subscribe(data => this.is_organizer = data);
    return this.is_organizer;
  }

  setLocale(locale: L10nLocale): void {
    this.translation.setLocale(locale);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
