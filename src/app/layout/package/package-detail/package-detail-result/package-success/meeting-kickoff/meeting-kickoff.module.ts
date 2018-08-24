import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MeetingKickoffRoutingModule } from './meeting-kickoff-routing.module';
import { MeetingKickoffComponent } from './meeting-kickoff.component';
import { ReportMeetingComponent } from './report-meeting/report-meeting.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { SharedModule } from '../../../../../../shared/shared.module';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  imports: [
    CommonModule,
    GridModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot(),
    MeetingKickoffRoutingModule,
    CKEditorModule
  ],
  declarations: [MeetingKickoffComponent,ReportMeetingComponent]
})
export class MeetingKickoffModule { }
