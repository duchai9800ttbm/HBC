import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PackageService } from '../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, Subscription } from 'rxjs';
import { SummaryConditionFormComponent } from './summary-condition-form/summary-condition-form.component';
import { DuLieuLiveFormDKDT } from '../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { HistoryLiveForm } from '../../../../../../shared/models/ho-so-du-thau/history-liveform.model';
import { PagedResult } from '../../../../../../shared/models';
import { GroupDescriptor, DataResult, process, groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../shared/components/form-in/form-in.component';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
import { DocumentTypeId } from '../../../../../../shared/constants/document-type-id';
import { TypeFormInTomTatDK } from './components/popup-confirm-type-form-in/popup-confirm-type-form-in.component';

@Component({
  selector: 'app-summary-condition',
  templateUrl: './summary-condition.component.html',
  styleUrls: ['./summary-condition.component.scss']
})
export class SummaryConditionComponent implements OnInit, OnDestroy {

  packageId;
  summaryCondition: DuLieuLiveFormDKDT;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  historyList;
  dialog;
  indexItemHistoryChange: number;
  pagedResultChangeHistoryList: PagedResult<HistoryLiveForm> = new PagedResult<HistoryLiveForm>();
  isChotHoSo: boolean;
  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen2 = [];
  documentTypeId = DocumentTypeId;
  showPopupDetail = false;

  ChotHSDT = false;
  TaoMoiLiveForm = false;
  XemLiveForm = false;
  SuaLiveForm = false;
  XoaLiveForm = false;
  InLiveForm = false;
  TaiTemplate = false;

  isShowPopupFormIn = false;
  dataChangeHistory: any;
  index: number;
  isShowMore = false;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private confirmService: ConfirmationService,
    private dialogService: DialogService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isChotHoSo = status;
    });
    this.packageId = PackageDetailComponent.packageId;
    const permission$ = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt2 = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt2) {
        this.listPermissionScreen2 = [];
      }
      if (hsdt2) {
        const screen2 = hsdt2.userPermissionDetails.length
          && hsdt2.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauLiveForm')[0];
        if (!screen2) {
          this.listPermissionScreen2 = [];
        }
        if (screen2) {
          this.listPermissionScreen2 = screen2.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTomTatDK).map(z => z.value);
        }
      }
      this.ChotHSDT = this.listPermissionScreen2.includes('ChotHSDT');
      this.TaoMoiLiveForm = this.listPermissionScreen2.includes('TaoMoiLiveForm');
      this.XemLiveForm = this.listPermissionScreen2.includes('XemLiveForm');
      this.SuaLiveForm = this.listPermissionScreen2.includes('SuaLiveForm');
      this.XoaLiveForm = this.listPermissionScreen2.includes('XoaLiveForm');
      this.InLiveForm = this.listPermissionScreen2.includes('InLiveForm');
      this.TaiTemplate = this.listPermissionScreen2.includes('TaiTemplate');
    });
    const getDNDTInfo$ = this.packageService.getProposedTenderParticipateReport(this.packageId).subscribe(data => {
      if (data) {
        this.hoSoDuThauService.emitDataProposedTender(data);
      }
    });
    this.subscription.add(permission$);
    this.subscription.add(getDNDTInfo$);
    this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId)
      .subscribe(data => {
        this.summaryCondition = data;
        setTimeout(() => {
          this.dtTrigger.next();
        }, 0);
      });
    this.getChangeHistory(0, 10);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh(isAlert: boolean) {
    this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId)
      .subscribe(data => {
        this.spinner.hide();
        this.summaryCondition = data;
        this.dtTrigger.next();
        if (isAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
      });
  }

  closePopup(state: any) {
    this.isShowPopupFormIn = false;
    if (state === 'HSMT' || state === 'HBC') {
      this.print(state);
    }
  }

  openPopup() {
    this.isShowPopupFormIn = true;
  }

  delete() {
    const that = this;
    this.confirmService.confirm('Bạn có chắc muốn xóa liveform tóm tắt điều kiện dự thầu?', () => {
      this.hoSoDuThauService.deleleLiveFormTTDKDuThau(this.packageId).subscribe(data => {
        that.refresh(false);
        this.hoSoDuThauService.detectUploadFile(true);
        that.alertService.success('Xóa bảng tóm tắt điều kiện dự thầu thành công!');
      }, err => {
        that.alertService.error('Xóa bảng tóm tắt điều kiện dự thầu thất bại!');
      });
    });
  }

  getChangeHistory(page: number | string, pageSize: number | string) {
    this.hoSoDuThauService.getChangeHistoryListProposedTender(this.packageId, page, pageSize).subscribe(respone => {
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
    });
  }

  pagedResultChangeHistory(e) {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }

  print(type) {
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
