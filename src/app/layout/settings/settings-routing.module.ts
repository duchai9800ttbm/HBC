import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingsComponent } from './settings.component';
import { SettingLocationComponent } from './setting-location/setting-location.component';

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
      // {
      //   path: 'bid-status',
      //   loadChildren: './setting-bid-status/setting-bid-status.module#SettingBidStatusModule'
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
