import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingReasonRoutingModule } from './setting-reason-routing.module';
import { SettingReasonComponent } from './setting-reason/setting-reason.component';
import { SharedModule } from '../../../shared/shared.module';
import { BrowserAnimationsModule } from '../../../../../node_modules/@angular/platform-browser/animations';

@NgModule({
  imports: [
    CommonModule,
    SettingReasonRoutingModule
  ],
  declarations: [SettingReasonComponent]
})
export class SettingReasonModule { }
