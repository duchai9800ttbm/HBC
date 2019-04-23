import { Component, OnInit, OnDestroy } from '@angular/core';
import { GroupUserModel } from '../../../../shared/models/user/group-user.model';
import { GridDataResult, PageChangeEvent } from '@progress/kendo-angular-grid';
import { GroupUserService } from '../../../../shared/services/group-user.service';
import { Router } from '@angular/router';
import { UserModel } from '../../../../shared/models/user/user.model';
import { SessionService } from '../../../../shared/services';

@Component({
  selector: 'app-manage-user-list',
  templateUrl: './manage-user-list.component.html',
  styleUrls: ['./manage-user-list.component.scss']
})
export class ManageUserListComponent implements OnInit, OnDestroy {

  userModel: UserModel;
  listPrivileges = [];
  isManageUsers;
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private groupUserService: GroupUserService,
  ) {

  }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    if (this.listPrivileges) {
      this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
    }
    if (!this.isManageUsers) {
      this.router.navigate(['/no-permission']);
    }
  }

  ngOnDestroy() {
    this.groupUserService.destroySearchTerm();
  }

}
