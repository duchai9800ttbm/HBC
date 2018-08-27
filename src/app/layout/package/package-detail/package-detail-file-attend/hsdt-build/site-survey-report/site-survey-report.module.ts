import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteSurveyReportRoutingModule } from './site-survey-report-routing.module';
import { SiteSurveyReportComponent } from './site-survey-report.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { DescibeOverallComponent } from './descibe-overall/descibe-overall.component';
import { TrafficComponent } from './traffic/traffic.component';

@NgModule({
  imports: [
    CommonModule,
    SiteSurveyReportRoutingModule
  ],
  declarations: [SiteSurveyReportComponent, ScaleOverallComponent, DescibeOverallComponent, TrafficComponent]
})
export class SiteSurveyReportModule { }
