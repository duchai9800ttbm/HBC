import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingLocationComponent } from './setting-location/setting-location.component';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { NouisliderModule } from '../../../../node_modules/ng2-nouislider';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [SettingsComponent]
})
export class SettingsModule { }
