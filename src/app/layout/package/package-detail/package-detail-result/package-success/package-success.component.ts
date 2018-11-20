import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { CheckStatusPackage } from '../../../../../shared/constants/check-status-package';
import { slideToBottom, slideToTop } from '../../../../../router.animations';
@Component({
  selector: 'app-package-success',
  templateUrl: './package-success.component.html',
  styleUrls: ['./package-success.component.scss'],
  animations: [slideToTop()]
})
export class PackageSuccessComponent implements OnInit {
  packageId: number;
  isActive: boolean;
  arrow: boolean;
  arrowSuccess = true;
  showArrow: boolean;
  kickOff: boolean;
  arrowKickOff: boolean;
  kickOffActive: boolean;
  statusPackage = {
    text: 'TrungThau',
    stage: 'KQDT',
    id: 24,
  };
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private packageService: PackageService
  ) {
  }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.isActive = false;
    this.arrow = false;
    this.arrowSuccess = false;
    this.showArrow = false;
    this.packageService.userId$.subscribe(result => {
      this.isActive = result;
    });
    this.packageService.kickOff$.subscribe(result => {
      this.kickOff = result;
    });
    this.statusPackage = this.packageService.statusPackageValue2;
    // this.packageService.statusPackageValue$.subscribe(status => {
    //   this.statusPackage = status;
    //   if ((this.statusPackage.id > this.checkStatusPackage.DaNhanTaiLieu.id)
    //     || (this.statusPackage.id === this.checkStatusPackage.DaNhanTaiLieu.id)) {
    //     this.kickOffActive = false;
    //     this.arrowKickOff = true;
    //     this.showArrow = false;
    //     this.arrow = true;
    //     this.arrowSuccess = true;
    //   }
    //   // else if ((this.statusPackage.id > this.checkStatusPackage.DaPhanHoiDenPhongHopDong.id)
    //   //   || (this.statusPackage.id === this.checkStatusPackage.DaPhanHoiDenPhongHopDong.id)) {
    //   //   this.isActive = true;
    //   //   this.arrow = true;
    //   //   this.arrowSuccess = false;
    //   //   this.showArrow = false;
    //   //   this.arrowKickOff = false;
    //   //   this.kickOffActive = true;
    //   // }
    // });
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
      if (result.isSendMailKickOff) {
        this.kickOffActive = false;
        this.arrowKickOff = true;
        this.showArrow = false;
        this.arrow = true;
        this.arrowSuccess = true;
      } else if (result.isSignedContract) {
        this.isActive = true;
        this.arrow = false;
        this.arrowSuccess = true;
        this.showArrow = true;
        this.arrowKickOff = false;
        this.kickOffActive = true;
      }
    });
  }

  onClickContract() {
    this.isActive = true;
    this.arrowSuccess = true;
    this.showArrow = true;
    this.arrow = false;
    this.arrowKickOff = false;
    this.kickOffActive = true;
  }

  onClickList() {
    console.log('onClickList');
    this.arrow = true;
    this.arrowSuccess = false;
    this.showArrow = false;
    this.arrowKickOff = false;
    this.kickOffActive = true;
  }

  onClickKickOff() {
    this.kickOffActive = false;
    this.arrowKickOff = true;
    this.showArrow = false;
    this.arrow = true;
    this.arrowSuccess = true;
  }

}
