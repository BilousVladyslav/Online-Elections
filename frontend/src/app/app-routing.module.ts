import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './modules/registration/registration.component';
import { ProfileComponent } from './modules/profile/profile.component';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },

];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
