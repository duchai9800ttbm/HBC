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
      PackgeCancelComponent
  ]
})
export class PackageDetailResultModule { }
