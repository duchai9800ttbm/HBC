import { Component, OnInit } from '@angular/core';
import {
  TenderPriceApproval,
  TenderPriceApprovalShort,
  ItemHSDTChinhThuc,
  PriceReviewItemChangedHistory
} from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PagedResult } from '../../../../../../shared/models';
import { StatusObservableHsdtService } from '../../../../../../shared/services/status-observable-hsdt.service';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss']
})
export class PriceReviewSummaryComponent implements OnInit {
  packageId;
  priceReview: TenderPriceApprovalShort;
  package = new PackageInfoModel();
  listItemHSDTChinhThuc: ItemHSDTChinhThuc[];
  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();

  showPopupAdd;
  pagedResult: PagedResult<PriceReviewItemChangedHistory> = new PagedResult<PriceReviewItemChangedHistory>();

  constructor(
    private priceReviewService: PriceReviewService,
    private alertService: AlertService,
    private confirmService: ConfirmationService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService
  ) { }



  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
    }, err => {
    });
    this.priceReviewService.viewShort(this.packageId).subscribe(data => {
      this.priceReview = data;
    });
    this.priceReviewService.getDanhSachHSDTChinhThuc(230).subscribe(data => {
      this.listItemHSDTChinhThuc = data;
      console.log('this.listItemHSDTChinhThuc', this.listItemHSDTChinhThuc);
    });

    this.priceReviewService.changedHistoryPriceReview(this.packageId, 0, 10)
      .subscribe(data => {
        this.pagedResult = data;
      });
  }

  renderIndex(i, k) {
    let dem = 0;
    let tam = -1;
    if (+i === 0) {
      return k + 1;
    } else {
      this.listItemHSDTChinhThuc.forEach(ite => {
        if (tam < +i - 1) {
          if (!ite.childs.length) {
            dem++;
          }
          ite.childs.forEach(e => {
            dem++;
          });
        }
        tam++;
      });
      return dem + k + 1;
    }
  }

  open() {
    this.showPopupAdd = true;

  }
  closePopup(params) {
    this.showPopupAdd = false;
    this.refresh(false);
  }

  refresh(isAlert: boolean) {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
    }, err => {
    });
    this.priceReviewService.viewShort(this.packageId).subscribe(data => {
      this.priceReview = data;
      if (isAlert) {
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    });
  }

  guiDuyet() {
    const that = this;
    if (this.priceReview.isDraftVersion) {
      this.alertService.error('Chưa đủ bản chính thức!');
      return null;
    }
    this.confirmService.confirm('Bạn có chắc muốn gửi duyệt trình duyệt giá?', () => {
      this.priceReviewService.guiDuyetTrinhDuyetGia(this.packageId).subscribe(data => {
        that.refresh(false);
        that.alertService.success('Gửi duyệt trình duyệt giá thành công!');
      }, err => {
        that.alertService.error('Gửi duyệt trình duyệt giá thất bại, vui lòng thử lại sau!');
      });
    });

  }

  guiDuyetLai() {
    const that = this;
    if (this.priceReview.isDraftVersion) {
      this.alertService.error('Chưa đủ bản chính thức!');
      return null;
    }
    this.confirmService.confirm('Bạn có chắc muốn gửi duyệt lại trình duyệt giá?', () => {
      this.priceReviewService.guiDuyetLaiTrinhDuyetGia(this.packageId).subscribe(data => {
        that.refresh(false);
        that.alertService.success('Gửi duyệt lại trình duyệt giá thành công!');
      }, err => {
        that.alertService.error('Gửi duyệt lại trình duyệt giá thất bại, vui lòng thử lại sau!');
      });
    });
  }

  chotHoSo() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn chốt hồ sơ?', () => {
      this.priceReviewService.chotHoSo(this.packageId).subscribe(data => {
        that.refresh(false);
        that.alertService.success('Chốt hồ sơ thành công!');
      }, err => {
        that.alertService.error('Chốt hồ sơ thất bại, vui lòng thử lại sau!');
      });
    });
  }

  nopHoSo() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn nộp hồ sơ?', () => {
      this.priceReviewService.nopHoSo(this.packageId).subscribe(data => {
        this.statusObservableHsdtService.change();
        that.refresh(false);
        that.alertService.success('Nộp hồ sơ thành công!');
      }, err => {
        that.alertService.error('Nộp hồ sơ thất bại, vui lòng thử lại sau!');
      });
    });
  }

  hieuChinhHSDT() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn hiệu chỉnh HSDT?', () => {
      this.priceReviewService.hieuChinhHSDT(this.packageId).subscribe(data => {
        that.refresh(false);
      }, err => {
        that.alertService.error('Thất bại, vui lòng thử lại sau!');
      });
    });
  }



  downloadAll() { }
  taiTemplate() {
    this.priceReviewService.downloadTemplate().subscribe();
  }

  delete() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn xóa liveform trình duyệt giá?', () => {
      this.priceReviewService.delete(this.packageId).subscribe(data => {
        that.refresh(false);
        that.alertService.success('Xóa thành công!');
      }, err => {
        that.alertService.error('Xóa thất bại, vui lòng thử lại sau!');
      });
    });
  }
  pagedResultChange() {
    this.priceReviewService.changedHistoryPriceReview(this.packageId, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(data => {
        this.pagedResult = data;
        console.log(data);
      });
  }
  print() {

  }

  downloadFileAttach(id: number) {
    this.priceReviewService.download(id).subscribe();
  }
}
