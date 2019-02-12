import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { SettingKpiTargetComponent } from './setting-kpi-target.component';
import { SettingKpiTargetRoutingModule } from './setting-kpi-target-routing.module';
import { KpiChairComponent } from './kpi-chair/kpi-chair.component';
import { WinBidComponent } from './win-bid/win-bid.component';
import { KpiAreaComponent } from './kpi-area/kpi-area.component';
import { ConstructionItemsComponent } from './construction-items/construction-items.component';
import { TypeConstructionComponent } from './type-construction/type-construction.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingKpiTargetRoutingModule
  ],
  declarations: [
    SettingKpiTargetComponent,
    KpiChairComponent,
    WinBidComponent,
    KpiAreaComponent,
    ConstructionItemsComponent,
    TypeConstructionComponent,
  ]
})
export class SettingKpiTargetModule { }
