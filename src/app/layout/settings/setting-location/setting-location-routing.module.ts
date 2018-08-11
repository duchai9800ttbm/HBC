import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingLocationComponent } from './setting-location.component';
import { SettingLocationCreateComponent } from './setting-location-create/setting-location-create.component';
import { SettingLocationEditComponent } from './setting-location-edit/setting-location-edit.component';

const routes: Routes = [
  {
    path: '',
    component: SettingLocationComponent
  },
  {
    path: 'create',
    component: SettingLocationCreateComponent
  },
  {
    path: 'edit/:id',
    component: SettingLocationEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingLocationRoutingModule { }
