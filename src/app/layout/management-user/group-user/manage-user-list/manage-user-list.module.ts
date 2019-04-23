import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { ManagementUserRoutingModule } from '../../management-user-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import { SharedModule } from '../../../../shared/shared.module';
import { ManagementUserListRoutingModule } from './manage-user-list-routing.module';
import { ManageUserListComponent } from './manage-user-list.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    ManagementUserListRoutingModule,
    SharedModule,
    ModalModule.forRoot(),
    FormsModule 
  ],
  declarations: [ManageUserListComponent, AddUserComponent, ManageUserComponent,EditUserComponent]
})
export class ManageUserListModule { }
