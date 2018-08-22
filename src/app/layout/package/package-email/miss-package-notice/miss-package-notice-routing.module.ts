import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MissPackageNoticeComponent } from './miss-package-notice.component';
import { MissPackageNoticeListComponent } from './miss-package-notice-list/miss-package-notice-list.component';
import { MissPackageNoticeDetailComponent } from './miss-package-notice-detail/miss-package-notice-detail.component';

const routes: Routes = [{
  path: '',
  component: MissPackageNoticeComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: MissPackageNoticeListComponent },
    { path: 'detail', component: MissPackageNoticeDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MissPackageNoticeRoutingModule { }
