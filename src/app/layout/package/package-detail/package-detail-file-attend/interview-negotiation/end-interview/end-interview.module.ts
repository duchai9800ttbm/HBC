import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EndInterviewRoutingModule } from './end-interview-routing.module';
import { SharedModule } from '../../../../../../shared/shared.module';
import { EndInterviewComponent } from './end-interview.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    EndInterviewRoutingModule
  ],
  declarations: [
    EndInterviewComponent,
  ]
})
export class EndInterviewModule { }
