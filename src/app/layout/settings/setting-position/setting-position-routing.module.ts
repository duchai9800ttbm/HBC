import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingPositionComponent } from './setting-position.component';
import { SettingPositionCreateComponent } from './setting-position-create/setting-position-create.component';
import { SettingPositionEditComponent } from './setting-position-edit/setting-position-edit.component';
const routes: Routes = [
    {
        path: '',
        component: SettingPositionComponent
    },
    {
        path: 'create',
        component: SettingPositionCreateComponent
      },
      {
        path: 'edit/:id',
        component: SettingPositionEditComponent
      }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SettingPositionRoutingModule { }
