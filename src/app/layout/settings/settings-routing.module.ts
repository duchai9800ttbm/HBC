import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingLocationComponent } from './setting-location/setting-location.component';
import { SettingContractComponent } from './setting-contract/setting-contract.component';
import { SettingContractCreateComponent } from './setting-contract/setting-contract-create/setting-contract-create.component';
import { SettingContractEditComponent } from './setting-contract/setting-contract-edit/setting-contract-edit.component';
import { SettingKpiTargetComponent } from './setting-kpi-target/setting-kpi-target.component';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'reason'
      },
      {
        path: 'location',
        loadChildren: './setting-location/setting-location.module#SettingLocationModule'
      },
      {
        path: 'reason',
        loadChildren: './setting-reason/setting-reason.module#SettingReasonModule'
      },
      {
        path: 'construction',
        loadChildren: './setting-construction/setting-construction.module#SettingConstructionModule'
      },
      {
        path: 'construction-category',
        loadChildren: './setting-construction-category/setting-construction-category.module#SettingConstructionCategoryModule'
      },
      {
        path: 'position',
        loadChildren: './setting-position/setting-position.module#SettingPositionModule'
      },
      {
        path: 'contract',
        component: SettingContractComponent
      },
      {
        path: 'contract/create',
        component: SettingContractCreateComponent
      },
      {
        path: 'contract/edit/:id',
        component: SettingContractEditComponent
      },
      // { path: 'kpi-target', component: SettingKpiTargetComponent }
      {
        path: 'kpi-target',
        loadChildren: './setting-kpi-target/setting-kpi-target.module#SettingKpiTargetModule'
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
