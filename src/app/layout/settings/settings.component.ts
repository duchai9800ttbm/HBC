import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { Router } from '../../../../node_modules/@angular/router';
import { UserModel } from '../../shared/models/user/user.model';
import { SessionService } from '../../shared/services/session.service';

@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss'],
    // animations: [routerTransition()]
})
export class SettingsComponent implements OnInit {
    isManageSettings;
    isManageInformationSettings;
    isManageKPISettings;
    userModel: UserModel;
    listPrivileges = [];
    @ViewChild('kMenuLink') menu: any;
    reasonList: any[] = [
        {
            text: 'Lý do',
            items: [
                { text: 'Lý do trúng thầu', path: '/settings/reason/win' },
                { text: 'Lý do trật thầu', path: '/settings/reason/lose' },
                { text: 'Lý do hủy thầu', path: '/settings/reason/reject' }
            ]
        }
    ];
    constructor(
        private router: Router,
        private sessionService: SessionService
    ) {}

    ngOnInit() {
        this.userModel = this.sessionService.userInfo;
        this.listPrivileges = this.userModel.privileges;
        if (this.listPrivileges) {
          this.isManageSettings = this.listPrivileges.some(x => (x === 'ManageInformationSettings' || x === 'ManageKPISettings'));
          this.isManageInformationSettings = this.listPrivileges.some(x => x === 'ManageInformationSettings');
          this.isManageKPISettings = this.listPrivileges.some(x => x === 'ManageKPISettings');
        }
        if (!this.isManageSettings) {
            this.router.navigate(['/no-permission']);
        }
        // this.router.
    }
}
