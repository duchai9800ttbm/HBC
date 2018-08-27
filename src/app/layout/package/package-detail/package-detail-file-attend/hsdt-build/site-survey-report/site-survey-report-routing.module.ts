import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSurveyReportComponent } from './site-survey-report.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { TrafficComponent } from './traffic/traffic.component';

const routes: Routes = [
  {
    path: '', component: SiteSurveyReportComponent,
    children: [
      { path: 'scale-overall', component: ScaleOverallComponent },
      { path: 'describe-overall', component: ScaleOverallComponent },
      { path: 'traffic', component: TrafficComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSurveyReportRoutingModule { }
