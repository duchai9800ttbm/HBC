import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryConditionRoutingModule } from './summary-condition-routing.module';
import { SummaryConditionComponent } from './summary-condition.component';

@NgModule({
  imports: [
    CommonModule,
    SummaryConditionRoutingModule
  ],
  declarations: [SummaryConditionComponent]
})
export class SummaryConditionModule { }
