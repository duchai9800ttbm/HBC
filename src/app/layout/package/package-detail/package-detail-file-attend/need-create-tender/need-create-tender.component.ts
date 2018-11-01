import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { NeedCreateTenderFormComponent } from './need-create-tender-form/need-create-tender-form.component';
import { ProposeTenderParticipateRequest } from '../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../shared/services/package.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject, Subscription } from 'rxjs';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
// tslint:disable-next-line:max-line-length
import { ProposedTenderParticipationHistory } from '../../../../../shared/models/api-response/package/proposed-tender-participation-history.model';
import { PagedResult } from '../../../../../shared/models';
import { GroupDescriptor, DataResult, process, groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../shared/components/form-in/form-in.component';
import { slideToLeft } from '../../../../../router.animations';
import { PermissionModel } from '../../../../../shared/models/permission/Permission.model';
import { PermissionService } from '../../../../../shared/services/permission.service';

@Component({
  selector: 'app-need-create-tender',
  templateUrl: './need-create-tender.component.html',
  styleUrls: ['./need-create-tender.component.scss'],
  animations: [slideToLeft()]
})
export class NeedCreateTenderComponent implements OnInit, OnDestroy {

  dtOptions: any = DATATABLE_CONFIG;
  dtOptions2: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  bidOpportunityId;
  proposedTender: ProposeTenderParticipateRequest;
  isShowDialog = false;
  isNotAgreeParticipating = false;
  dateApproveBid = new Date();
  packageInfo: PackageInfoModel;
  bidStatus = BidStatus;
  reasonApproveBid = '';
  pagedResultChangeHistoryList: PagedResult<ProposedTenderParticipationHistory[]> = new PagedResult<ProposedTenderParticipationHistory[]>();
  historyList;
  dialog;
  indexItemHistoryChange: number;
  // get expectedDate() {
  //   return
  // }
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  TaoMoiDNDT = false;
  XemDNDT = false;
  SuaDNDT = false;
  XoaDNDT = false;
  InDNDT = false;
  XacNhanKy = false;
  GuiDuyetDNDT = false;
  ChapThuanKhongChapThuan = false;
  TaiTemplate = false;
  subscription: Subscription;
  constructor(
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private confirmService: ConfirmationService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.getProposedTenderParticipateReportInfo();
    this.getChangeHistory(0, 10);
    this.getPackageInfo();
    // phân quyền
    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      console.log(this.listPermission);
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'PhieuDeNghiDuThau')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }
      }
      this.TaoMoiDNDT = this.listPermissionScreen.includes('TaoMoiDNDT');
      this.XemDNDT = this.listPermissionScreen.includes('XemDNDT');
      this.SuaDNDT = this.listPermissionScreen.includes('SuaDNDT');
      this.XoaDNDT = this.listPermissionScreen.includes('XoaDNDT');
      this.InDNDT = this.listPermissionScreen.includes('InDNDT');
      this.XacNhanKy = this.listPermissionScreen.includes('XacNhanKy');
      this.GuiDuyetDNDT = this.listPermissionScreen.includes('GuiDuyetDNDT');
      this.ChapThuanKhongChapThuan = this.listPermissionScreen.includes('ChapThuanKhongChapThuan');
      this.TaiTemplate = this.listPermissionScreen.includes('TaiTemplate');
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh() {
    this.statusObservableHsdtService.change();
    this.getProposedTenderParticipateReportInfo();
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
    this.getPackageInfo();
  }

  getChangeHistory(page: number | string, pageSize: number | string) {
    this.spinner.show();
    this.packageService.getChangeHistoryListProposedTender(this.bidOpportunityId, page, pageSize).subscribe(respone => {
      this.historyList = respone.items;
      this.pagedResultChangeHistoryList = respone;
      this.historyList = groupBy(this.pagedResultChangeHistoryList.items, [{ field: 'changedTime' }]);
      this.historyList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.historyList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormStep' }]);
        });
      });
      console.log('this.historyList-after', this.historyList);
      this.indexItemHistoryChange = Number(this.pagedResultChangeHistoryList.total)
        - Number(this.pagedResultChangeHistoryList.pageSize) * Number(this.pagedResultChangeHistoryList.currentPage);
      console.log('this.indexItemHistoryChange', this.indexItemHistoryChange);
      setTimeout(() => {
        this.dtTrigger2.next();
      });
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        // this.alertService.error('Lấy danh sách lịch sử thay đổi phiếu đề nghị dự thầu thất bại!');
      });
  }

  pagedResultChangeHistory(e) {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }

  getProposedTenderParticipateReportInfo() {
    this.spinner.show();
    this.packageService.getProposedTenderParticipateReport(this.bidOpportunityId).subscribe(data => {
      if (data) {
        NeedCreateTenderFormComponent.formModel = data;
        this.proposedTender = data;
        // tslint:disable-next-line:max-line-length
        this.dateApproveBid = this.proposedTender && this.proposedTender.tenderDirectorProposal && this.proposedTender.tenderDirectorProposal.expectedDate ? DateTimeConvertHelper.fromTimestampToDtObject(this.proposedTender.tenderDirectorProposal.expectedDate * 1000) : new Date();
        setTimeout(() => {
          this.dtTrigger.next();
        });
      } else {
        NeedCreateTenderFormComponent.formModel = new ProposeTenderParticipateRequest();
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.alertService.error('Lấy thông tin phiếu đề nghị dự thầu thất bại!');
    });
  }

  getPackageInfo() {
    this.packageService
      .getInforPackageID(this.bidOpportunityId)
      .subscribe(data => {
        console.log('goi lan 1');
        this.packageInfo = data;
        this.spinner.hide();
      });
  }

  changeAction(data: string) {
    this.packageService.setRouterAction(data);
  }

  downloadTemplate() {
    this.packageService.downloadProposedTenderParticipateReport().subscribe(data => console.log());
  }

  printForm() {
    this.dialog = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialog.content.instance;
    instance.type = 'LiveFormPhieuDeNghiDuThau';
    instance.packageId = this.bidOpportunityId;
  }

  sendApproveBidProposal() {
    this.spinner.show();
    this.packageService.sendApproveBidProposal(this.bidOpportunityId, DateTimeConvertHelper.fromDtObjectToSecon(this.dateApproveBid))
      .subscribe(data => {
        this.getProposedTenderParticipateReportInfo();
        this.notificationService.change();
        this.spinner.hide();
        this.alertService.success('Gửi duyệt đề nghị dự thầu thành công!');
        this.isShowDialog = false;
        this.getPackageInfo();
      }, err => {
        this.spinner.hide();
        this.alertService.error('Gửi duyệt đề nghị dự thầu thất bại!');
        this.isShowDialog = false;
      });
  }

  approveBidProposal() {
    this.spinner.show();
    this.packageService.approveBidProposal(this.bidOpportunityId, this.reasonApproveBid)
      .subscribe(data => {
        this.spinner.hide();
        this.statusObservableHsdtService.change();
        this.alertService.success('Duyệt đề nghị dự thầu thành công!');
        this.isShowDialog = false;
        this.reasonApproveBid = '';
        this.getPackageInfo();
      }, err => {
        this.spinner.hide();
        this.alertService.error('Duyệt đề nghị dự thầu thất bại!');
        this.isShowDialog = false;
        this.reasonApproveBid = '';
      });
  }

  notApproveBidProposal() {
    this.spinner.show();
    this.packageService.notApproveBidProposal(this.bidOpportunityId, this.reasonApproveBid)
      .subscribe(data => {
        this.spinner.hide();
        this.statusObservableHsdtService.change();
        this.alertService.success('Không duyệt đề nghị dự thầu thành công!');
        this.isShowDialog = false;
        this.reasonApproveBid = '';
        this.getPackageInfo();
      }, err => {
        this.spinner.hide();
        this.alertService.error('Không duyệt đề nghị dự thầu thất bại!');
        this.isShowDialog = false;
        this.reasonApproveBid = '';
      });
  }

  deleteProposedTenderParticipateReport() {
    this.confirmService.confirm('Bạn có chắc chắn muốn xóa phiếu đề nghị dự thầu này?', () => {
      this.spinner.show();
      this.packageService.deleteProposedTenderParticipateReport(this.bidOpportunityId).subscribe(data => {
        this.alertService.success('Xóa phiếu đề nghị dự thầu thành công!');
        this.spinner.hide();
        this.proposedTender = null;
        this.getProposedTenderParticipateReportInfo();
        this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
      }, err => {
        this.alertService.error('Xóa phiếu đề nghị dự thầu thất bại');
        this.spinner.hide();
      });
    });
  }

  closeDialog() {
    this.isShowDialog = false;
    this.isNotAgreeParticipating = false;
  }

  onSelectAll(value: boolean) {
    this.historyList.forEach(x => (x['checkboxSelected'] = value));
  }

  checkSigned() {
    if (NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isSigned) {
      this.isShowDialog = true;
    } else {
      this.isShowDialog = false;
      this.confirmService.missAction('Đề nghị dự thầu chưa được xác nhận ký bởi giám đốc dự thầu',
        `/package/detail/${this.bidOpportunityId}/attend/create-request/form/edit/director-proposal`);
    }
  }
}
