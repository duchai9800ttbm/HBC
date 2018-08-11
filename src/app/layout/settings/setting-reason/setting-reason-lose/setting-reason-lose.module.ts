import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingReasonLoseRoutingModule } from './setting-reason-lose-routing.module';
import { SettingReasonLoseListComponent } from './setting-reason-lose-list/setting-reason-lose-list.component';
import { SettingReasonLoseCreateComponent } from './setting-reason-lose-create/setting-reason-lose-create.component';
import { SettingReasonLoseFormComponent } from './setting-reason-lose-form/setting-reason-lose-form.component';
import { NouisliderModule } from '../../../../../../node_modules/ng2-nouislider';
import { SharedModule } from '../../../../shared/shared.module';
import { SettingReasonLoseEditComponent } from './setting-reason-lose-edit/setting-reason-lose-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingReasonLoseRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [SettingReasonLoseListComponent, SettingReasonLoseCreateComponent, SettingReasonLoseFormComponent, SettingReasonLoseEditComponent]
})
export class SettingReasonLoseModule { }
