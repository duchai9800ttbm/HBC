import { Component, OnInit, OnDestroy } from '@angular/core';
import { SiteSurveyReport } from '../../../../../../shared/models/site-survey-report/site-survey-report';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PagedResult } from '../../../../../../shared/models';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { Subject } from 'rxjs/Subject';
import { SiteSurveyReportService } from '../../../../../../shared/services/site-survey-report.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { HistoryLiveForm } from '../../../../../../shared/models/ho-so-du-thau/history-liveform.model';
import { groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../shared/components/form-in/form-in.component';
import { Subscription } from 'rxjs';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { DocumentTypeId } from '../../../../../../shared/constants/document-type-id';
import { PackageService } from '../../../../../../shared/services/package.service';
import { EditComponent } from './edit/edit.component';

@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit, OnDestroy {
  static formModel: SiteSurveyReport = new SiteSurveyReport();
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  isData;
  documentData = new SiteSurveyReport();
  updateInfoList;
  pageIndex: number | string = 0;
  pagedResultChangeHistoryList: PagedResult<HistoryLiveForm> = new PagedResult<HistoryLiveForm>();
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dialog;
  indexItemHistoryChange: number;
  isChotHoSo: boolean;
  subscription: Subscription;
  dataDNDT;

  showPopupDetail = false;
  dataChangeHistory: any;
  index: number;
  isShowMore = false;

  listPermission: Array<PermissionModel>;
  listPermissionScreen2 = [];
  documentTypeId = DocumentTypeId;

  ChotHSDT = false;
  TaoMoiLiveForm = false;
  XemLiveForm = false;
  SuaLiveForm = false;
  XoaLiveForm = false;
  InLiveForm = false;
  TaiTemplate = false;

  constructor(
    private packageService: PackageService,
    private hoSoDuThauService: HoSoDuThauService,
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isChotHoSo = status;
    });
    this.bidOpportunityId = +PackageDetailComponent.packageId;
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
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BaoCaoThamQuanCongTrinh).map(z => z.value);
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
    const getDataReport$ = this.siteSurveyReportService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      this.documentData = res ? res : null;
    });
    this.subscription.add(permission$);
    this.subscription.add(getDataReport$);
    this.getChangeHistory(0, 10);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  refresh() {
    const tenderRefresh$ = this.siteSurveyReportService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      this.documentData = res ? res : null;
      tenderRefresh$.unsubscribe();
    }, err => {
      tenderRefresh$.unsubscribe();
      this.alertService.error('Đã xảy ra lỗi, cập nhật dữ liệu Lifeform không thành công');
    });
  }

  deleteDoc() {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa báo cáo này?',
      () => {
        this.siteSurveyReportService.deleteSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
          this.hoSoDuThauService.detectUploadFile(true);
          this.alertService.success('Xóa báo cáo công trình thành công!');
          this.spinner.hide();
          this.refresh();
        }, err => this.alertService.error('Xóa báo cáo công trình thất bại!'));
      }
    );
  }
  pagedResultChangeHistory(e) {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }
  getChangeHistory(page: number | string, pageSize: number | string) {
    this.spinner.show();
    this.siteSurveyReportService.changedHistoryTenderSiteReport(this.bidOpportunityId, page, pageSize).subscribe(respone => {
      this.pagedResultChangeHistoryList = respone;
      this.updateInfoList = groupBy(this.pagedResultChangeHistoryList.items, [{ field: 'changedTime' }]);
      this.pagedResultChangeHistoryList.total = this.updateInfoList.length;
      this.updateInfoList = (this.updateInfoList || []).slice(
        +this.pagedResultChangeHistoryList.pageSize * +this.pagedResultChangeHistoryList.currentPage,
        +this.pagedResultChangeHistoryList.pageSize * (+this.pagedResultChangeHistoryList.currentPage + 1)
      );
      this.pagedResultChangeHistoryList.items = this.updateInfoList;
      this.pagedResultChangeHistoryList.pageCount = Math.ceil(+this.updateInfoList.length / +this.pagedResultChangeHistoryList.pageSize);
      this.indexItemHistoryChange = +respone.total - +respone.pageSize * +respone.currentPage;
      this.updateInfoList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.updateInfoList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormStep' }]);
        });
      });
      // setTimeout(() => {
      //   this.dtTrigger2.next();
      // });
    });
  }

  onActivate(actionMode: string) {
    EditComponent.actionMode = actionMode;
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
    instance.type = 'LiveFormThamQuanBaoCaoCongTruong';
    instance.packageId = this.bidOpportunityId;
  }

  viewDetail(data, index) {
    this.dataChangeHistory = data;
    this.index = index;
    this.showPopupDetail = true;
  }

  closePopupDetail() {
    this.showPopupDetail = false;
  }
  lineDisplay(data, amount) {
    if (amount >= 4) {
      this.isShowMore = true;
      return 1;
    }
    if (amount === 2) {
      if (data.length === 2) { this.isShowMore = true; }
      return 2;
    }
    if (amount === 3) {
      this.isShowMore = true;
      return 1;
    } else {
      this.isShowMore = false;
      return 50;
    }
  }
}
