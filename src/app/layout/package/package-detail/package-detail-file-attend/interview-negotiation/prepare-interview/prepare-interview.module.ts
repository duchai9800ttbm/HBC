import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrepareInterviewRoutingModule } from './prepare-interview-routing.module';
import { PrepareInterviewComponent } from './prepare-interview.component';

@NgModule({
  imports: [
    CommonModule,
    PrepareInterviewRoutingModule
  ],
  declarations: [PrepareInterviewComponent]
})
export class PrepareInterviewModule { }
