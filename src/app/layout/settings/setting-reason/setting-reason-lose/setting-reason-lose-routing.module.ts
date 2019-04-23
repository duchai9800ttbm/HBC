import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingReasonLoseListComponent } from './setting-reason-lose-list/setting-reason-lose-list.component';
import { SettingReasonLoseCreateComponent } from './setting-reason-lose-create/setting-reason-lose-create.component';
import { SettingReasonLoseEditComponent } from './setting-reason-lose-edit/setting-reason-lose-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingReasonLoseListComponent
  },
  {
    path: 'create',
    component: SettingReasonLoseCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingReasonLoseEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingReasonLoseRoutingModule { }
