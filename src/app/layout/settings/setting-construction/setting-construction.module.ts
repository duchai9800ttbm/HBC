import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingConstructionRoutingModule } from './setting-construction-routing.module';
import { SettingConstructionListComponent } from './setting-construction-list/setting-construction-list.component';
import { SettingConstructionCreateComponent } from './setting-construction-create/setting-construction-create.component';
import { SettingConstructionFormComponent } from './setting-construction-form/setting-construction-form.component';
import { SharedModule } from '../../../shared/shared.module';
import { SettingConstructionEditComponent } from './setting-construction-edit/setting-construction-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingConstructionRoutingModule,
    SharedModule
  ],
  declarations: [SettingConstructionListComponent, SettingConstructionCreateComponent, SettingConstructionFormComponent, SettingConstructionEditComponent]
})
export class SettingConstructionModule { }
