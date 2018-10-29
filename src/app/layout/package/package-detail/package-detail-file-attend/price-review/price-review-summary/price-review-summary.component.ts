import { Component, OnInit } from '@angular/core';
import {
  TenderPriceApproval,
  TenderPriceApprovalShort,
  ItemHSDTChinhThuc,
  PriceReviewItemChangedHistory
} from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { DATATABLE_CONFIG2, DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PagedResult } from '../../../../../../shared/models';
import { StatusObservableHsdtService } from '../../../../../../shared/services/status-observable-hsdt.service';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { HistoryLiveForm } from '../../../../../../shared/models/ho-so-du-thau/history-liveform.model';
import { GroupDescriptor, DataResult, process, groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../shared/components/form-in/form-in.component';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { BehaviorSubject } from '../../../../../../../../node_modules/rxjs/BehaviorSubject';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { slideToLeft } from '../../../../../../router.animations';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss'],
  animations: [slideToLeft()]
})
export class PriceReviewSummaryComponent implements OnInit {
  packageId;
  priceReview: TenderPriceApprovalShort;
  package = new PackageInfoModel();
  listItemHSDTChinhThuc: ItemHSDTChinhThuc[];
  searchTerm$ = new BehaviorSubject<string>('');
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  historyList;
  dialog;
  bidStatus = BidStatus;
  pagedResultChangeHistoryList: PagedResult<HistoryLiveForm> = new PagedResult<HistoryLiveForm>();
  showPopupAdd;
  pagedResult: PagedResult<PriceReviewItemChangedHistory> = new PagedResult<PriceReviewItemChangedHistory>();
  indexItemHistoryChange: Number;

  constructor(
    private priceReviewService: PriceReviewService,
    private alertService: AlertService,
    private confirmService: ConfirmationService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private router: Router
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
    this.priceReviewService.getDanhSachHSDTChinhThucInstantSearch(this.packageId, this.searchTerm$).subscribe(data => {
      this.listItemHSDTChinhThuc = data;
    });

    this.getChangeHistory(0, 10);
  }

  viewLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'Trình Duyệt Giá': {
        this.router.navigate([`package/detail/${this.packageId}/attend/price-review/detail`]);
        break;
      }
      case 'Báo cáo tham quan công trình': {
        this.router.navigate([`package/detail/${this.packageId}/attend/build/liveformsite/info`]);
        break;
      }
      case 'Bảng tóm tắt ĐKDT': {
        this.router.navigate([`package/detail/${this.packageId}/attend/build/summary/form/detail/info`]);
        break;
      }
      default: break;
    }
  }

  inLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'Trình Duyệt Giá': {
        this.dialog = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialog.content.instance;
        instance.type = 'LiveFormTrinhDuyetGia';
        instance.packageId = this.packageId;
        break;
      }
      case 'Báo cáo tham quan công trình': {
        this.dialog = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialog.content.instance;
        instance.type = 'LiveFormThamQuanBaoCaoCongTruong';
        instance.packageId = this.packageId;
        break;
      }
      case 'Bảng tóm tắt ĐKDT': {
        this.dialog = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialog.content.instance;
        instance.type = 'LiveFormTomTatDieuKienDuThau';
        instance.packageId = this.packageId;
        break;
      }
      default: break;
    }
  }

  downloadHSDTChinhThuc(id) {
    this.priceReviewService.downloadTaiLieuHSDT(id).subscribe();
  }

  getChangeHistory(page: number | string, pageSize: number | string) {
    this.spinner.show();
    this.priceReviewService.changedHistoryPriceReview(this.packageId, page, pageSize).subscribe(respone => {
      this.historyList = respone.items;
      this.pagedResultChangeHistoryList = respone;
      this.indexItemHistoryChange = +respone.total - +respone.pageSize * +respone.currentPage;
      this.historyList = groupBy(this.pagedResultChangeHistoryList.items, [{ field: 'changedTime' }]);
      this.historyList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.historyList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormStep' }]);
        });
      });

      setTimeout(() => {
        this.dtTrigger2.next();
      });
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
      });
  }

  pagedResultChangeHistory(e) {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }

  renderIndex(i, k) {
    let dem = 0;
    let tam = -1;
    if (+i === 0) {
      return k + 1;
    } else {
      this.listItemHSDTChinhThuc.forEach(ite => {
        if (tam < +i - 1) {
          // if (!ite.childs.length) {
          //   dem++;
          // }
          (ite.childs || []).forEach(e => {
            dem++;
          });
          (ite.document || []).forEach(e => {
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
    // this.packageService.getInforPackageID(this.packageId).subscribe(result => {
    //   this.package = result;
    // }, err => {
    // });
    // this.priceReviewService.viewShort(this.packageId).subscribe(data => {
    //   this.priceReview = data;
    //   if (isAlert) {
    //     this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    //   }
    // });

    this.packageId = PackageDetailComponent.packageId;
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
    this.priceReviewService.getDanhSachHSDTChinhThucInstantSearch(this.packageId, this.searchTerm$).subscribe(data => {
      this.listItemHSDTChinhThuc = data;
    });

    this.getChangeHistory(0, 10);
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
        console.log(err);
        if (err.json().errorCode === 'BusinessException') {
          that.alertService.error(`${err.json().errorMessage}`);
        } else {
          that.alertService.error('Chốt hồ sơ thất bại, vui lòng thử lại sau!');
        }
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
        that.alertService.success('Hiệu chỉnh HSDT thành công!');

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
        that.alertService.success('Xóa trình duyệt giá thành công!');
      }, err => {
        that.alertService.error('Xóa trình duyệt giá thất bại!');
      });
    });
  }
  pagedResultChange() {
    this.priceReviewService.changedHistoryPriceReview(this.packageId, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(data => {
        this.pagedResult = data;
      });
  }


  print() {
    this.dialog = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialog.content.instance;
    instance.type = 'LiveFormTrinhDuyetGia';
    instance.packageId = this.packageId;
  }

  downloadFileAttach(id: number) {
    this.priceReviewService.download(id).subscribe();
  }
}
