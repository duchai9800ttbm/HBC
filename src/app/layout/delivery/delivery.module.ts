import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeliveryRoutingModule } from './delivery-routing.module';
import { DeliveryComponent } from './delivery.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    DeliveryRoutingModule,
    SharedModule
  ],
  declarations: [DeliveryComponent]
})
export class DeliveryModule { }
