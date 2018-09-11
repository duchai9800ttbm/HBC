import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../shared/services';
import { UserModel } from '../../../../shared/models/user/user.model';

@Component({
  selector: 'app-header-menu',
  templateUrl: './header-menu.component.html',
  styleUrls: ['./header-menu.component.scss']
})
export class HeaderMenuComponent implements OnInit {
  userModel: UserModel;
  listPrivileges = [];
  constructor(
    private sessionService: SessionService
  ) { }
  isManageBidOpportunitys;
  isManageUsers;
  isManageUserGroups;
  isManageSettings;
  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    console.log(this.userModel);
    this.listPrivileges = this.userModel.privileges;
    if (this.listPrivileges) {
      this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
      this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
      this.isManageSettings = this.listPrivileges.some(x => x === 'ManageSettings');
      this.isManageUserGroups = this.listPrivileges.some(x => x === 'ManageUserGroups');
    }
  }

}
