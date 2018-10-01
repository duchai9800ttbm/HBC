import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../package-detail.component';
import { PackageService } from '../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../shared/models/package/package-info.model';
import { Router, ActivatedRoute, NavigationEnd } from '../../../../../../node_modules/@angular/router';
import { StatusObservableHsdtService } from '../../../../shared/services/status-observable-hsdt.service';
import { BidStatus } from '../../../../shared/constants/bid-status';
@Component({
  selector: 'app-package-detail-file-attend',
  templateUrl: './package-detail-file-attend.component.html',
  styleUrls: ['./package-detail-file-attend.component.scss']
})
export class PackageDetailFileAttendComponent implements OnInit {
  packageId: number;
  packageData: PackageInfoModel;
  currentUrl;
  statusPackageID;
  statusPackageName;
  bidStatus = BidStatus;
  urlChirld = ['create-request', 'infomation-deployment', 'build', 'price-review', 'interview-negotiation'];
  bidProposal = ['CanLapDeNghiDuThau', 'ChoDuyetDeNghiDuThau', 'ThamGiaDuThau', 'DaTuChoi'];
  deployment = ['ChuaThongBaoTrienKhai', 'DaThongBaoTrienKhai', 'DaXacNhanPhanCong', 'DaGuiPhanCongTienDo'];
  setHSDT = ['DangLapHSDT'];
  priceReview = ['CanLapTrinhDuyetGia', 'DaGuiDuyetTrinhDuyetGia',
    'CanDieuChinhTrinhDuyetGia', 'DaDuyetTrinhDuyetGia', 'ChotHoSo', 'DaNopHSDT'];
  interview = ['DaNhanLoiMoi', 'ChuanBiPhongVan', 'DaChotCongTacChuanBiPhongVan', 'DaPhongVan'];
  listStatusPackage = [this.bidProposal, this.deployment, this.setHSDT, this.priceReview, this.interview];
  constructor(
    private packageService: PackageService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private statusObservableHsdtService: StatusObservableHsdtService,
  ) {

  }

  ngOnInit() {
    this.checkStatusPackage();
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      this.packageService.getInforPackageID(this.packageId).subscribe(result => {
        this.packageData = result;
        this.statusPackageName = this.packageData.stageStatus.id;
        for (let i = 0; i < this.listStatusPackage.length; i++) {
          if (this.listStatusPackage[i].find(item => item === this.packageData.stageStatus.id)) {
            this.statusPackageID = i;
            break;
          }
        }
      });
    });
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
      this.statusPackageName = this.packageData.stageStatus.id;
      this.redirectByStatus();
    });
  }

  checkStatusPackage() {
    this.packageId = +PackageDetailComponent.packageId;
    this.router.events.subscribe((val) => {
      if ((val instanceof NavigationEnd) === true) {
        if (this.activeRouter.firstChild) {
          this.activeRouter.firstChild.url.subscribe(url => {
            this.currentUrl = url[0].path;
            if (this.urlChirld.find( item => item === this.currentUrl)) {
              this.packageService.getInforPackageID(this.packageId).subscribe(result => {
                this.packageData = result;
                this.statusPackageName = this.packageData.stageStatus.id;
                for (let i = 0; i < this.listStatusPackage.length; i++) {
                  if (this.listStatusPackage[i].find(item => item === this.packageData.stageStatus.id)) {
                    this.statusPackageID = i;
                    break;
                  }
                }
              });
            }
          });
        } else {
          this.redirectByStatus();
        }
      }
    });
  }

  redirectByStatus() {
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
        this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
        break;
      }
      case this.bidStatus.ChuanBiPhongVan: {
        this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
        break;
      }
      case this.bidStatus.DaChotCongTacChuanBiPhongVan: {
        this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
        break;
      }
      case this.bidStatus.DaPhongVan: {
        this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
        break;
      }
      default: {
        break;
      }
    }
  }

}
