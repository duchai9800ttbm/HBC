import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InfoRoutingModule } from './info-routing.module';
import { InfoComponent } from './info.component';
import { ScaleOverallComponent } from './scale-overall/scale-overall.component';
import { DescribeOverallComponent } from './describe-overall/describe-overall.component';
import { TrafficComponent } from './traffic/traffic.component';
import { DemoConsoComponent } from './demo-conso/demo-conso.component';
import { ServiceConstructionComponent } from './service-construction/service-construction.component';
import { SoilConditionComponent } from './soil-condition/soil-condition.component';
import { UsefulInfoComponent } from './useful-info/useful-info.component';
import { SharedModule } from '../../../../../../../shared/shared.module';


@NgModule({
  imports: [
    CommonModule,
    InfoRoutingModule,
    SharedModule
  ],
  declarations: [
    InfoComponent,
    ScaleOverallComponent,
    DescribeOverallComponent,
    TrafficComponent,
    DemoConsoComponent,
    ServiceConstructionComponent,
    SoilConditionComponent,
    UsefulInfoComponent
  ]
})
export class InfoModule { }
