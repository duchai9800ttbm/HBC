import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RevenueDetailRoutingModule } from './revenue-detail-routing.module';
import { RevenueDetailComponent } from './revenue-detail.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RevenueDetailRoutingModule,
    SharedModule
  ],
  declarations: [RevenueDetailComponent]
})
export class RevenueDetailModule { }
