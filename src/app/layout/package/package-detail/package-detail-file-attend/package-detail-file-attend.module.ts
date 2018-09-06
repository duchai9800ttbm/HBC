import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailFileAttendRoutingModule } from './package-detail-file-attend-routing.module';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component';
import { InformationDeploymentComponent } from './information-deployment/information-deployment.component';
import { ModalModule } from 'ngx-bootstrap';
import { CKEditorModule } from 'ng2-ckeditor';
import { AssignmentProgressComponent } from './information-deployment/assignment-progress/assignment-progress.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { PriceReviewComponent } from './price-review/price-review.component';
import { PriceReportSubmitedComponent } from './price-report-submited/price-report.component';
import { PriceReportCreateComponent } from './price-report-create/price-report-create.component';
import { HsdtSignedComponent } from './hsdt-signed/hsdt-signed.component';
import { HsdtSubmittedComponent } from './hsdt-submitted/hsdt-submitted.component';
import { HsdtPendingComponent } from './hsdt-pending/hsdt-pending.component';
import { DocumentPriceReviewService } from '../../../../shared/services/document-price-review.service';
import { UploadFilePriceReviewComponent } from './price-review/upload-file-price-review/upload-file-price-review.component';
import { UploadFileHsdtComponent } from './hsdt-build/upload-file-hsdt/upload-file-hsdt.component';
// tslint:disable-next-line:max-line-length
import { CreateNewInvitationComponent } from './interview-negotiation/create-interview/create-new-invitation/create-new-invitation.component';
import { ReportEndInterviewComponent } from './interview-negotiation/end-interview/report-end-interview/report-end-interview.component';
import { InterviewNoticeComponent } from './interview-negotiation/create-interview/interview-notice/interview-notice.component';
import { TagInputModule } from 'ngx-chips';
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
    InformationDeploymentComponent,
    AssignmentProgressComponent,
    PriceReviewComponent,
    PriceReportSubmitedComponent,
    PriceReportCreateComponent,
    HsdtSignedComponent,
    HsdtSubmittedComponent,
    HsdtPendingComponent,
    UploadFilePriceReviewComponent,
    CreateNewInvitationComponent,
    UploadFileHsdtComponent,
    ReportEndInterviewComponent,
    InterviewNoticeComponent
  ],
  entryComponents: [
    CreateNewInvitationComponent,
    UploadFileHsdtComponent,
    ReportEndInterviewComponent,
    InterviewNoticeComponent
  ],
  providers: [
    DocumentPriceReviewService
  ]
})
export class PackageDetailFileAttendModule { }
