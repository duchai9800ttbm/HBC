import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  TenderPriceApprovalShort,
  ItemHSDTChinhThuc,
  PriceReviewItemChangedHistory
} from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { PagedResult } from '../../../../../../shared/models';
import { StatusObservableHsdtService } from '../../../../../../shared/services/status-observable-hsdt.service';
import { HistoryLiveForm } from '../../../../../../shared/models/ho-so-du-thau/history-liveform.model';
import { groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../shared/components/form-in/form-in.component';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { BehaviorSubject } from '../../../../../../../../node_modules/rxjs/BehaviorSubject';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { slideToLeft } from '../../../../../../router.animations';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
import { Subscription } from '../../../../../../../../node_modules/rxjs/Subscription';
import { DocumentTypeId } from '../../../../../../shared/constants/document-type-id';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss'],
  animations: [slideToLeft()]
})
export class PriceReviewSummaryComponent implements OnInit, OnDestroy {
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
  indexItemHistoryChange: number;

  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  listPermissionScreen2 = [];
  bangTomDKDT = [];
  thamquanCT = [];

  TaoMoiTDG = false;
  XemTDG = false;
  SuaTDG = false;
  XoaTDG = false;
  InTDG = false;
  DuyetTDGTNDuThau = false;
  TaiTemplateTDG = false;
  DuyetTDGTPDuThau = false;
  GuiDuyet = false;
  DuyetTDGBGD = false;
  ChotHoSo = false;
  NopHSDT = false;
  HieuChinhHSDT = false;
  isLoading = true;
  isShowPopupFormIn = false;
  // liveForm lập HSDT
  XemLiveFormBangTomTatDK = false;
  InLiveFormBangTomTatDK = false;
  // liveForm tham quan công trình
  XemLiveFormThamquanCT = false;
  InLiveFormThamquanCT = false;
  // Các tài liệu khác
  yeuCauBaoGia = false;
  bangTongHopDuToan = false;
  bangTinhChiPhiChung = false;
  bangCauHoiLamRoHSMT = false;
  cacHSKTLienQuan = false;
  hoSoPhapLy = false;
  hoSoKhac = false;
  documentTypeId = DocumentTypeId;
  showPopupDetail = false;
  dataChangeHistory: any;
  index: number;
  isShowMore = false;
  constructor(
    private priceReviewService: PriceReviewService,
    private alertService: AlertService,
    private confirmService: ConfirmationService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private dialogService: DialogService,
    private router: Router,
    private permissionService: PermissionService,
    private hoSoDuThauService: HoSoDuThauService
  ) { }



  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;

    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrinhDuyetGia')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }

        const screen2 = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'ChotVaNopHSDT')[0];
        if (!screen2) {
          this.listPermissionScreen2 = [];
        }
        if (screen2) {
          this.listPermissionScreen2 = screen2.permissions.map(z => z.value);
        }
        // ==========
        // Screen Hồ sơ dự thầu đã phê duyệt
        // LiveForm
        const screenDocsApprovedLiveForm = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauLiveForm')[0];
        // Tài liệu HSDT
        const screenDocHSDT = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauFile')[0];
        if (screenDocHSDT || screenDocsApprovedLiveForm) {
          this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(response => {
            // Screen Hồ sơ dự thầu đã phê duyệt
            (response || []).forEach(item => {
              let tempArray = [];
              switch (item.item.name) {
                case 'Bảng Tóm Tắt ĐKDT': {
                  tempArray = screenDocsApprovedLiveForm.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  // Bảng tóm tắt ĐKDT
                  this.XemLiveFormBangTomTatDK = tempArray.includes('XemLiveForm');
                  this.InLiveFormBangTomTatDK = tempArray.includes('InLiveForm');
                  break;
                }
                case 'Yêu cầu báo giá vật tư, thầu phụ': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.yeuCauBaoGia = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Báo cáo tham quan công trình': {
                  tempArray = screenDocsApprovedLiveForm.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  // Tham quan công trình
                  this.XemLiveFormThamquanCT = tempArray.includes('XemLiveForm');
                  this.InLiveFormThamquanCT = tempArray.includes('InLiveForm');
                  break;
                }
                case 'Bảng tổng hợp dự toán': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.bangTongHopDuToan = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Bảng tính chi phí chung': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.bangTinhChiPhiChung = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Bảng câu hỏi làm rõ HSMT': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.bangCauHoiLamRoHSMT = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Các HSKT có liên quan': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.cacHSKTLienQuan = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Hồ sơ pháp lý': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.hoSoPhapLy = tempArray.includes('DownloadFile');
                  break;
                }
                case 'Hồ sơ khác': {
                  tempArray = screenDocHSDT.permissions
                    .filter(t => t.tenderDocumentTypeId === item.item.id).map(z => z.value);
                  this.hoSoKhac = tempArray.includes('DownloadFile');
                  break;
                }
              }

            });
          });
        }
      }
      // Screen
      this.TaoMoiTDG = this.listPermissionScreen.includes('TaoMoiTDG');
      this.XemTDG = this.listPermissionScreen.includes('XemTDG');
      this.SuaTDG = this.listPermissionScreen.includes('SuaTDG');
      this.XoaTDG = this.listPermissionScreen.includes('XoaTDG');
      this.InTDG = this.listPermissionScreen.includes('InTDG');
      this.DuyetTDGTNDuThau = this.listPermissionScreen.includes('DuyetTDGTNDuThau');
      this.TaiTemplateTDG = this.listPermissionScreen.includes('TaiTemplateTDG');
      this.DuyetTDGTPDuThau = this.listPermissionScreen.includes('DuyetTDGTPDuThau');
      this.GuiDuyet = this.listPermissionScreen.includes('GuiDuyet');
      this.DuyetTDGBGD = this.listPermissionScreen.includes('DuyetTDGBGD');
      // Screen2
      this.ChotHoSo = this.listPermissionScreen2.includes('ChotHoSo');
      this.NopHSDT = this.listPermissionScreen2.includes('NopHSDT');
      this.HieuChinhHSDT = this.listPermissionScreen2.includes('HieuChinhHSDT');
    });

    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.package = result;
      this.isLoading = false;
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

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  viewLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'Trình Duyệt Giá': {
        this.router.navigate([`package/detail/${this.packageId}/attend/price-review/detail`]);
        break;
      }
      case 'Báo cáo tham quan công trình': {
        this.router.navigate([`package/detail/${this.packageId}/attend/build/liveformsite/form/info`]);
        break;
      }
      case 'Bảng tóm tắt ĐKDT': {
        this.router.navigate([`package/detail/${this.packageId}/attend/build/summary/form/detail/info`]);
        break;
      }
      default: break;
    }
  }

  closePopupFormIn(state: any) {
    this.isShowPopupFormIn = false;
    if (state === 'HSMT' || state === 'HBC') {
      this.printTTDKDT(state);
    }
  }

  openPopupFormIn() {
    this.isShowPopupFormIn = true;
  }

  printTTDKDT(type) {
    this.dialog = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialog.content.instance;
    instance.type = 'LiveFormTomTatDieuKienDuThau';
    if (type) {
      instance.typeChild = type;
    }
    instance.packageId = this.packageId;
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
        // this.dialog = this.dialogService.open({
        //   title: 'FORM IN',
        //   content: FormInComponent,
        //   width: window.screen.availWidth * 0.8,
        //   minWidth: 250,
        //   height: window.screen.availHeight * 0.7
        // });
        // const instance = this.dialog.content.instance;
        // instance.type = 'LiveFormTomTatDieuKienDuThau';
        // instance.packageId = this.packageId;
        this.openPopupFormIn();
        break;
      }
      default: break;
    }
  }

  downloadHSDTChinhThuc(id) {
    this.priceReviewService.downloadTaiLieuHSDT(id).subscribe();
  }

  getChangeHistory(page: number | string, pageSize: number | string) {
    this.priceReviewService.changedHistoryPriceReview(this.packageId, page, pageSize).subscribe(respone => {
      this.pagedResultChangeHistoryList = respone;
      this.historyList = groupBy(this.pagedResultChangeHistoryList.items, [{ field: 'changedTime' }]);
      this.pagedResultChangeHistoryList.total = this.historyList.length;
      this.historyList = (this.historyList || []).slice(
        +this.pagedResultChangeHistoryList.pageSize * +this.pagedResultChangeHistoryList.currentPage,
        +this.pagedResultChangeHistoryList.pageSize * (+this.pagedResultChangeHistoryList.currentPage + 1)
      );
      this.pagedResultChangeHistoryList.items = this.historyList;
      this.pagedResultChangeHistoryList.pageCount = Math.ceil(+this.historyList.length / +this.pagedResultChangeHistoryList.pageSize);
      this.indexItemHistoryChange = +respone.total - +respone.pageSize * +respone.currentPage;
      this.historyList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.historyList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormStep' }]);
        });
      });
      // setTimeout(() => {
      //   this.dtTrigger2.next();
      // });
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
    if (this.priceReview.isApprovedByTenderLeader == null || this.priceReview.isApprovedByTenderManager == null) {
      this.confirmService.missAction(`Trình duyệt giá này chưa được xem xét bởi TN. Dự thầu và TP.Dự thầu`,
        `/package/detail/${this.packageId}/attend/price-review/detail`);
    } else {
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
  }

  guiDuyetLai() {
    if (this.priceReview.isApprovedByTenderLeader == null || this.priceReview.isApprovedByTenderManager == null) {
      this.confirmService.missAction(`Trình duyệt giá này chưa được xem xét bởi TN. Dự thầu và TP.Dự thầu`,
        `/package/detail/${this.packageId}/attend/price-review/detail`);
    } else {
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
  }

  chotHoSo() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn chốt hồ sơ?', () => {
      this.priceReviewService.chotHoSo(this.packageId).subscribe(data => {
        that.refresh(false);
        that.alertService.success('Chốt hồ sơ thành công!');
      }, err => {
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

  viewDetail(data, index) {
    this.dataChangeHistory = data;
    this.index = index;
    this.showPopupDetail = true;
  }

  closePopupDetail() {
    this.showPopupDetail = false;
  }
  lineDisplay(length1, length2) {
    if (length2 >= 4) {
      return 1;
    }
    if (length2 < 4) {
      if (length1 >= 3) {
        return 1;
      }
      if (length1 < 3) {
        return length1;
      }
    }
  }
  brief(data) {
    if (data.length > 4) {
      return true;
    }
    if (data[0].liveFormChangeds[0] && data[0].liveFormChangeds[0].items.length > 2) {
      return true;
    }
    if (data[1] && data[1].liveFormChangeds[0] && data[0].liveFormChangeds[0].items.length > 2) {
      return true;
    }
    if (data[2] && data[2].liveFormChangeds[0] && data[0].liveFormChangeds[0].items.length > 2) {
      return true;
    }
  }
}
