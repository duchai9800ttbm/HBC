import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WinPackageNoticeRoutingModule } from './win-package-notice-routing.module';
import { WinPackageNoticeListComponent } from './win-package-notice-list/win-package-notice-list.component';
import { WinPackageNoticeDetailComponent } from './win-package-notice-detail/win-package-notice-detail.component';
import { WinPackageNoticeComponent } from './win-package-notice.component';
import { SharedModule } from '../../../../shared/shared.module';
import { EmailDetailModule } from '../email-detail/email-detail.module';

@NgModule({
  imports: [
    CommonModule,
    WinPackageNoticeRoutingModule,
    SharedModule,
    EmailDetailModule
  ],
  declarations: [
    WinPackageNoticeComponent,
    WinPackageNoticeListComponent,
    WinPackageNoticeDetailComponent
  ]
})
export class WinPackageNoticeModule { }
