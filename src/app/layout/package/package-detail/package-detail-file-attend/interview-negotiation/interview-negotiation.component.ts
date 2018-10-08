import { Component, OnInit } from '@angular/core';
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
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs';
import { ActivatedRoute, Router, NavigationEnd } from '../../../../../../../node_modules/@angular/router';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { AlertService } from '../../../../../shared/services';


@Component({
  selector: 'app-interview-negotiation',
  templateUrl: './interview-negotiation.component.html',
  styleUrls: ['./interview-negotiation.component.scss']
})
export class InterviewNegotiationComponent implements OnInit {
  changeKeySearchInterviewInvitation$ = new BehaviorSubject<string>('');
  packageId: number;
  statusPackage;
  numberStatusPackageInterview;
  bidStatus = BidStatus;
  amountInterview: number;
  dialog;
  statusInInterviewList;
  stattusCurrentList;
  currentStatusInterview;
  isNgOnInit = false;
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
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      console.log('status');
      this.checkStatusPackage();
    });
    this.changeKeySearchInterviewInvitation$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.interviewInvitationService.changeKeySearchInterviewInvitation(keySearch);
      });
    this.router.events.subscribe((val) => {
      if ((val instanceof NavigationEnd) === true) {
        this.checkStatusPackage();
      }
    });
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
        case (this.bidStatus.DaChotCongTacChuanBiPhongVan || this.bidStatus.DaPhongVan): {
          this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
          break;
        }
      }
    });
  }

  checkStatusPackage() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.statusPackage = result.stageStatus.id;
      this.activeRouter.firstChild.url.subscribe(url => {
        const urlCurrent = url[0].path;
        for (let i = 0; i < this.stattusCurrentList.length; i++) {
          if (this.stattusCurrentList[i] === urlCurrent) {
            this.currentStatusInterview = i + 1;
            break;
          }
        }
        this.interviewInvitationService.changeUrlChirld(this.currentStatusInterview);
      });
      for (let i = 0; i < this.statusInInterviewList.length; i++) {
        if (this.statusInInterviewList[i] === this.statusPackage) {
            this.numberStatusPackageInterview = i;
          break;
        }
      }
      console.log('this.currentStatusInterview', this.currentStatusInterview);
      console.log('this.numberStatusPackageInterview', this.numberStatusPackageInterview);
      // if (!this.isNgOnInit) {
      //   switch (this.numberStatusPackageInterview) {
      //     case 1: {
      //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/create`]);
      //       break;
      //     }
      //     case 2: {
      //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/prepare`]);
      //       break;
      //     }
      //     case 3: {
      //       this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/end`]);
      //       break;
      //     }
      //   }
      //   this.isNgOnInit = true;
      // }

      // if (this.statusPackage === this.bidStatus.DaNopHSDT || this.statusPackage === this.bidStatus.DaNhanLoiMoi) {
      //   this.interviewInvitationService.getListInterview(
      //     this.packageId,
      //     0,
      //     1000
      //   ).subscribe(response => {
      //     this.amountInterview = response.length + 1;
      //   });
      // }
    });
  }

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
    this.dialog = this.dialogService.open({
      content: InterviewNoticeComponent,
      width: 1100,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
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
    console.log('approvedInterviewPreparation');
    this.spinner.show();
    this.interviewInvitationService.approvedinterviewpreparation(this.packageId).subscribe(response => {
      this.spinner.hide();
      this.alertService.success('Chốt công tác chuẩn bị phỏng vấn thành công!');
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Chốt công tác chuẩn bị phỏng vấn thất bại!');
      });
  }
}
