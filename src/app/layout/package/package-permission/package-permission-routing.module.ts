import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagePermissionComponent } from './package-permission.component';
import { PackagePermissionUserComponent } from './package-permission-user/package-permission-user.component';
import { PackagePermissionReviewComponent } from './package-permission-review/package-permission-review.component';
import { PackagePermissionResultComponent } from './package-permission-result/package-permission-result.component';
import { PackagePermissionBidComponent } from './package-permission-bid/package-permission-bid.component';

const routes: Routes = [
  {
    path: '',
    component: PackagePermissionComponent,
    children: [
      {
        path: '',
        redirectTo: 'user'
      },
      {
        path: 'user',
        component: PackagePermissionUserComponent
      },
      {
        path: 'review',
        component: PackagePermissionReviewComponent
      },
      {
        path: 'bid',
        component: PackagePermissionBidComponent
      },
      {
        path: 'result',
        component: PackagePermissionResultComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagePermissionRoutingModule { }
