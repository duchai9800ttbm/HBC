import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteSurveyReportRoutingModule } from './site-survey-report-routing.module';
import { SiteSurveyReportComponent } from './site-survey-report.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { DescibeOverallComponent } from './descibe-overall/descibe-overall.component';
import { TrafficComponent } from './traffic/traffic.component';
import { DemoConsoComponent } from './demo-conso/demo-conso.component';
import { ServiceConstructionComponent } from './service-construction/service-construction.component';
import { SoilConditionComponent } from './soil-condition/soil-condition.component';
import { UsefulInfoComponent } from './useful-info/useful-info.component';
import { UpdateConfirmPopupComponent } from './update-confirm-popup/update-confirm-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SiteSurveyReportRoutingModule
  ],
  declarations: [
    SiteSurveyReportComponent,
    ScaleOverallComponent,
    DescibeOverallComponent,
    TrafficComponent,
    DemoConsoComponent,
    ServiceConstructionComponent,
    SoilConditionComponent,
    UsefulInfoComponent,
    UpdateConfirmPopupComponent
  ]
})
export class SiteSurveyReportModule { }
