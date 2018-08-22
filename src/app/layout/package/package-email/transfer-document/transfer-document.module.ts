import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferDocumentRoutingModule } from './transfer-document-routing.module';
import { TransferDocumentListComponent } from './transfer-document-list/transfer-document-list.component';
import { TransferDocumentDetailComponent } from './transfer-document-detail/transfer-document-detail.component';
import { TransferDocumentComponent } from './transfer-document.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    TransferDocumentRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    TransferDocumentComponent,
    TransferDocumentListComponent,
    TransferDocumentDetailComponent
  ]
})
export class TransferDocumentModule { }
