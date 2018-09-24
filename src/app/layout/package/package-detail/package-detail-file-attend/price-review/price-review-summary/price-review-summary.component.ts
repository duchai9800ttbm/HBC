import { Component, OnInit } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss']
})
export class PriceReviewSummaryComponent implements OnInit {
  packageId;
  priceReview: TenderPriceApproval;
  package = new PackageInfoModel();

  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();

  constructor(
    private priceReviewService: PriceReviewService,
    private alertService: AlertService,
    private confirmService: ConfirmationService,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
      console.log(this.package);

    }, err => {
    });
    this.priceReviewService.view(this.packageId).subscribe(data => {
      this.priceReview = data;
    });
  }

  refresh() {
    this.priceReviewService.view(this.packageId).subscribe(data => {
      this.priceReview = data;
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
        that.refresh();
        that.alertService.success('Xóa thành công!');
      }, err => {
        that.alertService.error('Xóa thất bại, vui lòng thử lại sau!');
      });
    });

  }

  chotHoSo() {

  }

  hieuChinhHSDT() {

  }



  downloadAll() { }
  taiTemplate() {

  }

  delete() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn xóa liveform trình duyệt giá?', () => {
      this.priceReviewService.delete(this.packageId).subscribe(data => {
        that.refresh();
        that.alertService.success('Xóa thành công!');
      }, err => {
        that.alertService.error('Xóa thất bại, vui lòng thử lại sau!');
      });
    });
  }

  print() {

  }
}
