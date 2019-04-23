import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeployNoticeComponent } from './deploy-notice.component';
import { DeployNoticeListComponent } from './deploy-notice-list/deploy-notice-list.component';
import { DeployNoticeDetailComponent } from './deploy-notice-detail/deploy-notice-detail.component';

const routes: Routes = [{
  path: '',
  component: DeployNoticeComponent,
  children: [
    { path: '', redirectTo: 'list' },
    { path: 'list', component: DeployNoticeListComponent },
    { path: 'detail', component: DeployNoticeDetailComponent },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DeployNoticeRoutingModule { }
