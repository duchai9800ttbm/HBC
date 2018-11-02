import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { CheckStatusPackage } from '../../../../../shared/constants/check-status-package';
@Component({
  selector: 'app-package-success',
  templateUrl: './package-success.component.html',
  styleUrls: ['./package-success.component.scss']
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
    this.packageService.statusPackageValue$.subscribe(status => {
      this.statusPackage = status;
      console.log('package-success', this.statusPackage.id, this.checkStatusPackage.DaNhanTaiLieu.id);
    });
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
  }

  onClickContract() {
    this.isActive = true;
    this.arrowSuccess = true;
    this.showArrow = true;
    this.arrow = false;
    this.arrowKickOff = false;
    // this.kickOffActive = true;
  }

  onClickList() {
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
