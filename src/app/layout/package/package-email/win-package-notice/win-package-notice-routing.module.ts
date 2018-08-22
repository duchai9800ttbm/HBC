import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WinPackageNoticeComponent } from './win-package-notice.component';
import { WinPackageNoticeListComponent } from './win-package-notice-list/win-package-notice-list.component';
import { WinPackageNoticeDetailComponent } from './win-package-notice-detail/win-package-notice-detail.component';

const routes: Routes = [{
  path: '',
  component: WinPackageNoticeComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: WinPackageNoticeListComponent },
    { path: 'detail', component: WinPackageNoticeDetailComponent },
  ]
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WinPackageNoticeRoutingModule { }
