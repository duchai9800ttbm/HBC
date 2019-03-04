import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../../../shared/services';
import { UserModel } from '../../../../shared/models/user/user.model';
import { AdministeredPackageList } from '../../../../shared/constants/administered-package';
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
  isManageReport;
  isManageSettings;
  administeredPackageList = AdministeredPackageList;
  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    if (this.listPrivileges) {
      // this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
      this.isManageBidOpportunitys = this.administeredPackageList.some( r => this.listPrivileges.includes(r));
      this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
      this.isManageSettings = this.listPrivileges.some(x => x === 'ManageSettings');
      this.isManageUserGroups = this.listPrivileges.some(x => x === 'ManageUserGroups');
      this.isManageReport = this.listPrivileges.some(x => x === 'ManageTrackingReports');
    }
  }

}
