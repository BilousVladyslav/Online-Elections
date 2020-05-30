import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';

import {
  L10nConfig,
  L10nLoader,
  L10nTranslationModule,
  L10nIntlModule
} from "angular-l10n";
import { l10nConfig, initL10n } from "./l10n-config";

import { AppComponent } from './app.component';
import { NavbarComponent } from './modules/navbar/navbar.component';
import { FooterComponent } from './modules/footer/footer.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './modules/navbar/login/login.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent
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
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initL10n,
      deps: [L10nLoader],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
