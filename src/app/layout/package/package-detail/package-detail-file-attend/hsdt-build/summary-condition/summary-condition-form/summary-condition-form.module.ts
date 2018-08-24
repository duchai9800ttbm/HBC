import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SummaryConditionFormRoutingModule } from './summary-condition-form-routing.module';
import { SummaryConditionFormComponent } from './summary-condition-form.component';
import { SummaryConditionFormInfoComponent } from './summary-condition-form-info/summary-condition-form-info.component';

@NgModule({
  imports: [
    CommonModule,
    SummaryConditionFormRoutingModule
  ],
  declarations: [SummaryConditionFormComponent, SummaryConditionFormInfoComponent]
})
export class SummaryConditionFormModule { }
