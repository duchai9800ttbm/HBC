import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingReasonRejectListComponent } from './setting-reason-reject-list/setting-reason-reject-list.component';
import { SettingReasonRejectCreateComponent } from './setting-reason-reject-create/setting-reason-reject-create.component';
import { SettingReasonRejectEditComponent } from './setting-reason-reject-edit/setting-reason-reject-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingReasonRejectListComponent
  },
  {
    path: 'create',
    component: SettingReasonRejectCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingReasonRejectEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingReasonRejectRoutingModule { }
