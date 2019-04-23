import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../shared/shared.module';

import { GroupUserRoutingModule } from './group-user-routing.module';
import { GroupUserDetailComponent } from './group-user-detail/group-user-detail.component';
import { GroupUserComponent } from './group-user.component';
import { GridModule } from '@progress/kendo-angular-grid';
import { FormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
@NgModule({
  imports: [
    CommonModule,
    GroupUserRoutingModule,
    GridModule,
    FormsModule,
    SharedModule,
    ModalModule.forRoot()
  ],
  declarations: [
    GroupUserDetailComponent,
    GroupUserComponent
  ],
})
export class GroupUserModule { }
