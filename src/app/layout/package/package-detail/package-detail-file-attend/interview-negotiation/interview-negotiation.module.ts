import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewNegotiationRoutingModule } from './interview-negotiation-routing.module';
import { InterviewNegotiationComponent } from './interview-negotiation.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { SubmittedHsdtComponent } from './submitted-hsdt/submitted-hsdt.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    InterviewNegotiationRoutingModule
  ],
  declarations: [InterviewNegotiationComponent, SubmittedHsdtComponent]
})
export class InterviewNegotiationModule { }
