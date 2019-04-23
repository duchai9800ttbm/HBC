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
  isManageKPISettings;
  constructor(
    private router: Router,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    this.isManageInformationSettings = this.listPrivileges.some(x => x === 'ManageInformationSettings');
    this.isManageKPISettings = this.listPrivileges.some(x => x === 'ManageKPISettings');
    if (!this.isManageInformationSettings) {
      if (this.isManageKPISettings) {
        this.router.navigate(['/settings/kpi-target']);
      } else {
        this.router.navigate(['/no-permission']);
      }
    }
  }

}
