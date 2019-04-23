import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeployNoticeRoutingModule } from './deploy-notice-routing.module';
import { DeployNoticeListComponent } from './deploy-notice-list/deploy-notice-list.component';
import { DeployNoticeDetailComponent } from './deploy-notice-detail/deploy-notice-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';
import { DeployNoticeComponent } from './deploy-notice.component';

@NgModule({
  imports: [
    CommonModule,
    DeployNoticeRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    DeployNoticeComponent,
    DeployNoticeListComponent,
    DeployNoticeDetailComponent
  ]
})
export class DeployNoticeModule { }
