import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManagementUserComponent } from './management-user.component';
import { GroupUserComponent } from './group-user/group-user.component'
const routes: Routes = [
  { path: '', redirectTo: 'group-user' },
  { path: 'group-user', loadChildren: './group-user/group-user.module#GroupUserModule' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementUserRoutingModule { }
