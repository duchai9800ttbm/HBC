import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ManagementUserComponent } from './management-user.component';
import { ManagementUserRoutingModule } from './management-user-routing.module';
import { GroupUserComponent } from './group-user/group-user.component';
@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    ManagementUserRoutingModule
  ],
  declarations: [ManagementUserComponent]
})
export class ManagementUserModule { }
