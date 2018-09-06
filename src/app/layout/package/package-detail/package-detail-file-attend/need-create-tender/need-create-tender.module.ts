import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NeedCreateTenderRoutingModule } from './need-create-tender-routing.module';
import { NeedCreateTenderComponent } from './need-create-tender.component';
import { SharedModule } from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    NeedCreateTenderRoutingModule
  ],
  declarations: [NeedCreateTenderComponent]
})
export class NeedCreateTenderModule { }
