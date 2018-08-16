import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { PackageModel } from '../../../shared/models/package/package.model';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { SessionService } from '../../../shared/services';
import { UserModel } from '../../../shared/models/user/user.model';
@Component({
    selector: 'app-package-create',
    templateUrl: './package-create.component.html',
    styleUrls: ['./package-create.component.scss'],
    animations: [routerTransition()]
})
export class PackageCreateComponent implements OnInit {
    packageModel = new PackageModel();
    userModel: UserModel;
    listPrivileges = [];
    isCreateBidOpportunity;
    isManageBidOpportunitys;
    constructor(
        private activatedRoute: ActivatedRoute,
        private sessionService: SessionService,
        private router: Router
    ) {
    }

    ngOnInit() {
        this.sessionService.getUserInfo().subscribe(result => {
            this.userModel = result;
            this.listPrivileges = this.userModel.privileges;
            if (this.listPrivileges) {
                this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
                this.isCreateBidOpportunity = this.listPrivileges.some(x => x === 'CreateBidOpportunity');
                if (!this.isCreateBidOpportunity) {
                    this.router.navigate(['/not-found']);
                }
            }
        });
        this.userModel = this.sessionService.userInfo;
        this.listPrivileges = this.userModel.privileges;
        if (this.listPrivileges) {
            this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
            this.isCreateBidOpportunity = this.listPrivileges.some(x => x === 'CreateBidOpportunity');
            if (!this.isCreateBidOpportunity) {
                this.router.navigate(['/not-found']);
            }
        }

    }

}
