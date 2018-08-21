import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MissPackageNoticeRoutingModule } from './miss-package-notice-routing.module';
import { MissPackageNoticeListComponent } from './miss-package-notice-list/miss-package-notice-list.component';
import { MissPackageNoticeDetailComponent } from './miss-package-notice-detail/miss-package-notice-detail.component';

@NgModule({
  imports: [
    CommonModule,
    MissPackageNoticeRoutingModule
  ],
  declarations: [MissPackageNoticeListComponent, MissPackageNoticeDetailComponent]
})
export class MissPackageNoticeModule { }
