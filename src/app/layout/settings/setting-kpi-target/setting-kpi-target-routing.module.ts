import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingKpiTargetComponent } from './setting-kpi-target.component';
import { GroupConfigurationComponent } from './group-configuration/group-configuration.component';
const routes: Routes = [
  {
    path: '',
    component: SettingKpiTargetComponent,
    children: [
      {
        path: '',
        redirectTo: 'group-config'
      },
      {
        path: 'group-config',
        component: GroupConfigurationComponent
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingKpiTargetRoutingModule { }
