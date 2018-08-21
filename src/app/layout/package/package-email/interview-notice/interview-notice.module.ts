import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewNoticeRoutingModule } from './interview-notice-routing.module';
import { InterviewNoticeListComponent } from './interview-notice-list/interview-notice-list.component';
import { InterviewNoticeDetailComponent } from './interview-notice-detail/interview-notice-detail.component';

@NgModule({
  imports: [
    CommonModule,
    InterviewNoticeRoutingModule
  ],
  declarations: [InterviewNoticeListComponent, InterviewNoticeDetailComponent]
})
export class InterviewNoticeModule { }
