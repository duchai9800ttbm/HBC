import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingPositionRoutingModule } from './setting-position-routing.module';
import { SharedModule } from '../../../shared/shared.module';
import { SettingPositionComponent } from './setting-position.component';
import { SettingPositionCreateComponent } from './setting-position-create/setting-position-create.component';
import { SettingPositionEditComponent } from './setting-position-edit/setting-position-edit.component';
import { SettingPositionFormComponent } from './setting-position-form/setting-position-form.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    SettingPositionRoutingModule
  ],
  declarations: [
    SettingPositionComponent,
    SettingPositionCreateComponent,
    SettingPositionEditComponent,
    SettingPositionFormComponent
  ]
})
export class SettingPositionModule { }
