import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteSurveyRoutingModule } from './site-survey-routing.module';
import { SiteSurveyComponent } from './site-survey.component';

@NgModule({
  imports: [
    CommonModule,
    SiteSurveyRoutingModule
  ],
  declarations: [SiteSurveyComponent]
})
export class SiteSurveyModule { }
