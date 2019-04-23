import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingBidStatusRoutingModule } from './setting-bid-status-routing.module';
import { SettingBidStatusListComponent } from './setting-bid-status-list/setting-bid-status-list.component';
import { SettingBidStatusFormComponent } from './setting-bid-status-form/setting-bid-status-form.component';
import { SettingBidStatusCreateComponent } from './setting-bid-status-create/setting-bid-status-create.component';
import { SharedModule } from '../../../shared/shared.module';
import { SettingBidStatusEditComponent } from './setting-bid-status-edit/setting-bid-status-edit.component';

@NgModule({
  imports: [
    CommonModule,
    SettingBidStatusRoutingModule,
    SharedModule
  ],
  declarations: [SettingBidStatusListComponent, SettingBidStatusFormComponent, SettingBidStatusCreateComponent, SettingBidStatusEditComponent]
})
export class SettingBidStatusModule { }
