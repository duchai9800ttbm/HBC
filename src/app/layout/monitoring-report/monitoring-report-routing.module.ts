import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MonitoringReportComponent } from './monitoring-report.component';
import { ReportKpiChairComponent } from './report-kpi-chair/report-kpi-chair.component';
import { ReportWinBidComponent } from './report-win-bid/report-win-bid.component';
import { ReportKpiAreaComponent } from './report-kpi-area/report-kpi-area.component';
import { ReportConstructionItemsComponent } from './report-construction-items/report-construction-items.component';
import { ReportTypeConstructionComponent } from './report-type-construction/report-type-construction.component';
import { ReportWinRateContractorsComponent } from './report-win-rate-contractors/report-win-rate-contractors.component';
import { ReportWinRateQuarterComponent } from './report-win-rate-quarter/report-win-rate-quarter.component';
import { ReportFloorAreaComponent } from './report-floor-area/report-floor-area.component';
import { ReportNumberWinBidComponent } from './report-number-win-bid/report-number-win-bid.component';
import { ReportPotentialProjectsComponent } from './report-potential-projects/report-potential-projects.component';
const routes: Routes = [
  {
    path: '',
    component: MonitoringReportComponent,
    children: [
      { path: '', redirectTo: 'kpi-chair' },
      { path: 'kpi-chair', component: ReportKpiChairComponent },
      { path: 'win-bid', component: ReportWinBidComponent },
      { path: 'kpi-area', component: ReportKpiAreaComponent },
      { path: 'construction-items', component: ReportConstructionItemsComponent },
      { path: 'type-construction', component: ReportTypeConstructionComponent },
      { path: 'win-rate-contractors', component: ReportWinRateContractorsComponent },
      { path: 'win-rate-quarter-of-year', component: ReportWinRateQuarterComponent },
      { path: 'floor-area', component: ReportFloorAreaComponent },
      { path: 'number-win-bid', component: ReportNumberWinBidComponent },
      { path: 'potential projects', component: ReportPotentialProjectsComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitoringReportRoutingModule { }
