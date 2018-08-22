import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssignRoutingModule } from './assign-routing.module';
import { AssignListComponent } from './assign-list/assign-list.component';
import { AssignDetailComponent } from './assign-detail/assign-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { AssignComponent } from './assign.component';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    AssignRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    AssignComponent,
    AssignListComponent,
    AssignDetailComponent
  ]
})
export class AssignModule { }
