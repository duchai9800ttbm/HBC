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
import { slideToLeft } from '../../../../../router.animations';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../shared/models/permission/Permission.model';


@Component({
  selector: 'app-interview-negotiation',
  templateUrl: './interview-negotiation.component.html',
  styleUrls: ['./interview-negotiation.component.scss'],
  animations: [slideToLeft()]
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

  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  listPermissionScreen2 = [];

  TaoMoiLMPV = false;
  CapNhatLMPV = false;
  ThongBaoPV = false;
  XemEmailTBPV = false;
  ChotCongTacChuanBiPhongVan = false;
  UploadBBPV = false;
  DongPV = false;
  HieuChinhHSDT = false;
  nodirection = false;
  constructor(
    private dialogService: DialogService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private interviewInvitationService: InterviewInvitationService,
    private activeRouter: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private permissionService: PermissionService

  ) {
  }

  ngOnInit() {
    this.subscription = this.interviewInvitationService.watchNoDirection().subscribe(value => {
      this.nodirection = value;
    });
    this.statusInInterviewList = [this.bidStatus.DaNopHSDT, this.bidStatus.DaNhanLoiMoi,
    this.bidStatus.ChuanBiPhongVan, this.bidStatus.DaChotCongTacChuanBiPhongVan, this.bidStatus.DaPhongVan];
    this.stattusCurrentList = ['create', 'prepare', 'end'];
    this.packageId = +PackageDetailComponent.packageId;
    const permisstion = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'QuanLyPhongVanThuongThao')[0];
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
      }
      this.TaoMoiLMPV = this.listPermissionScreen.includes('TaoMoiLMPV');
      this.CapNhatLMPV = this.listPermissionScreen.includes('CapNhatLMPV');
      this.ThongBaoPV = this.listPermissionScreen.includes('ThongBaoPV');
      this.XemEmailTBPV = this.listPermissionScreen.includes('XemEmailTBPV');
      this.ChotCongTacChuanBiPhongVan = this.listPermissionScreen.includes('ChotCongTacChuanBiPhongVan');
      this.UploadBBPV = this.listPermissionScreen.includes('UploadBBPV');
      this.DongPV = this.listPermissionScreen.includes('DongPV');
      this.HieuChinhHSDT = this.listPermissionScreen2.includes('HieuChinhHSDT');
    });
    this.subscription.add(permisstion);
    this.checkStatusPackageFuc();
    const status$ = this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      this.checkStatusPackageFuc();
    });
    this.subscription.add(status$);
    const eventRouter = this.router.events.subscribe((val) => {
      if ((val instanceof NavigationEnd) === true) {
        this.checkStatusPackageFuc();
      }
    });
    this.directionalRouter();
    this.subscription.add(eventRouter);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    // this.interviewInvitationService.changeNoDirection(false);
    this.interviewInvitationService.removeMaxVersion();
  }

  directionalRouter() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      if (!this.nodirection) {
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
      }
    });
  }

  checkStatusPackageFuc() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
      this.interviewOfPackage = result.interviewInvitation ? result.interviewInvitation.interviewTimes : null;
      this.activeRouter.firstChild.url.subscribe(url => {
        this.urlCurrent = url[0].path;
        for (let i = 0; i < this.stattusCurrentList.length; i++) {
          if (this.stattusCurrentList[i] === this.urlCurrent) {
            this.currentStatusInterview = i + 1;
            break;
          }
        }
        this.interviewInvitationService.changeUrlChirld(this.currentStatusInterview);
      });
    });
  }
  // =========================
  // Đã nộp HSDT
  refeshSubmittedHSDT() {
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
      this.alertService.error('Bạn chưa chọn lời mời phỏng vấn nào');
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
    instance.interviewOfPackage = this.interviewOfPackage;
    instance.versionOfPackage = this.interviewInvitationService.maxVersionReport;
    instance.callBack = () => this.closePopuupEndInterview();
    // instance.
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
      this.packageService.setStatusPackage();
      this.alertService.success('Đóng phỏng vấn thành công!');
      this.router.navigate([`/package/detail/${this.packageId}/result/wait-result`]);
    },
      err => {
        this.alertService.error('Đóng phỏng vấn không thành công!');
      });
  }

  refeshAll() {
    switch (this.urlCurrent) {
      case 'create': {
        if (this.statusPackage && (this.statusPackage.id === this.checkStatusPackage.DaNopHSDT.id)) {
          this.refeshSubmittedHSDT();
        } else {
          this.refreshCreateInterview();
        }
        break;
      }
      case 'prepare': {
        this.refreshPrepareInterview();
        break;
      }
      case 'end': {
        this.refreshEndInterview();
        break;
      }
    }
  }
}
