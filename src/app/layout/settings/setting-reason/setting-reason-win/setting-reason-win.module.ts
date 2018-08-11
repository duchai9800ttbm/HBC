import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingReasonWinRoutingModule } from './setting-reason-win-routing.module';
import { SettingReasonWinListComponent } from './setting-reason-win-list/setting-reason-win-list.component';
import { SettingReasonWinCreateComponent } from './setting-reason-win-create/setting-reason-win-create.component';
import { NouisliderModule } from '../../../../../../node_modules/ng2-nouislider';
import { SharedModule } from '../../../../shared/shared.module';
import { SettingReasonWinFormComponent } from './setting-reason-win-form/setting-reason-win-form.component';
import { SettingReasonWinEditComponent } from './setting-reason-win-edit/setting-reason-win-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingReasonWinRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [SettingReasonWinListComponent, SettingReasonWinCreateComponent, SettingReasonWinFormComponent, SettingReasonWinEditComponent]
})
export class SettingReasonWinModule { }
