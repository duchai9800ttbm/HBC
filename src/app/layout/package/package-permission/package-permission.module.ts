import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PackagePermissionRoutingModule } from './package-permission-routing.module';
import { PackagePermissionComponent } from './package-permission.component';
import { PackagePermissionUserComponent } from './package-permission-user/package-permission-user.component';
import { SharedModule } from '../../../shared/shared.module';
import { PackagePermissionReviewComponent } from './package-permission-review/package-permission-review.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    PackagePermissionRoutingModule
  ],
  declarations: [PackagePermissionComponent, PackagePermissionUserComponent, PackagePermissionReviewComponent]
})
export class PackagePermissionModule { }
