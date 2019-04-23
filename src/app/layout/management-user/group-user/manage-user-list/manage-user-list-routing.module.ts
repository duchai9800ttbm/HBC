import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageUserListComponent } from '../manage-user-list/manage-user-list.component';
import { ManageUserComponent } from '../manage-user-list/manage-user/manage-user.component';
import { AddUserComponent} from '../manage-user-list/add-user/add-user.component';
import { EditUserComponent } from '../manage-user-list/edit-user/edit-user.component';
const routes: Routes = [
  {
    path: '',
    component: ManageUserListComponent,
    children: [
      { path: '', redirectTo: 'manage-user' },
      { path: 'manage-user', component: ManageUserComponent },
      { path: 'add-user', component: AddUserComponent },
      { path: 'edit-user/:id' , component: EditUserComponent }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementUserListRoutingModule { }
