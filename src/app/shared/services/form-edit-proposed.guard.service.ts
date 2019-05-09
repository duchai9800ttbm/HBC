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

@Injectable()
export class FormEditProposedGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private packageService: PackageService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const packageId = parseInt(state.url.split('/')[3], 10);
    console.log(packageId);
    switch (route.params.action) {
      case 'edit':
        /**
         * chỉ cho phép edit khi trạng thái của HSDT là CanLapDeNghiDuThau
         */
        return this.packageService.getInforPackageID(packageId).map(
          (data: PackageInfoModel) =>
            data.stageStatus.id === BidStatus.CanLapDeNghiDuThau);
      case 'create':
        /**
         * chỉ cho phét tạo khi không tồn tại phiếu đề nghị dự thầu (proposed tender)
         */
        return this.packageService.getProposedTenderParticipateReport(packageId).map(data => data === null);
      default:
        return true;
    }
  }

  navigationUrl(url): boolean {
    this.router.navigate([url]);
    return false;
  }
}
