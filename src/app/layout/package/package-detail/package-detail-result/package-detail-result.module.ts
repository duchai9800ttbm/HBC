import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../../shared/shared.module';
import { PackageDetailResultRoutingModule } from './package-detail-result-routing.module';
import { PackageDetailResultComponent } from './package-detail-result.component';
import { WaitResultComponent } from './wait-result/wait-result.component';
import { PackageFailedComponent } from './package-failed/package-failed.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { PackgeCancelComponent } from './packge-cancel/packge-cancel.component';
import { CKEditorModule } from 'ng2-ckeditor';
// tslint:disable-next-line:max-line-length
import { UploadResultFileAttendComponent } from './package-success/package-list/upload-result-file-attend/upload-result-file-attend.component';
import { DetailResultPackageService } from '../../../../shared/services/detail-result-package.service';
import { NotificationContractComponent } from './package-success/package-list/notification-contract/notification-contract.component';
import { UploadContractSigningComponent } from './package-success/contract-signed/upload-contract-signing/upload-contract-signing.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PackageDetailResultRoutingModule,
    CKEditorModule
    // ModalModule
  ],
  declarations: [
      PackageDetailResultComponent,
      WaitResultComponent,
      PackageFailedComponent,
      PackgeCancelComponent,
      UploadResultFileAttendComponent,
      NotificationContractComponent,
      UploadContractSigningComponent
  ],
  entryComponents: [
    UploadResultFileAttendComponent,
    NotificationContractComponent,
    UploadContractSigningComponent
  ],
  providers: [
    DetailResultPackageService
  ]
})
export class PackageDetailResultModule { }
