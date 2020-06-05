import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegistrationComponent } from './modules/registration/registration.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { VotingsComponent } from './modules/votings/votings.component';
import { ActiveVotingPageComponent } from './modules/votings/votings-page/votings-page.component';
import { VotingsResultsComponent } from './modules/votings/votings-results/votings-results.component';
import { ConstructorComponent } from './modules/constructor/constructor.component';
import { ConstructorEditorComponent } from './modules/constructor/constructor-editor/constructor-editor.component';
import { ConstructorRedactorComponent } from './modules/constructor/constructor-redactor/constructor-redactor.component';

const routes: Routes = [
  { path: 'register', component: RegistrationComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'votings', component: VotingsComponent },
  { path: 'votings/active/:votingId', component: ActiveVotingPageComponent },
  { path: 'votings/coming/:votingId', component: VotingsResultsComponent },
  { path: 'votings/finished/:votingId', component: VotingsResultsComponent },
  { path: 'constructor', component: ConstructorComponent },
  { path: 'constructor/create', component: ConstructorEditorComponent },
  { path: 'constructor/:votingId', component: ConstructorRedactorComponent },
  
  

];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
