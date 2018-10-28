import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '../../../../../node_modules/@angular/router';
import { routerTransition } from '../../../router.animations';
import { PackageModel } from '../../../shared/models/package/package.model';
import { FakePackageData } from '../../../shared/fake-data/package-data';
import { PackageService } from '../../../shared/services/package.service';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';
import { UserModel } from '../../../shared/models/user/user.model';
import { SessionService } from '../../../shared/services/session.service';
import { PackageInfoModel } from '../../../shared/models/package/package-info.model';
import { LayoutService } from '../../../shared/services/layout.service';
import { CheckStatusPackage } from '../../../shared/constants/check-status-package';

@Component({
  selector: 'app-package-detail',
  templateUrl: './package-detail.component.html',
  styleUrls: ['./package-detail.component.scss'],
  // animations: [routerTransition()]

})
export class PackageDetailComponent implements OnInit {
  static packageId;
  checkStatusPackage = CheckStatusPackage;
  statusPackage = {
    text: '',
    stage: '',
    id: null,
  };
  constructor(
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService,
    private layoutService: LayoutService
  ) { }
  public packageId: number;
  packageData = new PackageInfoModel();
  status = {
    DisabledfileAttend: true,
    Disabledresult: true
  };
  userModel: UserModel;
  listPrivileges = [];
  // isManageBidOpportunitys;
  isEditBidOpportunity;
  isViewBidOpportunityDetail;
  isToggle = false;
  ngOnInit() {
    setTimeout(() => {
      this.userModel = this.sessionService.userInfo;
      this.listPrivileges = this.userModel.privileges;
      if (this.listPrivileges) {
        this.isEditBidOpportunity = this.listPrivileges.some(x => x === 'EditBidOpportunity');
        this.isViewBidOpportunityDetail = this.listPrivileges.some(x => x === 'ViewBidOpportunityDetail');
        if (!this.isEditBidOpportunity && !this.isViewBidOpportunityDetail) {
          this.router.navigate(['/no-permission']);
        }
      }
    }, 300);

    this.activetedRoute.params.subscribe(result => {
      this.packageId = +result.id;
      PackageDetailComponent.packageId = this.packageId;
    });
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
      this.statusPackage = this.checkStatusPackage[this.packageData.stageStatus.id];
    }, err => {
    });

    this.layoutService.watchLayoutSubject().subscribe(data => {
      if (data) {
        this.isToggle = true;
      } else {
        this.isToggle = false;
      }
    });
  }

  get staticPackageId() {
    return PackageDetailComponent.packageId;
  }

  filePackageInvitation() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  filePackageAttend() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  packageInfo() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }
  packageResult() {
    if (this.packageId) {
      this.router.navigate([`/package/detail/${this.packageId}/invitation`]);
    }
  }

  isActive(instruction: any[]): boolean {
    return this.router.isActive(this.router.createUrlTree(instruction), false);
  }

  routerEmail() {
    this.packageService.routerBeforeEmail = this.router.url;
    this.router.navigate([`/package/email/${this.packageId}`]);
  }
  // routerModuleKQDT() {
  //   if (this.statusPackage.id > this.checkStatusPackage.ChoKetQuaDuThau.id) {
  //     this.router.navigate([`/package/detail/${this.packageId}/result`]);
  //   }
  // }
}
