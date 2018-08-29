import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SiteSurveyReportComponent } from './site-survey-report.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { TrafficComponent } from './traffic/traffic.component';
import { DescibeOverallComponent } from './descibe-overall/descibe-overall.component';
import { DemoConsoComponent } from './demo-conso/demo-conso.component';
import { ServiceConstructionComponent } from './service-construction/service-construction.component';
import { SoilConditionComponent } from './soil-condition/soil-condition.component';
import { UsefulInfoComponent } from './useful-info/useful-info.component';

const routes: Routes = [
  {
    path: '', component: SiteSurveyReportComponent,
    children: [
      { path: 'scale', component: ScaleOverallComponent },
      { path: 'describe', component: DescibeOverallComponent },
      { path: 'traffic', component: TrafficComponent },
      { path: 'pvgc', component: DemoConsoComponent },
      { path: 'service', component: ServiceConstructionComponent },
      { path: 'condition', component: SoilConditionComponent },
      { path: 'moreinfo', component: UsefulInfoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SiteSurveyReportRoutingModule { }
