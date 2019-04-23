import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SettingKpiTargetComponent } from './setting-kpi-target.component';
import { KpiChairComponent } from './kpi-chair/kpi-chair.component';
import { WinBidComponent } from './win-bid/win-bid.component';
import { KpiAreaComponent } from './kpi-area/kpi-area.component';
import { TypeConstructionComponent } from './type-construction/type-construction.component';
import { ConstructionItemsComponent } from './construction-items/construction-items.component';
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
        loadChildren: './group-configuration/group-configuration.module#GroupConfigurationModule'
      },
      {
        path: 'kpi-chair',
        component: KpiChairComponent
      },
      {
        path: 'win-bid',
        component: WinBidComponent
      },
      {
        path: 'kpi-area',
        component: KpiAreaComponent
      },
      {
        path: 'construction-items',
        component: ConstructionItemsComponent
      },
      {
        path: 'type-construction',
        component: TypeConstructionComponent
      },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingKpiTargetRoutingModule { }
