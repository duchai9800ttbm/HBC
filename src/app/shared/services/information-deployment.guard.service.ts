import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot
} from '@angular/router';
import { Router } from '@angular/router';
import { SessionService } from './session.service';
import { BidStatus } from '../constants/bid-status';
import { PackageService } from './package.service';
import { PackageInfoModel } from '../models/package/package-info.model';
// tslint:disable-next-line: import-blacklist
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { CheckStatusPackage } from '../constants/check-status-package';

@Injectable()
export class ImformationDeploymentGuard implements CanActivate {
  constructor(
    private router: Router,
    private packageService: PackageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const packageId = parseInt(state.url.split('/')[3], 10);
    console.log(packageId);
    switch (route.params.action) {
      case 'edit':
        /**
        * chỉ cho phép edit khi HSDT ở trạng thái chưa giữa bảng phân công tiến độ và đang lặp bản phân công tiến độ
        */
        return this.packageService.getInforPackageID(packageId).map((result: PackageInfoModel) => {
          console.log(CheckStatusPackage[result.stageStatus.id]);
          return result !== null && CheckStatusPackage[result.stageStatus.id].id === CheckStatusPackage.DaXacNhanPhanCong.id;
        });
      case 'create':
        /**
         * chỉ cho phép tạo mới khi HSDT ở trạng thái DaThongBaoTrienKhai
         */
        return this.packageService.getTenderPreparationPlanning(packageId).map(data =>
          data === null) && this.packageService.getInforPackageID(packageId).map((result: PackageInfoModel) =>
            result.stageStatus.id === BidStatus.DaThongBaoTrienKhai);
      default:
        return true;
    }
  }

  navigationUrl(url): boolean {
    this.router.navigate([url]);
    return false;
  }
}
