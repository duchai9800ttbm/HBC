import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditComponent } from './edit.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { DescribeOverallComponent } from './describe-overall/describe-overall.component';
import { TrafficComponent } from './traffic/traffic.component';
import { DemoConsoComponent } from './demo-conso/demo-conso.component';
import { ServiceConstructionComponent } from './service-construction/service-construction.component';
import { SoilConditionComponent } from './soil-condition/soil-condition.component';
import { UsefulInfoComponent } from './useful-info/useful-info.component';

const routes: Routes = [
  {
    path: '', component: EditComponent,
    children: [
      { path: '', redirectTo: 'scale' },
      { path: 'scale', component: ScaleOverallComponent },
      { path: 'describe', component: DescribeOverallComponent },
      { path: 'traffic', component: TrafficComponent},
      { path: 'demo-conso', component: DemoConsoComponent },
      { path: 'service-construction', component: ServiceConstructionComponent },
      { path: 'soil', component: SoilConditionComponent },
      { path: 'moreinfo', component: UsefulInfoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EditRoutingModule { }
