import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewNoticeRoutingModule } from './interview-notice-routing.module';
import { InterviewNoticeListComponent } from './interview-notice-list/interview-notice-list.component';
import { InterviewNoticeDetailComponent } from './interview-notice-detail/interview-notice-detail.component';
import { InterviewNoticeComponent } from './interview-notice.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    InterviewNoticeRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    InterviewNoticeComponent,
    InterviewNoticeListComponent,
    InterviewNoticeDetailComponent
  ]
})
export class InterviewNoticeModule { }
