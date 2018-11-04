import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CheckStatusPackage } from '../../../../../../../shared/constants/check-status-package';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { FilterTransferredDoc } from '../../../../../../../shared/models/result-attend/filter-transferred-doc.model';
import { SessionService } from '../../../../../../../shared/services';
import { PermissionService } from '../../../../../../../shared/services/permission.service';
import { Subscription } from '../../../../../../../../../node_modules/rxjs';
import { PermissionModel } from '../../../../../../../shared/models/permission/permission.model';

@Component({
  selector: 'app-package-document',
  templateUrl: './package-document.component.html',
  styleUrls: ['./package-document.component.scss']
})
export class PackageDocumentComponent implements OnInit, OnDestroy {
  @Input() isContract;
  statusPackage = {
    text: 'TrungThau',
    stage: 'KQDT',
    id: null,
  };
  checkStatusPackage = CheckStatusPackage;
  currentPackageId: number;
  newfilter = new FilterTransferredDoc();
  checkUser = false;
  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  ChuyenGiaoTaiLieu = false;
  constructor(
    private packageService: PackageService,
    private detailResultPackageService: DetailResultPackageService,
    private sessionService: SessionService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.statusPackage = this.packageService.statusPackageValue2;
    this.isContract = false;
    const userInfo = this.sessionService.currentUserInfo;
    this.packageService.statusPackageValue$.subscribe(status => {
      this.statusPackage = status;
      // this.detailResultPackageService.filterTransferDocDetailsList(
      //   this.currentPackageId,
      //   '',
      //   this.newfilter
      // ).subscribe(response => {
      //   console.log('QUYHEEFFFF', response);
      //   this.checkUser = response.some(itemResponse => {
      //     if (itemResponse.bidTransferDocDetails && itemResponse.bidTransferDocDetails.length !== 0) {
      //       return itemResponse.bidTransferDocDetails.some(itemDoc => {
      //         if (itemDoc.sendEmployee && (itemDoc.sendEmployee.employeeId === userInfo.employeeId)) {
      //           return true;
      //         } else {
      //           return false;
      //         }
      //       });
      //     } else {
      //       return false;
      //     }
      //   });
      //   console.log('this.statusPackage-Q-check', this.statusPackage, this.checkUser);
      // });
    });

    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'KQDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'KetQuaDuThau')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }
      }
      this.ChuyenGiaoTaiLieu = this.listPermissionScreen.includes('ChuyenGiaoTaiLieu');
      console.log('this.ChuyenGiaoTaiLieu', this.ChuyenGiaoTaiLieu);
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
