import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailFileInvitationRoutingModule } from './package-detail-file-invitation-routing.module';
import { PackageDetailFileInvitationComponent } from './package-detail-file-invitation.component';
import { AddFileComponent } from './add-file/add-file.component';
import { EvaluateComponent } from './evaluate/evaluate.component';
import { SuggestComponent } from './suggest/suggest.component';
import { PendingComponent } from './pending/pending.component';
import { ApprovedComponent } from './approved/approved.component';
import { HasDeclinedComponent } from './has-declined/has-declined.component';
import { RejectionLetterComponent } from './rejection-letter/rejection-letter.component';
import { SendMailRejectComponent } from './send-mail-reject/send-mail-reject.component';
import { CKEditorModule } from 'ng2-ckeditor';
import { RefusalApprovalComponent } from './pending/refusal-approval/refusal-approval.component';
import { SendThroughComponent } from './suggest/send-through/send-through.component';
import { UploadFileComponent } from './add-file/upload-file/upload-file.component';
import { FilterPipeModule } from 'ngx-filter-pipe';
import { TagInputModule } from 'ngx-chips';
import { UploadReviewDocumentComponent } from './suggest/upload-review-document/upload-review-document.component';
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
    CKEditorModule,
    FilterPipeModule,
    PackageDetailFileInvitationRoutingModule
  ],
  declarations: [
    PackageDetailFileInvitationComponent,
    AddFileComponent,
    EvaluateComponent,
    SuggestComponent,
    PendingComponent,
    ApprovedComponent,
    HasDeclinedComponent,
    RejectionLetterComponent,
    SendMailRejectComponent,
    RefusalApprovalComponent,
    SendThroughComponent,
    UploadFileComponent,
    UploadReviewDocumentComponent
  ]
})
export class PackageDetailFileInvitationModule { }
