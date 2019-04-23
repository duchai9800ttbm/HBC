import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KickOffRoutingModule } from './kick-off-routing.module';
import { KickOffListComponent } from './kick-off-list/kick-off-list.component';
import { KickOffDetailComponent } from './kick-off-detail/kick-off-detail.component';
import { KickOffComponent } from './kick-off.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    KickOffRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    KickOffComponent,
    KickOffListComponent,
    KickOffDetailComponent
  ]
})
export class KickOffModule { }
