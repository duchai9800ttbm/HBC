import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrepareInterviewRoutingModule } from './prepare-interview-routing.module';
import { PrepareInterviewComponent } from './prepare-interview.component';
import { SharedModule } from '../../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PrepareInterviewRoutingModule
  ],
  declarations: [PrepareInterviewComponent]
})
export class PrepareInterviewModule { }
