import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageDetailComponent } from '../package-detail.component';
import { PackageService } from '../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../shared/models/package/package-info.model';
import { Router, ActivatedRoute, NavigationEnd } from '../../../../../../node_modules/@angular/router';
import { StatusObservableHsdtService } from '../../../../shared/services/status-observable-hsdt.service';
import { BidStatus } from '../../../../shared/constants/bid-status';
import { Subscription } from '../../../../../../node_modules/rxjs';
import { CheckStatusPackage } from '../../../../shared/constants/check-status-package';
import { slideToTop, slideToBottom, slideToRight, slideInOut, slideToLeft } from '../../../../router.animations';
@Component({
  selector: 'app-package-detail-file-attend',
  templateUrl: './package-detail-file-attend.component.html',
  styleUrls: ['./package-detail-file-attend.component.scss'],
  animations: [slideToTop()]
})
export class PackageDetailFileAttendComponent implements OnInit, OnDestroy {
  packageId: number;
  packageData: PackageInfoModel;
  currentUrl;
  statusPackageID;
  statusPackage = {
    text: '',
    stage: '',
    id: null,
  };
  bidStatus = BidStatus;
  isNgOnInit = true;
  subscription: Subscription;
  isComponentDetail = false;
  urlChirld = ['create-request', 'infomation-deployment', 'build', 'price-review', 'interview-negotiation'];
  bidProposal = ['CanLapDeNghiDuThau', 'ChoDuyetDeNghiDuThau', 'ThamGiaDuThau', 'DaTuChoi'];
  deployment = ['ChuaThongBaoTrienKhai', 'DaThongBaoTrienKhai', 'DaXacNhanPhanCong', 'DaGuiPhanCongTienDo'];
  setHSDT = ['DangLapHSDT'];
  priceReview = ['CanLapTrinhDuyetGia', 'DaGuiDuyetTrinhDuyetGia',
    'CanDieuChinhTrinhDuyetGia', 'DaDuyetTrinhDuyetGia', 'ChotHoSo', 'DaNopHSDT'];
  interview = ['DaNhanLoiMoi', 'ChuanBiPhongVan', 'DaChotCongTacChuanBiPhongVan', 'DaPhongVan'];
  listStatusPackage = [this.bidProposal, this.deployment, this.setHSDT, this.priceReview, this.interview];
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private packageService: PackageService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private statusObservableHsdtService: StatusObservableHsdtService,
  ) {

  }
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      if (!this.isNgOnInit) {
        this.checkStatusPackageFuc();
      }
    });
    if (this.isNgOnInit) {
      this.checkStatusPackageFuc();
      // this.redirectByStatus(); // Điều hướng
      this.activeRouter.queryParams.subscribe( value => {
        if (value && value.direction === 'true') {
          this.redirectByStatus(); // Điều hướng
        }
      });
      this.isNgOnInit = false;
    }
    this.isComponentDetail = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.isComponentDetail = false;
  }

  checkStatusPackageFuc() {
    if (this.activeRouter.firstChild) {
      this.activeRouter.firstChild.url.subscribe(url => {
        this.currentUrl = url[0].path;
        if (this.urlChirld.find(item => item === this.currentUrl)) {
          this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
            // console.log('statusPackage111', this.statusPackage, this.currentUrl);
            // if (this.statusPackage.id === this.checkStatusPackage.DangLapHSDT.id) {
            //   this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
            // }
          });
        }
      });
    }
    this.subscription = this.router.events.subscribe((val) => {
      if (this.isComponentDetail) {
        if ((val instanceof NavigationEnd) === true) {
           if (this.activeRouter.firstChild) {
            this.activeRouter.firstChild.url.subscribe(url => {
              this.currentUrl = url[0].path;
              if (this.urlChirld.find(item => item === this.currentUrl)) {
                this.packageService.getInforPackageID(this.packageId).subscribe(result => {
                  this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
                  // console.log('statusPackage222', this.statusPackage, this.currentUrl);
                });
              }
            });
          }
        }
      }
    });
  }

  redirectByStatus() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
      switch (this.packageData.stageStatus.id) {
        case this.bidStatus.CanLapDeNghiDuThau: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
          break;
        }
        case this.bidStatus.ChoDuyetDeNghiDuThau: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
          break;
        }
        case this.bidStatus.ThamGiaDuThau: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
          break;
        }
        case this.bidStatus.TuChoiDuThau: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
          break;
        }
        case this.bidStatus.ChuaThongBaoTrienKhai: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
          break;
        }
        case this.bidStatus.DaThongBaoTrienKhai: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
          break;
        }
        case this.bidStatus.DaXacNhanPhanCong: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
          break;
        }
        case this.bidStatus.DaGuiPhanCongTienDo: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
          break;
        }
        case this.bidStatus.DangLapHSDT: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/build`]);
          break;
        }
        case this.bidStatus.CanLapTrinhDuyetGia: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.DaGuiDuyetTrinhDuyetGia: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.CanDieuChinhTrinhDuyetGia: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.DaDuyetTrinhDuyetGia: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.ChotHoSo: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.DaNopHSDT: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
          break;
        }
        case this.bidStatus.DaNhanLoiMoi: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/create`]);
          break;
        }
        case this.bidStatus.ChuanBiPhongVan: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/prepare`]);
          break;
        }
        case this.bidStatus.DaChotCongTacChuanBiPhongVan: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
          break;
        }
        case this.bidStatus.DaPhongVan: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
          break;
        }
        default: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
          break;
        }
      }
    });

  }

}
