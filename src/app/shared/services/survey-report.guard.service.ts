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
import { SiteSurveyReportService } from './site-survey-report.service';

@Injectable()
export class SurveyReportGuard implements CanActivate {
  constructor(
    private router: Router,
    private sessionService: SessionService,
    private packageService: PackageService,
    private SurveyReportService: SiteSurveyReportService
  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const packageId = parseInt(state.url.split('/')[3], 10);
    console.log(packageId);
    switch (route.params.action) {
      case 'edit':
        /**
         *  khi đã chốt hồ sơ dự thầu thì ko cho edit
         */
        return this.packageService.getInforPackageID(packageId).map((result: PackageInfoModel) => result.isChotHoSo === false);
      case 'create':
        /**
         *  chỉ cho phép tạo khi chưa tồn tại dữ liệu surveying report và đang ở trạng thái DangLapHSDT
         */
        const condition = forkJoin(
          this.packageService.getInforPackageID(packageId)
            .map((data: PackageInfoModel) =>
              CheckStatusPackage[data.stageStatus.id].id === CheckStatusPackage.DangLapHSDT.id),
          this.SurveyReportService.tenderSiteSurveyingReport(packageId).
            map(data => data === null)).map(conditions => conditions[0] && conditions[1]);
        condition.subscribe(data => console.log(data));
        return condition;
      default:
        return true;
    }
  }

  navigationUrl(url): boolean {
    this.router.navigate([url]);
    return false;
  }
}
