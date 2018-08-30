import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSurveyComponent } from './site-survey.component';

const routes: Routes = [
  {
    path: '',
    component: SiteSurveyComponent
  },
  {
    path: 'form/:action',
    loadChildren: './site-survey-form/site-survey-form.module#SiteSurveyFormModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSurveyRoutingModule { }
