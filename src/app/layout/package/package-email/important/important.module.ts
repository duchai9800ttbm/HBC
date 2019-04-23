import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ImportantRoutingModule } from './important-routing.module';
import { ImportantListComponent } from './important-list/important-list.component';
import { ImportantDetailComponent } from './important-detail/important-detail.component';
import { ImportantComponent } from './important.component';
import { EmailDetailModule } from '../email-detail/email-detail.module';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    ImportantRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    ImportantComponent,
    ImportantListComponent,
    ImportantDetailComponent
  ]
})
export class ImportantModule { }
