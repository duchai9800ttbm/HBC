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
    // this.checkStatusPackage();
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
  }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    // this.packageService.getInforPackageID(this.packageId).subscribe(result => {
    //   this.packageData = result;
    //   this.statusPackageName = this.packageData.stageStatus.id;
    //   switch (this.packageData.stageStatus.id) {
    //     case 'CanLapDeNghiDuThau': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
    //       break;
    //     }
    //     case 'ChoDuyet': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
    //       break;
    //     }
    //     case 'ThamGiaDuThau': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
    //       break;
    //     }
    //     case 'DaTuChoi': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/create-request`]);
    //       break;
    //     }
    //     case 'ChuaThongBaoTrienKhai': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
    //       break;
    //     }
    //     case 'DaThongBaoTrienKhai': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
    //       break;
    //     }
    //     case 'DaXacNhanPhanCong': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
    //       break;
    //     }
    //     case 'DaGuiPhanCongTienDo': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/infomation-deployment`]);
    //       break;
    //     }
    //     case 'DangLapHSDT': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/build`]);
    //       break;
    //     }
    //     case 'CanLapTrinhDuyetGia': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'DaGuiDuyetTrinhDuyetGia': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'CanDieuChinhTrinhDuyetGia': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'DaDuyetTrinhDuyetGia': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'ChotHoSo': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'DaNopHSDT': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/price-review`]);
    //       break;
    //     }
    //     case 'DaNhanLoiMoi': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
    //       break;
    //     }
    //     case 'ChuanBiPhongVan': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
    //       break;
    //     }
    //     case 'DaChotCongTacChuanBiPhongVan': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
    //       break;
    //     }
    //     case 'DaPhongVan': {
    //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation`]);
    //       break;
    //     }
    //     default: {
    //       break;
    //     }
    //   }
    // });
  }

  // checkStatusPackage() {
  //   this.packageId = +PackageDetailComponent.packageId;
  //   this.router.events.subscribe((val) => {
  //     if ((val instanceof NavigationEnd) === true) {
  //       this.activeRouter.firstChild.url.subscribe(url => {
  //         this.currentUrl = url[0].path;
  //         console.log('gọi API');
  //         if (this.urlChirld.find( item => item === this.currentUrl)) {
  //           this.packageService.getInforPackageID(this.packageId).subscribe(result => {
  //             this.packageData = result;
  //             this.statusPackageName = this.packageData.stageStatus.id;
  //             for (let i = 0; i < this.listStatusPackage.length; i++) {
  //               if (this.listStatusPackage[i].find(item => item === this.packageData.stageStatus.id)) {
  //                 this.statusPackageID = i;
  //                 break;
  //               }
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }

}
