import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PackagePermissionComponent } from './package-permission.component';
import { PackagePermissionUserComponent } from './package-permission-user/package-permission-user.component';
import { PackagePermissionReviewComponent } from './package-permission-review/package-permission-review.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PackagePermissionRoutingModule { }
