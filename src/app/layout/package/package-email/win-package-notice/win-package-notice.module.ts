import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WinPackageNoticeRoutingModule } from './win-package-notice-routing.module';
import { WinPackageNoticeListComponent } from './win-package-notice-list/win-package-notice-list.component';
import { WinPackageNoticeDetailComponent } from './win-package-notice-detail/win-package-notice-detail.component';

@NgModule({
  imports: [
    CommonModule,
    WinPackageNoticeRoutingModule
  ],
  declarations: [WinPackageNoticeListComponent, WinPackageNoticeDetailComponent]
})
export class WinPackageNoticeModule { }
