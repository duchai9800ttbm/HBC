import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingReasonRejectRoutingModule } from './setting-reason-reject-routing.module';
import { SettingReasonRejectListComponent } from './setting-reason-reject-list/setting-reason-reject-list.component';
import { SettingReasonRejectCreateComponent } from './setting-reason-reject-create/setting-reason-reject-create.component';
import { SettingReasonRejectFormComponent } from './setting-reason-reject-form/setting-reason-reject-form.component';
import { NouisliderModule } from '../../../../../../node_modules/ng2-nouislider';
import { SharedModule } from '../../../../shared/shared.module';
import { SettingReasonRejectEditComponent } from './setting-reason-reject-edit/setting-reason-reject-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingReasonRejectRoutingModule,
    SharedModule,
    NouisliderModule,
  ],
  declarations: [SettingReasonRejectListComponent, SettingReasonRejectCreateComponent, SettingReasonRejectFormComponent, SettingReasonRejectEditComponent]
})
export class SettingReasonRejectModule { }
