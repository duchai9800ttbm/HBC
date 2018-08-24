import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewNegotiationRoutingModule } from './interview-negotiation-routing.module';
import { InterviewNegotiationComponent } from './interview-negotiation.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InterviewNegotiationRoutingModule
  ],
  declarations: [InterviewNegotiationComponent]
})
export class InterviewNegotiationModule { }
