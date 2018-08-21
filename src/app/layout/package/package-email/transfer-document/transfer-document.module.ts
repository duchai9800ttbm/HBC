import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TransferDocumentRoutingModule } from './transfer-document-routing.module';
import { TransferDocumentListComponent } from './transfer-document-list/transfer-document-list.component';
import { TransferDocumentDetailComponent } from './transfer-document-detail/transfer-document-detail.component';

@NgModule({
  imports: [
    CommonModule,
    TransferDocumentRoutingModule
  ],
  declarations: [TransferDocumentListComponent, TransferDocumentDetailComponent]
})
export class TransferDocumentModule { }
