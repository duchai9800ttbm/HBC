import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CreateInterviewRoutingModule } from './create-interview-routing.module';
import { CreateInterviewComponent } from './create-interview.component';
import { SharedModule } from '../../../../../../shared/shared.module';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    CreateInterviewRoutingModule
  ],
  declarations: [CreateInterviewComponent]
})
export class CreateInterviewModule { }
