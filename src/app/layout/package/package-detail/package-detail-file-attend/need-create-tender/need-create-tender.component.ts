import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { NeedCreateTenderFormComponent } from './need-create-tender-form/need-create-tender-form.component';
import { ProposeTenderParticipateRequest } from '../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../shared/services/package.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from 'rxjs';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';

@Component({
  selector: 'app-need-create-tender',
  templateUrl: './need-create-tender.component.html',
  styleUrls: ['./need-create-tender.component.scss']
})
export class NeedCreateTenderComponent implements OnInit {

  static routerAction = '';
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
  constructor(
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.spinner.show();
    this.packageService.getProposedTenderParticipateReport(this.bidOpportunityId).subscribe(data => {
      if (data) {
        NeedCreateTenderFormComponent.formModel = data;
        this.proposedTender = data;
        // this.dateApproveBid = this.proposedTender.tenderDirectorProposal.
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
    this.getPackageInfo();
  }

  getPackageInfo() {
    this.packageService
    .getInforPackageID(this.bidOpportunityId)
    .subscribe(data => {
        this.packageInfo = data;
        this.spinner.hide();
        console.log(data);
    });
  }

  changeAction(data: string) {
    NeedCreateTenderComponent.routerAction = data;
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
    this.spinner.show();
    this.packageService.sendApproveBidProposal(this.bidOpportunityId, DateTimeConvertHelper.fromDtObjectToSecon(this.dateApproveBid))
      .subscribe(data => {
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

  closeDialog() {
    this.isShowDialog = false;
    this.isNotAgreeParticipating = false;
  }

}
