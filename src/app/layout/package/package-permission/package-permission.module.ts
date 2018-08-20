import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagePermissionRoutingModule } from './package-permission-routing.module';
import { PackagePermissionComponent } from './package-permission.component';
import { PackagePermissionUserComponent } from './package-permission-user/package-permission-user.component';
import { SharedModule } from '../../../shared/shared.module';
import { PackagePermissionReviewComponent } from './package-permission-review/package-permission-review.component';
import { PackagePermissionResultComponent } from './package-permission-result/package-permission-result.component';
import { PackagePermissionBidComponent } from './package-permission-bid/package-permission-bid.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PackagePermissionRoutingModule
  ],
  declarations: [PackagePermissionComponent, PackagePermissionUserComponent, PackagePermissionReviewComponent, PackagePermissionResultComponent, PackagePermissionBidComponent]
})
export class PackagePermissionModule { }
