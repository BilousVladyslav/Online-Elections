import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './modules/registration/registration.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { VotingsComponent } from './modules/votings/votings.component';
import { ActiveVotingPageComponent } from './modules/votings/votings-page/votings-page.component';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'votings', component: VotingsComponent },
  { path: 'votings/active/:votingId', component: ActiveVotingPageComponent},


];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
