import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryConditionRoutingModule } from './summary-condition-routing.module';
import { SummaryConditionComponent } from './summary-condition.component';
import { SharedModule } from '../../../../../../shared/shared.module';
import { SiteSurveyReportService } from '../../../../../../shared/services/site-survey-report.service';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SummaryConditionRoutingModule
  ],
  declarations: [SummaryConditionComponent],
  providers: [
    SiteSurveyReportService
  ]
})
export class SummaryConditionModule { }
