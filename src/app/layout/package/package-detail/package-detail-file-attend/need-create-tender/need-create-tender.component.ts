import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { NeedCreateTenderFormComponent } from './need-create-tender-form/need-create-tender-form.component';
import { ProposeTenderParticipateRequest } from '../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../shared/services/package.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from 'rxjs';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { NotificationService } from '../../../../../shared/services/notification.service';
import { ProposedTenderParticipationHistory } from '../../../../../shared/models/api-response/package/proposed-tender-participation-history.model';
import { PagedResult } from '../../../../../shared/models';

@Component({
  selector: 'app-need-create-tender',
  templateUrl: './need-create-tender.component.html',
  styleUrls: ['./need-create-tender.component.scss']
})
export class NeedCreateTenderComponent implements OnInit {

  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  bidOpportunityId;
  proposedTender: ProposeTenderParticipateRequest;
  isShowDialog = false;
  isNotAgreeParticipating = false;
  dateApproveBid = new Date();
  packageInfo: PackageInfoModel;
  bidStatus = BidStatus;
  reasonApproveBid = '';
  pagedResultChangeHistoryList: PagedResult<ProposedTenderParticipationHistory[]> = new PagedResult<ProposedTenderParticipationHistory[]>();
  constructor(
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private confirmService: ConfirmationService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.getProposedTenderParticipateReportInfo();
    this.getChangeHistory();
    this.getPackageInfo();
  }

  refresh() {
    this.getProposedTenderParticipateReportInfo();
    this.getChangeHistory();
    this.getPackageInfo();
  }

  getChangeHistory() {
    this.spinner.show();
    this.packageService.getChangeHistoryListProposedTender(this.bidOpportunityId, 0, 1000).subscribe(respone => {
      this.pagedResultChangeHistoryList = respone;
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Lấy danh sách lịch sử thay đổi phiếu đề nghị dự thầu thất bại!');
      });
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
    const printContent = document.getElementById('divPrint');
    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
    WindowPrt.document.write(`
      <html>
        <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <style type="text/css">
        .logo-hbc {
            max-width: 50%;
            object-fit: contain;
            max-height: 10em;
        }
        </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>`);
    WindowPrt.document.close();
    WindowPrt.focus();
    setTimeout(() => {
      WindowPrt.print();
      WindowPrt.close();
    }, 250);
  }

  sendApproveBidProposal() {
    if (NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isSigned) {
      this.spinner.show();
      this.packageService.sendApproveBidProposal(this.bidOpportunityId, DateTimeConvertHelper.fromDtObjectToSecon(this.dateApproveBid))
        .subscribe(data => {
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
    } else {
      this.isShowDialog = false;
      this.confirmService.missAction('Đề nghị dự thầu chưa được xác nhân ký bởi giám đốc dự thầu',
        `/package/detail/${this.bidOpportunityId}/attend/create-request/form/edit/director-proposal`);
    }
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
    this.pagedResultChangeHistoryList.items.forEach(x => (x['checkboxSelected'] = value));
  }
}
