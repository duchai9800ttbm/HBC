import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupUserComponent } from './group-user.component';
import { GroupUserDetailComponent } from './group-user-detail/group-user-detail.component';
import { ManageUserListComponent } from './manage-user-list/manage-user-list.component';
import { AddUserComponent } from './manage-user-list/add-user/add-user.component';
const routes: Routes = [
  {
    path: '',
    component: GroupUserComponent,
    children: [
      { path: '', redirectTo: 'group-user-detail' },
      { path: 'group-user-detail', component: GroupUserDetailComponent },
      // { path: 'manage-user-list', component: ManageUserListComponent}
      {
        path: 'manage-user-list',
        loadChildren: './manage-user-list/manage-user-list.module#ManageUserListModule'
      }

    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupUserRoutingModule { }
