import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
    //{
    //    path: 'register',
    //    loadChildren: () => import('./modules/register/register.module').then(mod => mod.RegisterModule)
    //},
];

@NgModule({ 
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
