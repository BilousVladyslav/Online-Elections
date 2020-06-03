import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipsModule } from '@angular/material/chips';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';


import {
  L10nConfig,
  L10nLoader,
  L10nTranslationModule,
  L10nIntlModule
} from "angular-l10n";
import { l10nConfig, initL10n } from "./l10n-config";
import { JwtInterceptor } from './core/interceptors/jwt.interceptor';

import { AppComponent } from './app.component';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { FooterComponent } from './modules/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/navbar/login/login.component';
import { RegistrationComponent } from './modules/registration/registration.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { VotingsComponent } from './modules/votings/votings.component';
import { ConstructorComponent } from './modules/constructor/constructor.component';
import { ConstructorListComponent } from './modules/constructor/constructor-list/constructor-list.component';
import { ConstructorEditorComponent } from './modules/constructor/constructor-editor/constructor-editor.component';
import { VotingsListComponent } from './modules/votings/votings-list/votings-list.component';
import { ActiveVotingPageComponent, SubmitDialog } from './modules/votings/votings-page/votings-page.component';
import { VotingsProcessComponent } from './modules/votings/votings-process/votings-process.component';
import { VotingsResultsComponent } from './modules/votings/votings-results/votings-results.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    VotingsComponent,
    ConstructorComponent,
    ConstructorListComponent,
    ConstructorEditorComponent,
    VotingsListComponent,
    ActiveVotingPageComponent,
    VotingsProcessComponent,
    VotingsResultsComponent,
    SubmitDialog
  ],
  imports: [
    BrowserModule,
    L10nTranslationModule.forRoot(l10nConfig),
    L10nIntlModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatButtonModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatChipsModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDialogModule,
    MatCardModule,
    MatProgressBarModule,
    MatDividerModule,

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [SubmitDialog],
})
export class AppModule { }
