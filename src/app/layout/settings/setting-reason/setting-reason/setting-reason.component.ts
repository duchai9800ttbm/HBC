import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Router } from '@angular/router';
import { SessionService } from '../../../../shared/services';
import { UserModel } from '../../../../shared/models/user/user.model';

@Component({
  selector: 'app-setting-reason',
  templateUrl: './setting-reason.component.html',
  styleUrls: ['./setting-reason.component.scss'],
  // animations: [routerTransition()]
})
export class SettingReasonComponent implements OnInit {
  userModel: UserModel;
  listPrivileges = [];
  isManageInformationSettings;
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    this.isManageInformationSettings = this.listPrivileges.some(x => x === 'ManageInformationSettings');
    if (!this.isManageInformationSettings) {
      this.router.navigate(['/no-permission']);
    }
  }

}
