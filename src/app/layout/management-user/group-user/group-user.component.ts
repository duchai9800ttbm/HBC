import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { UserModel } from '../../../shared/models/user/user.model';
import { SessionService } from '../../../shared/services';
import { Router } from '@angular/router';
@Component({
  selector: 'app-group-user',
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.scss'],
  // animations: [routerTransition()]
})
export class GroupUserComponent implements OnInit {
  isManageUsers;
  isManageUserGroups;
  userModel: UserModel;
  listPrivileges = [];
  constructor(
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    if (this.listPrivileges) {
      this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
      this.isManageUserGroups = this.listPrivileges.some(x => x === 'ManageUserGroups');
    }
    if (!this.isManageUsers && !this.isManageUserGroups) {
      this.router.navigate(['/no-permission']);
    }
  }

}
