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
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  isClosedHSDT: boolean;
  subscription: Subscription;

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
      this.isClosedHSDT = status;
    });
    this.packageId = PackageDetailComponent.packageId;

    this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrinhDuyetGia')[0];
        if (screen) {
          this.listPermissionScreen = screen.permissions.filter(z => z.value);
        }
      }
    });


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
    this.spinner.show();
    this.hoSoDuThauService.getChangeHistoryListProposedTender(this.packageId, page, pageSize).subscribe(respone => {
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

  print() {
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
  }
}
