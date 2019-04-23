import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TransferDocumentComponent } from './transfer-document.component';
import { TransferDocumentListComponent } from './transfer-document-list/transfer-document-list.component';
import { TransferDocumentDetailComponent } from './transfer-document-detail/transfer-document-detail.component';

const routes: Routes = [{
  path: '',
  component: TransferDocumentComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: TransferDocumentListComponent },
    { path: 'detail', component: TransferDocumentDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransferDocumentRoutingModule { }
