import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingBidStatusListComponent } from './setting-bid-status-list/setting-bid-status-list.component';
import { SettingBidStatusCreateComponent } from './setting-bid-status-create/setting-bid-status-create.component';
import { SettingBidStatusEditComponent } from './setting-bid-status-edit/setting-bid-status-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingBidStatusListComponent
  },
  {
    path: 'create',
    component: SettingBidStatusCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingBidStatusEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingBidStatusRoutingModule { }
