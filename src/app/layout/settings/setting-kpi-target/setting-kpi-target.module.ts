import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';
import { SettingKpiTargetComponent } from './setting-kpi-target.component';
import { SettingKpiTargetRoutingModule } from './setting-kpi-target-routing.module';
import { GroupConfigurationComponent } from './group-configuration/group-configuration.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingKpiTargetRoutingModule
  ],
  declarations: [
    SettingKpiTargetComponent,
    GroupConfigurationComponent
  ]
})
export class SettingKpiTargetModule { }
