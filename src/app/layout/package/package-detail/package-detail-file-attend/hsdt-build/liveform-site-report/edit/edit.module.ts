import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EditRoutingModule } from './edit-routing.module';
import { DemoConsoComponent } from './demo-conso/demo-conso.component';
import { DescribeOverallComponent } from './describe-overall/describe-overall.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { ServiceConstructionComponent } from './service-construction/service-construction.component';
import { SoilConditionComponent } from './soil-condition/soil-condition.component';
import { TrafficComponent } from './traffic/traffic.component';
import { UsefulInfoComponent } from './useful-info/useful-info.component';
import { EditComponent } from './edit.component';

@NgModule({
  imports: [
    CommonModule,
    EditRoutingModule
  ],
  declarations: [
    EditComponent,
    DemoConsoComponent,
    DescribeOverallComponent,
    ScaleOverallComponent,
    ServiceConstructionComponent,
    SoilConditionComponent,
    TrafficComponent,
    UsefulInfoComponent
  ]
})
export class EditModule { }
