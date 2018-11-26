import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedCreateTenderRoutingModule } from './need-create-tender-routing.module';
import { NeedCreateTenderComponent } from './need-create-tender.component';
import { SharedModule } from '../../../../../shared/shared.module';
import { ChangeHistoryPopupComponent } from './change-history-popup/change-history-popup.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NeedCreateTenderRoutingModule
  ],
  declarations: [NeedCreateTenderComponent, ChangeHistoryPopupComponent]
})
export class NeedCreateTenderModule { }
