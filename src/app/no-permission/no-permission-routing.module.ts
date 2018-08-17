import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NoPermissionComponent } from './no-permission.component';
const routes: Routes = [
  {
    path: '', component: NoPermissionComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NoPermissionRoutingModule { }
