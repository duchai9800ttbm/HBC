import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailFileAttendRoutingModule } from './package-detail-file-attend-routing.module';
import { PackageDetailFileAttendComponent } from './package-detail-file-attend.component'
import { InformationDeploymentComponent } from './information-deployment/information-deployment.component'
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
import { HsdtInterviewNegotiationComponent } from './hsdt-interview-negotiation/hsdt-interview-negotiation.component';

@NgModule({
  imports: [
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
    HsdtInterviewNegotiationComponent
  ],
  providers: [
    DocumentPriceReviewService
  ]
})
export class PackageDetailFileAttendModule { }
