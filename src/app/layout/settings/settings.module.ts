import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingLocationComponent } from './setting-location/setting-location.component';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../../shared/shared.module';
import { NouisliderModule } from '../../../../node_modules/ng2-nouislider';
import { SettingContractComponent } from './setting-contract/setting-contract.component';
import { SettingContractCreateComponent } from './setting-contract/setting-contract-create/setting-contract-create.component';
import { SettingContractEditComponent } from './setting-contract/setting-contract-edit/setting-contract-edit.component';
import { SettingContractFormComponent } from './setting-contract/setting-contract-form/setting-contract-form.component';

@NgModule({
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [
    SettingsComponent,
    SettingContractComponent,
    SettingContractCreateComponent,
    SettingContractEditComponent,
    SettingContractFormComponent
  ]
})
export class SettingsModule { }
