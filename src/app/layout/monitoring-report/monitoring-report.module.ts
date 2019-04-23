import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportKpiChairComponent } from './report-kpi-chair/report-kpi-chair.component';
import { MonitoringReportComponent } from './monitoring-report.component';
import { SharedModule } from '../../shared/shared.module';
import { MonitoringReportRoutingModule } from './monitoring-report-routing.module';
import { ReportWinBidComponent } from './report-win-bid/report-win-bid.component';
import { ReportKpiAreaComponent } from './report-kpi-area/report-kpi-area.component';
import { ReportConstructionItemsComponent } from './report-construction-items/report-construction-items.component';
import { ReportTypeConstructionComponent } from './report-type-construction/report-type-construction.component';
import { ReportWinRateContractorsComponent } from './report-win-rate-contractors/report-win-rate-contractors.component';
import { ReportWinRateQuarterComponent } from './report-win-rate-quarter/report-win-rate-quarter.component';
import { ReportFloorAreaComponent } from './report-floor-area/report-floor-area.component';
import { ReportNumberWinBidComponent } from './report-number-win-bid/report-number-win-bid.component';
import { ReportPotentialProjectsComponent } from './report-potential-projects/report-potential-projects.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    MonitoringReportRoutingModule
  ],
  declarations: [
    ReportKpiChairComponent,
    MonitoringReportComponent,
    ReportWinBidComponent,
    ReportKpiAreaComponent,
    ReportConstructionItemsComponent,
    ReportTypeConstructionComponent,
    ReportWinRateContractorsComponent,
    ReportWinRateQuarterComponent,
    ReportFloorAreaComponent,
    ReportNumberWinBidComponent,
    ReportPotentialProjectsComponent
  ]
})
export class MonitoringReportModule { }
