import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingLocationRoutingModule } from './setting-location-routing.module';
import { SettingLocationComponent } from './setting-location.component';
import { NouisliderModule } from '../../../../../node_modules/ng2-nouislider';
import { SharedModule } from '../../../shared/shared.module';
import { SettingLocationFormComponent } from './setting-location-form/setting-location-form.component';
import { SettingLocationCreateComponent } from './setting-location-create/setting-location-create.component';
import { SettingLocationEditComponent } from './setting-location-edit/setting-location-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingLocationRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [SettingLocationCreateComponent, SettingLocationComponent, SettingLocationFormComponent, SettingLocationCreateComponent, SettingLocationEditComponent]
})
export class SettingLocationModule { }
