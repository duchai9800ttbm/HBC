import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EmailDetailComponent } from './email-detail.component';
import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    EmailDetailComponent
  ],
  exports: [
    EmailDetailComponent
  ]
})
export class EmailDetailModule { }
