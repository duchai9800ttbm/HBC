import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { InterviewInvitationService } from '../../../../../shared/services/interview-invitation.service';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-interview/create-new-invitation/create-new-invitation.component';
import { InterviewInvitation } from '../../../../../shared/models/interview-invitation/interview-invitation-create.model';
import { CustomerModel } from '../../../../../shared/models/interview-invitation/customer.model';
import { InterviewNoticeComponent } from './create-interview/interview-notice/interview-notice.component';
import { BehaviorSubject, Subscription } from '../../../../../../../node_modules/rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { AlertService } from '../../../../../shared/services';
import { ReportEndInterviewComponent } from './end-interview/report-end-interview/report-end-interview.component';
import { CheckStatusPackage } from '../../../../../shared/constants/check-status-package';


@Component({
  selector: 'app-interview-negotiation',
  templateUrl: './interview-negotiation.component.html',
  styleUrls: ['./interview-negotiation.component.scss']
})
export class InterviewNegotiationComponent implements OnInit, OnDestroy {
  changeKeySearchInterviewInvitation$ = new BehaviorSubject<string>('');
  packageId: number;
  statusPackage = {
    text: 'DaNhanLoiMoi',
    stage: 'HSDT',
    id: 16,
  };
  numberStatusPackageInterview;
  bidStatus = BidStatus;
  amountInterview: number;
  dialog;
  dialogEndInterview;
  statusInInterviewList;
  stattusCurrentList;
  currentStatusInterview;
  isNgOnInit = false;
  subscription: Subscription;
  checkStatusPackage = CheckStatusPackage;
  urlCurrent;
  interviewOfPackage = '';
  constructor(
    private dialogService: DialogService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private interviewInvitationService: InterviewInvitationService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
  ) {
  }

  ngOnInit() {
    this.statusInInterviewList = [this.bidStatus.DaNopHSDT, this.bidStatus.DaNhanLoiMoi,
    this.bidStatus.ChuanBiPhongVan, this.bidStatus.DaChotCongTacChuanBiPhongVan, this.bidStatus.DaPhongVan];
    this.stattusCurrentList = ['create', 'prepare', 'end'];
    this.packageId = +PackageDetailComponent.packageId;
    this.checkStatusPackageFuc();
    this.subscription = this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      // this.directionalRouter();
      this.checkStatusPackageFuc();
    });
    // this.changeKeySearchInterviewInvitation$.debounceTime(600)
    //   .distinctUntilChanged()
    //   .subscribe(keySearch => {
    //     this.interviewInvitationService.changeKeySearchInterviewInvitation(keySearch);
    //   });
    const eventRouter = this.router.events.subscribe((val) => {
      if ((val instanceof NavigationEnd) === true) {
        this.checkStatusPackageFuc();
      }
    });
    this.directionalRouter();
    this.subscription.add(eventRouter);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  directionalRouter() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      switch (result.stageStatus.id) {
        case (this.bidStatus.DaNopHSDT || this.bidStatus.DaNhanLoiMoi): {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/create`]);
          break;
        }
        case this.bidStatus.ChuanBiPhongVan: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/prepare`]);
          break;
        }
        case this.bidStatus.DaChotCongTacChuanBiPhongVan:
        case this.bidStatus.DaPhongVan: {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
          break;
        }
      }
    });
  }

  checkStatusPackageFuc() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
      this.interviewOfPackage = result.interviewInvitation ? result.interviewInvitation.interviewTimes : null;
      console.log('this.result-packaeg', result, this.interviewOfPackage);
      this.activeRouter.firstChild.url.subscribe(url => {
        this.urlCurrent = url[0].path;
        console.log('urlCurrent', this.urlCurrent, this.statusPackage);
        for (let i = 0; i < this.stattusCurrentList.length; i++) {
          if (this.stattusCurrentList[i] === this.urlCurrent) {
            this.currentStatusInterview = i + 1;
            break;
          }
        }
        this.interviewInvitationService.changeUrlChirld(this.currentStatusInterview);
      });
      // for (let i = 0; i < this.statusInInterviewList.length; i++) {
      //   if (this.statusInInterviewList[i] === this.statusPackage) {
      //     this.numberStatusPackageInterview = i;
      //     break;
      //   }
      // }
    });
  }
  // =========================
  // Đã nộp HSDT
  refeshSubmittedHSDT() {
    // this.directionalRouter();
    this.checkStatusPackageFuc();
    this.refreshCreateInterview();
  }
  // =========================
  // Create Interview
  createInvitation(interviewCreate: InterviewInvitation) {
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 700,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    interviewCreate = new InterviewInvitation();
    interviewCreate.customer = new CustomerModel();
    instance.interviewInvitation = interviewCreate;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialog.close();
  }

  noticeInterview() {
    if (this.interviewInvitationService.getChooseInterviewNotification()
      && this.interviewInvitationService.getChooseInterviewNotification().length !== 0) {
      this.dialog = this.dialogService.open({
        content: InterviewNoticeComponent,
        width: 1100,
        minWidth: 250
      });
      const instance = this.dialog.content.instance;
      instance.callBack = () => this.closePopuup();
    } else {
      this.alertService.error('Chưa chọn lần phỏng vấn!');
    }
  }

  refreshCreateInterview() {
    this.interviewInvitationService.chagneRefeshInterviewInvitationList(true);
  }

  // =============================
  // PrepareInterview
  refreshPrepareInterview() {
    this.interviewInvitationService.chagneRefeshPrepareInterview(true);
  }

  approvedInterviewPreparation() {
    this.spinner.show();
    this.interviewInvitationService.approvedinterviewpreparation(this.packageId).subscribe(response => {
      this.statusObservableHsdtService.change();
      this.spinner.hide();
      this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
      this.alertService.success('Chốt công tác chuẩn bị phỏng vấn thành công!');
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Chốt công tác chuẩn bị phỏng vấn thất bại!');
      });
  }

  downloadTemplatePrepare() {
    this.interviewInvitationService.downloadTemplatePrepare().subscribe(item => {
    },
      err => {
        this.alertService.error('Tải template chuẩn bị phỏng vấn thất bại!');
      });
  }

  // =======================
  // End Interview
  refreshEndInterview() {
    this.interviewInvitationService.chagneRefeshEndInterview(true);
  }
  uploadReportInterview() {
    this.dialogEndInterview = this.dialogService.open({
      content: ReportEndInterviewComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogEndInterview.content.instance;
    console.log('this.interviewOfPackage', this.interviewOfPackage);
    instance.interviewOfPackage = this.interviewOfPackage;
    instance.callBack = () => this.closePopuupEndInterview();
  }

  closePopuupEndInterview() {
    this.dialogEndInterview.close();
  }

  downloadTemplateEnd() {
    this.interviewInvitationService.downloadTemplateEnd().subscribe(response => {
    },
      err => {
        this.alertService.error('Tải template không thành công!');
      });
  }

  correctionHSDT() {
    this.interviewInvitationService.correctionHSDT(this.packageId).subscribe(response => {
      this.alertService.success('Hiệu chỉnh hồ sơ dự thầu thành công!');
      this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
    },
      err => {
        this.alertService.error('Hiệu chỉnh hồ sơ dự thầu không thành công!');
      });
  }

  closeInterview() {
    this.interviewInvitationService.closeInterview(this.packageId).subscribe(response => {
      this.alertService.success('Đóng phỏng vấn thành công!');
      this.router.navigate([`/package/detail/${this.packageId}/result/wait-result`]);
    },
      err => {
        this.alertService.error('Đóng phỏng vấn không thành công!');
      });
  }
}
