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
import { forkJoin } from 'rxjs/observable/forkJoin';
import { PriceReviewService } from './price-review.service';

@Injectable()
export class FormPricePrivewEditGuard implements CanActivate {
  constructor(
    private router: Router,
    private packageService: PackageService,
    private priceReviewService: PriceReviewService,
  ) { }
  /**
   * chỉ cho phép edit khi chưa chốt HSDT và ở bước lặp trình duyệt giá trở đi và đã có dữ liệu
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const packageId = parseInt(state.url.split('/')[3], 10);
    console.log(packageId);
    const condition = forkJoin(
      this.packageService.getInforPackageID(packageId)
      .map((data: PackageInfoModel) =>
        CheckStatusPackage[data.stageStatus.id].id >= CheckStatusPackage.DangLapHSDT.id && !data.isChotHoSo
      ),
      this.priceReviewService.viewShort(packageId).map(data => data !== null)
    ).map(conditions => conditions[0] && conditions[1]);
    return condition;
  }

  navigationUrl(url): boolean {
    this.router.navigate([url]);
    return false;
  }
}

@Injectable()
export class FormPricePrivewCreateGuard implements CanActivate {
  constructor(
    private router: Router,
    private packageService: PackageService,
    private priceReviewService: PriceReviewService
  ) { }
  /**
   * chỉ cho phép tạo mới khi ở trang thái DangLapHSDT và không tồn tại dữ liệu
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const packageId = parseInt(state.url.split('/')[3], 10);
    console.log(packageId);
    const condition = forkJoin(
      this.packageService.getInforPackageID(packageId)
      .map((data: PackageInfoModel) =>
        CheckStatusPackage[data.stageStatus.id].id >= CheckStatusPackage.DangLapHSDT.id
      ),
      this.priceReviewService.viewShort(packageId).map(data => data == null)
    ).map(conditions => conditions[0] && conditions[1]);
    return condition;
  }

  navigationUrl(url): boolean {
    this.router.navigate([url]);
    return false;
  }
}
