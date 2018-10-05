import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteSurveyFormRoutingModule } from './site-survey-form-routing.module';
import { SiteSurveyFormComponent } from './site-survey-form.component';
import { SiteSurveyFormProjectStatisticComponent } from './site-survey-form-project-statistic/site-survey-form-project-statistic.component';
import { SiteSurveyFormConditionComponent } from './site-survey-form-condition/site-survey-form-condition.component';
import { SiteSurveyFormTransportationComponent } from './site-survey-form-transportation/site-survey-form-transportation.component';
import { SiteSurveyFormDemobilisationComponent } from './site-survey-form-demobilisation/site-survey-form-demobilisation.component';
// tslint:disable-next-line:max-line-length
import { SiteSurveyFormTemporaryBuildingComponent } from './site-survey-form-temporary-building/site-survey-form-temporary-building.component';
import { SiteSurveyFormExistingSoilComponent } from './site-survey-form-existing-soil/site-survey-form-existing-soil.component';
import { SiteSurveyFormUsefulInforComponent } from './site-survey-form-useful-infor/site-survey-form-useful-infor.component';

@NgModule({
    imports: [CommonModule, SiteSurveyFormRoutingModule],
    declarations: [
        SiteSurveyFormComponent,
        SiteSurveyFormProjectStatisticComponent,
        SiteSurveyFormConditionComponent,
        SiteSurveyFormTransportationComponent,
        SiteSurveyFormDemobilisationComponent,
        SiteSurveyFormTemporaryBuildingComponent,
        SiteSurveyFormExistingSoilComponent,
        SiteSurveyFormUsefulInforComponent
    ]
})
export class SiteSurveyFormModule {}
