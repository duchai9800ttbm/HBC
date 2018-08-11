import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingReasonWinListComponent } from './setting-reason-win-list/setting-reason-win-list.component';
import { SettingReasonWinCreateComponent } from './setting-reason-win-create/setting-reason-win-create.component';
import { SettingReasonWinEditComponent } from './setting-reason-win-edit/setting-reason-win-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingReasonWinListComponent
  },
  {
    path: 'create',
    component: SettingReasonWinCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingReasonWinEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingReasonWinRoutingModule { }
