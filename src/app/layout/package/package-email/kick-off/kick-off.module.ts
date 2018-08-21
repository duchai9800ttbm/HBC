import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { KickOffRoutingModule } from './kick-off-routing.module';
import { KickOffListComponent } from './kick-off-list/kick-off-list.component';
import { KickOffDetailComponent } from './kick-off-detail/kick-off-detail.component';

@NgModule({
  imports: [
    CommonModule,
    KickOffRoutingModule
  ],
  declarations: [KickOffListComponent, KickOffDetailComponent]
})
export class KickOffModule { }
