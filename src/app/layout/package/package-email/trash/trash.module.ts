import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrashRoutingModule } from './trash-routing.module';
import { TrashListComponent } from './trash-list/trash-list.component';
import { TrashDetailComponent } from './trash-detail/trash-detail.component';
import { TrashComponent } from './trash.component';
import { EmailDetailModule } from '../email-detail/email-detail.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    TrashRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    TrashComponent,
    TrashListComponent,
    TrashDetailComponent
  ]
})
export class TrashModule { }
