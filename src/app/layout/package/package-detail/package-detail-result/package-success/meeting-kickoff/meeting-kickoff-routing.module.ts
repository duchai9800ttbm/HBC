import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MeetingKickoffComponent } from './meeting-kickoff.component';
import { ReportMeetingComponent } from './report-meeting/report-meeting.component';

const routes: Routes = [
  {
    path: '',
    component: MeetingKickoffComponent,
    children: [      
      { path: 'report-meeting', component: ReportMeetingComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingKickoffRoutingModule { }
