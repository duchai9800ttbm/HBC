import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InterviewNoticeComponent } from './interview-notice.component';
import { InterviewNoticeListComponent } from './interview-notice-list/interview-notice-list.component';
import { InterviewNoticeDetailComponent } from './interview-notice-detail/interview-notice-detail.component';

const routes: Routes = [{
  path: '',
  component: InterviewNoticeComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: InterviewNoticeListComponent },
    { path: 'detail', component: InterviewNoticeDetailComponent },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterviewNoticeRoutingModule { }
