import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSurveyComponent } from '../site-survey.component';
import { SiteSurveyFormProjectStatisticComponent } from './site-survey-form-project-statistic/site-survey-form-project-statistic.component';
import { SiteSurveyFormConditionComponent } from './site-survey-form-condition/site-survey-form-condition.component';
import { SiteSurveyFormTransportationComponent } from './site-survey-form-transportation/site-survey-form-transportation.component';
import { SiteSurveyFormDemobilisationComponent } from './site-survey-form-demobilisation/site-survey-form-demobilisation.component';
import { SiteSurveyFormTemporaryBuildingComponent } from './site-survey-form-temporary-building/site-survey-form-temporary-building.component';
import { SiteSurveyFormExistingSoilComponent } from './site-survey-form-existing-soil/site-survey-form-existing-soil.component';
import { SiteSurveyFormUsefulInforComponent } from './site-survey-form-useful-infor/site-survey-form-useful-infor.component';
import { SiteSurveyFormComponent } from './site-survey-form.component';

const routes: Routes = [
  {
    path: '',
    component: SiteSurveyFormComponent,
    children: [
      {
        path: '',
        redirectTo: 'statistic'
      },
      {
        path: 'statistic',
        component: SiteSurveyFormProjectStatisticComponent
      },
      {
        path: 'condition',
        component: SiteSurveyFormConditionComponent
      },
      {
        path: 'transportation',
        component: SiteSurveyFormTransportationComponent
      },
      {
        path: 'demobilisation',
        component: SiteSurveyFormDemobilisationComponent
      },
      {
        path: 'temporary-building',
        component: SiteSurveyFormTemporaryBuildingComponent
      },
      {
        path: 'existing-soil',
        component: SiteSurveyFormExistingSoilComponent
      },
      {
        path: 'useful-info',
        component: SiteSurveyFormUsefulInforComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSurveyFormRoutingModule { }
