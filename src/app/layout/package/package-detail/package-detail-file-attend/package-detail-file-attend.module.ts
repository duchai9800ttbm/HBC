import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailFileAttendRoutingModule } from './package-detail-file-attend-routing.module';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component';
import { ModalModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PriceReportSubmitedComponent } from './price-report-submited/price-report.component';
import { PriceReportCreateComponent } from './price-report-create/price-report-create.component';
import { HsdtSignedComponent } from './hsdt-signed/hsdt-signed.component';
import { HsdtSubmittedComponent } from './hsdt-submitted/hsdt-submitted.component';
import { HsdtPendingComponent } from './hsdt-pending/hsdt-pending.component';
import { DocumentPriceReviewService } from '../../../../shared/services/document-price-review.service';
import { UploadFileHsdtComponent } from './hsdt-build/upload-file-hsdt/upload-file-hsdt.component';
// tslint:disable-next-line:max-line-length
import { CreateNewInvitationComponent } from './interview-negotiation/create-interview/create-new-invitation/create-new-invitation.component';
import { ReportEndInterviewComponent } from './interview-negotiation/end-interview/report-end-interview/report-end-interview.component';
import { InterviewNoticeComponent } from './interview-negotiation/create-interview/interview-notice/interview-notice.component';
import { TagInputModule } from 'ngx-chips';
import { StatusObservableHsdtService } from '../../../../shared/services/status-observable-hsdt.service';
import { ViewDetailReportComponent } from './interview-negotiation/end-interview/view-detail-report/view-detail-report.component';
TagInputModule.withDefaults({
  tagInput: {
    placeholder: 'Nhập địa chỉ email',
    // add here other default values for tag-input
  },
  dropdown: {
    displayBy: 'my-display-value',
    // add here other default values for tag-input-dropdown
  }
});
@NgModule({
  imports: [
    TagInputModule,
    CommonModule,
    SharedModule,
    PackageDetailFileAttendRoutingModule,
    ModalModule.forRoot(),
    CKEditorModule,
    DropDownsModule
  ],
  declarations: [
    PackageDetailFileAttendComponent,
    PriceReportSubmitedComponent,
    PriceReportCreateComponent,
    HsdtSignedComponent,
    HsdtSubmittedComponent,
    HsdtPendingComponent,
    CreateNewInvitationComponent,
    UploadFileHsdtComponent,
    ReportEndInterviewComponent,
    InterviewNoticeComponent,
    ViewDetailReportComponent
  ],
  entryComponents: [
    CreateNewInvitationComponent,
    UploadFileHsdtComponent,
    ReportEndInterviewComponent,
    InterviewNoticeComponent,
    ViewDetailReportComponent
  ],
  providers: [
    DocumentPriceReviewService,
    StatusObservableHsdtService
  ]
})
export class PackageDetailFileAttendModule { }
