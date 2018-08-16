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
  isManageSettings;
  ngOnInit() {
    this.sessionService.getUserInfo().subscribe(result => {
      this.userModel = result;
      if (!this.userModel) {

      }
      this.listPrivileges = this.userModel.privileges;
      this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
      this.isManageUsers = this.listPrivileges.some(x => x === 'ManageUsers');
      this.isManageSettings = this.listPrivileges.some(x => x === 'ManageSettings');
    });
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
    this.isManageUsers = this.listPrivileges.some(x => x === 'ManageUsers');
    this.isManageSettings = this.listPrivileges.some(x => x === 'ManageSettings');
  }

}
