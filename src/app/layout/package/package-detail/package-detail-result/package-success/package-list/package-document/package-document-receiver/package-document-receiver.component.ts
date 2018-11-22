import { Component, OnInit, TemplateRef, Input, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject, Subscription } from '../../../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../../../shared/services/package-success.service';
import { SessionService, DataService } from '../../../../../../../../shared/services/index';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { ConfirmationService, AlertService } from '../../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { DetailResultPackageService } from '../../../../../../../../shared/services/detail-result-package.service';
import { DepartmentsFormBranches } from '../../../../../../../../shared/models/user/departments-from-branches';
import { HadTransferList } from '../../../../../../../../shared/models/result-attend/had-transfer-list.model';
import { FilterTransferredDoc } from '../../../../../../../../shared/models/result-attend/filter-transferred-doc.model';
import { TransferredDoc } from '../../../../../../../../shared/models/result-attend/transferred-doc.model';
import { groupBy } from '../../../../../../../../../../node_modules/@progress/kendo-data-query';
import { DocumentService } from '../../../../../../../../shared/services/document.service';
import { DictionaryItemHightLight } from '../../../../../../../../shared/models';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { CheckStatusPackage } from '../../../../../../../../shared/constants/check-status-package';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';
import { DocumentTypeAll } from '../../../../../../../../shared/models/package/document-type-all';
import { StatusDocTranfered } from '../../../../../../../../shared/models/result-attend/status-doc-tranfered.model';
import { DocmentParent } from '../../../../../../../../shared/models/result-attend/docment-parent.model';
import { DialogService } from '../../../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../../../shared/components/form-in/form-in.component';
import { PermissionModel } from '../../../../../../../../shared/models/permission/permission.model';
import { PermissionService } from '../../../../../../../../shared/services/permission.service';

@Component({
  selector: 'app-package-document-receiver',
  templateUrl: './package-document-receiver.component.html',
  styleUrls: ['./package-document-receiver.component.scss'],
  providers: [
    DocumentService,
    HoSoDuThauService
  ]
})
export class PackageDocumentReceiverComponent implements OnInit, OnDestroy {

  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  seclectAllDocument: boolean;
  isDataHsmt: boolean;
  isDataHsdt: boolean;
  total: number;
  textmovedata: string;
  isManageTransfer: boolean;
  modalRef: BsModalRef;
  userGetDocument: boolean;
  btnManageTransfer: boolean;
  textUserManage: string;
  userInfo: any;
  bntConfirm: boolean;
  currentPackageId: number;
  filter = new FilterTransferredDoc();
  transferredDocList: TransferredDoc[];
  searchTerm$ = new BehaviorSubject<string>('');
  docTypeListFilter;
  statusListFilter;
  docHSMTListTranferred;
  docHSDTListTranferred;
  public data: DocumentItem[] = this.packageSuccessService.getdataGetDocument();
  majorTypeListItem: DictionaryItemHightLight[];
  danhSachLoaiTaiLieu;
  @Input() statusPackage;
  documentTypeList;
  statusList;
  checkStatusPackage = CheckStatusPackage;
  documentTypeAll: DocmentParent[];
  documentTypeAllControl = [];
  statusDocList: StatusDocTranfered[];
  sendEmployee;
  dialogPrintLiveForm;
  dialogPopupFormIn;
  isShowPopupFormIn = false;
  // ==========
  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  // Hồ sơ mời thầu
  docHSMT = false;
  // Trình duyệt giá
  XemTDG = false;
  InTDG = false;
  // liveForm lập HSDT - Bảng tóm tắt ĐKDT
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
  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private sessionService: SessionService,
    private packageService: PackageService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private detailResultPackageService: DetailResultPackageService,
    private dataService: DataService,
    private documentService: DocumentService,
    private hoSoDuThauService: HoSoDuThauService,
    private router: Router,
    private dialogService: DialogService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      // Hồ sơ mời thầu
      const hsmt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSMT')[0];
      if (hsmt) {
        const screenDocHSMT = hsmt.userPermissionDetails.length
          && hsmt.userPermissionDetails.filter(y => y.permissionGroup.value === 'HSMT')[0];
        if (screenDocHSMT) {
          const permissionHSMT = screenDocHSMT.permissions.map(z => z.value);
          this.docHSMT = permissionHSMT.includes('DownloadFile');
        }
      }
      // Hồ sơ dự thầu
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (hsdt) {
        // ==========
        // Screen Hồ sơ dự thầu đã phê duyệt
        // B4 - Trình duyệt giá
        const screenPriceReview = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrinhDuyetGia')[0];
        if (screenPriceReview) {
          let tempArray = [];
          tempArray = screenPriceReview.permissions.map(z => z.value);
          this.XemTDG = tempArray.includes('XemTDG');
          this.InTDG = tempArray.includes('InTDG');
        }
        // B3 - LiveForm
        const screenDocsApprovedLiveForm = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauLiveForm')[0];
        // Tài liệu HSDT
        const screenDocHSDT = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauFile')[0];
        if (screenDocHSDT || screenDocsApprovedLiveForm) {
          this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.currentPackageId).subscribe(response => {
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
    });
    this.packageService.statusPackageValue$.subscribe(status => {
      this.statusPackage = status;
    });

    this.filter.documentType = null;
    this.filter.status = '';
    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = true;
    this.isDataHsdt = true;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer = false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
    this.total = this.data.length;
    this.bntConfirm = false;
    this.searchTerm$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterFuc(false);
      });
    this.getListFilter();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // getListFilter() {
  //   this.detailResultPackageService.documentTypeHsdtAndHsmt().subscribe(response => {
  //     this.documentTypeAll = response;
  //     (this.documentTypeAll || []).forEach(item => {
  //       item.detail.forEach(itemChild => {
  //         itemChild['bidOpportunityStage'] = item.bidOpportunityStage.id;
  //       });
  //     });
  //     (this.documentTypeAll || []).forEach(item => {
  //       this.documentTypeAllControl = this.documentTypeAllControl.concat(item.detail);
  //     });
  //   });
  //   this.detailResultPackageService.getListStatusDoc().subscribe(response => {
  //     this.statusDocList = response;
  //   });
  // }

  getListFilter() {
    this.documentTypeAllControl = [];
    this.detailResultPackageService.getDocumentChild().subscribe(response => {
      this.documentTypeAll = response;
      (this.documentTypeAll || []).forEach(item => {
        (item.detail || []).forEach(itemChild => {
          itemChild['bidOpportunityStage'] = item.bidOpportunityStage.id;
        });
      });
      (this.documentTypeAll || []).forEach(item => {
        this.documentTypeAllControl = this.documentTypeAllControl.concat(item.detail);
      });
    });
    this.detailResultPackageService.getListStatusDoc().subscribe(response => {
      this.statusDocList = response;
    });
  }

  // Danh sách tài liệu HSMT
  getListHSMTDocType() {
    this.documentService.bidDocumentMajortypes(this.currentPackageId).subscribe(data => {
      this.majorTypeListItem = data;
    });
  }

  // Danh sách tài liệu HSDT
  getListHSDTDocType() {
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.currentPackageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
    });
  }

  onSelectAll(value: boolean) {
    this.data.forEach(x => (x['checkboxSelected'] = value));
    this.docHSMTListTranferred.forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        itemChild.checkboxSelected = value;
      });
    });
    this.docHSDTListTranferred.forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        itemChild.checkboxSelected = value;
      });
    });
  }
  refesh() {
    this.filterFuc(true);
    this.getListFilter();
  }

  filterList() {
    const newfilter = new FilterTransferredDoc();
    this.detailResultPackageService.filterTransferDocDetailsList(
      this.currentPackageId,
      '',
      newfilter
    ).subscribe(response => {
      this.transferredDocList = response;
      response.forEach(item => {
        this.documentTypeList = item.bidTransferDocDetails.map(itembidTransfer => itembidTransfer.documentType);
        this.documentTypeList = this.documentTypeList.sort((a, b) => a - b);
        this.documentTypeList = this.documentTypeList.filter((el, i, a) => i === a.indexOf(el));
      });
    },
      err => {
      });
  }

  filterFuc(alertShow: boolean) {
    this.detailResultPackageService.filterTransferDocDetailsList(
      this.currentPackageId,
      this.searchTerm$.value,
      this.filter
    ).subscribe(response => {
      this.transferredDocList = response;
      console.log('this.transferredDocList', this.transferredDocList);
      for (let i = 0; i < response.length; i++) {
        for (let j = 0; j < (response[i].bidTransferDocDetails || []).length; j++) {
          if (response[i].bidTransferDocDetails[j].sendEmployee) {
            this.sendEmployee = response[i].bidTransferDocDetails[j].sendEmployee.employeeName;
            break;
          }
        }
      }
      response.forEach(item => {
        switch (item.bidDocumentState.key) {
          case 'HSMT': {
            this.docHSMTListTranferred = item.bidTransferDocDetails;
            break;
          }
          case 'HSDT': {
            this.docHSDTListTranferred = item.bidTransferDocDetails;
            break;
          }
        }
      });

      // Hồ sơ mời thầu
      if (this.docHSMTListTranferred && this.docHSMTListTranferred.length !== 0) {
        this.docHSMTListTranferred.forEach((itemPra, indexPra) => {
          itemPra['documentTypeStr'] = JSON.stringify(itemPra.documentType);
        });
        this.docHSMTListTranferred = groupBy(this.docHSMTListTranferred, [{ field: 'documentTypeStr' }]);
      }
      console.log('docHSDTListTranferred-before', this.docHSDTListTranferred);
      // Hồ sơ dự thầu
      if (this.docHSDTListTranferred && this.docHSDTListTranferred.length !== 0) {
        this.docHSDTListTranferred.forEach((itemPra, indexPra) => {
          itemPra['documentTypeStr'] = JSON.stringify(itemPra.documentType);
        });
        this.docHSDTListTranferred = groupBy(this.docHSDTListTranferred, [{ field: 'documentTypeStr' }]);
      }
      console.log('this.this.docHSDTListTranferred', this.docHSDTListTranferred);
      if (alertShow) {
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    },
      err => {
      });
  }
  getDocTypeList() {
    // this.docTypeListFilter = this.transferredDocList.transferredDocList.map
    // docTypeListFilter;
    // statusListFilter;
  }
  getStatusList() {

  }
  clearFilterFuc() {
    this.filter.documentType = null;
    // this.filter.documentType.documentType = '';
    // this.filter.documentType.bidOpportunityStage = '';
    // this.filter.documentType.documentTypeId = null;
    this.filter.status = '';
    this.filterFuc(false);
  }
  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;

  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
  transferofdocuments() {
    this.userGetDocument = false;
    this.isManageTransfer = true;
    this.btnManageTransfer = false;
    this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
  }

  confirmGot() {
    const idsArray = [];
    (this.docHSMTListTranferred || []).forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        idsArray.push(itemChild.id);
      });
    });
    (this.docHSDTListTranferred || []).forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        idsArray.push(itemChild.id);
      });
    });
    this.confirmationService.confirm(
      'Bạn có muốn xác nhận nhận tài liệu?',
      () => {
        if (idsArray.length !== 0) {
          this.detailResultPackageService.confirmReceiveDocs(idsArray).subscribe(response => {
            this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaNhanTaiLieu.text);
            this.alertService.success('Xác nhận nhận tài liệu thành công!');
            this.bntConfirm = true;
            this.packageService.setActiveKickoff(this.bntConfirm);
            // this.textmovedata = this.bntConfirm ? 'Đã nhận tài liệu được chuyển giao' : 'Chưa nhận tài liệu được chuyển giao';
          },
            err => {
              this.alertService.error('Xác nhận nhận tài liệu không thành công!');
            });
        } else {
          this.alertService.error('Bạn không có tài liệu nào để xác nhận!');
        }
      }
    );
  }

  manageTransferDocument(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  // Router live form
  viewDetailLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'TenderConditionalSummary': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/build/summary/form/detail/info`], { queryParams: { direction: false } });
        break;
      }
      case 'SiteSurveyingReport': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/build/liveformsite/form/info`], { queryParams: { direction: false } });
        break;
      }
      case 'TenderPriceApproval': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/price-review/detail`], { queryParams: { direction: false } });
        break;
      }
    }
  }
  // Render index
  renderIndexHSMT(i, j): number {
    let dem = 0;
    if (this.docHSMTListTranferred && this.docHSMTListTranferred.length !== 0) {
      for (let indexPar = 0; indexPar < i; indexPar++) {
        dem = this.docHSMTListTranferred[indexPar].items ? dem + this.docHSMTListTranferred[indexPar].items.length : dem;
      }
      dem = dem + j + 1;
    }
    return dem;
  }
  renderIndexHSDT(i, j): number {
    let dem = 0;
    if (this.docHSDTListTranferred && this.docHSDTListTranferred.length !== 0) {
      for (let indexPar = 0; indexPar < i; indexPar++) {
        dem = this.docHSDTListTranferred[indexPar].items ? dem + this.docHSDTListTranferred[indexPar].items.length : dem;
      }
      dem = dem + j + 1;
    }
    return dem;
  }

  // Yêu cầu gửi lại tài liệu
  requestToResubmit(bidTransferDocDetailId: number, style: string) {
    this.detailResultPackageService.requesstToRessubmit(bidTransferDocDetailId).subscribe(respone => {
      switch (style) {
        case 'docHSMTListTranferred': {
          (this.docHSMTListTranferred || []).forEach(itemDocuments => {
            (itemDocuments.items || []).forEach(documents => {
              if (documents.id === bidTransferDocDetailId) {
                documents.receiveStatus.key = 'YeuCauGuiLai';
              }
            });
          });
          break;
        }
        case 'docHSDTListTranferred': {
          (this.docHSDTListTranferred || []).forEach(itemDocuments => {
            (itemDocuments.items || []).forEach(documents => {
              if (documents.id === bidTransferDocDetailId) {
                documents.receiveStatus.key = 'YeuCauGuiLai';
              }
            });
          });
        }
      }
      this.alertService.success('Yêu cầu gửi lại tài liệu thành công!');
    },
      err => {
        this.alertService.error('Yêu cầu gửi lại tài liệu không thành công!');
      });
  }
  // Xác nhận đã nhận
  comfirmReceived(bidTransferDocDetailIds: number, styleDoc: string) {
    this.detailResultPackageService.confirmReceiveDocs([bidTransferDocDetailIds]).subscribe(response => {
      switch (styleDoc) {
        case 'docHSMTListTranferred': {
          (this.docHSMTListTranferred || []).forEach(itemDocuments => {
            (itemDocuments.items || []).forEach(documents => {
              if (documents.id === bidTransferDocDetailIds) {
                documents.receiveStatus.key = 'DaNhan';
              }
            });
          });
          break;
        }
        case 'docHSDTListTranferred': {
          (this.docHSDTListTranferred || []).forEach(itemDocuments => {
            (itemDocuments.items || []).forEach(documents => {
              if (documents.id === bidTransferDocDetailIds) {
                documents.receiveStatus.key = 'DaNhan';
              }
            });
          });
          break;
        }
      }
      this.alertService.success('Xác nhận nhận tài liệu thành công!');
    },
      err => {
        this.alertService.error('Xác nhận nhận tài liệu không thành công!');
      });
  }

  // In liveform
  inLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'TenderPriceApproval': {
        this.dialogPrintLiveForm = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialogPrintLiveForm.content.instance;
        instance.type = 'LiveFormTrinhDuyetGia';
        instance.packageId = this.currentPackageId;
        break;
      }
      case 'SiteSurveyingReport': {
        this.dialogPrintLiveForm = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialogPrintLiveForm.content.instance;
        instance.type = 'LiveFormThamQuanBaoCaoCongTruong';
        instance.packageId = this.currentPackageId;
        break;
      }
      case 'TenderConditionalSummary': {
        // this.dialogPrintLiveForm = this.dialogService.open({
        //   title: 'FORM IN',
        //   content: FormInComponent,
        //   width: window.screen.availWidth * 0.8,
        //   minWidth: 250,
        //   height: window.screen.availHeight * 0.7
        // });
        // const instance = this.dialogPrintLiveForm.content.instance;
        // instance.type = 'LiveFormTomTatDieuKienDuThau';
        // instance.packageId = this.currentPackageId;
        this.openPopupFormIn();
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
    this.dialogPopupFormIn = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialogPopupFormIn.content.instance;
    instance.type = 'LiveFormTomTatDieuKienDuThau';
    if (type) {
      instance.typeChild = type;
    }
    instance.packageId = this.currentPackageId;
  }
}
