import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissPackageNoticeRoutingModule } from './miss-package-notice-routing.module';
import { MissPackageNoticeListComponent } from './miss-package-notice-list/miss-package-notice-list.component';
import { MissPackageNoticeDetailComponent } from './miss-package-notice-detail/miss-package-notice-detail.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';
import { MissPackageNoticeComponent } from './miss-package-notice.component';

@NgModule({
  imports: [
    CommonModule,
    MissPackageNoticeRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    MissPackageNoticeComponent,
    MissPackageNoticeListComponent,
    MissPackageNoticeDetailComponent
  ]
})
export class MissPackageNoticeModule { }
