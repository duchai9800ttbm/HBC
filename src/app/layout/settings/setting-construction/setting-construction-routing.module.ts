import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingConstructionListComponent } from './setting-construction-list/setting-construction-list.component';
import { SettingConstructionCreateComponent } from './setting-construction-create/setting-construction-create.component';
import { SettingConstructionEditComponent } from './setting-construction-edit/setting-construction-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingConstructionListComponent
  },
  {
    path: 'create',
    component: SettingConstructionCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingConstructionEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingConstructionRoutingModule { }
