import { Component, OnInit, Input } from '@angular/core';
import { BehaviorSubject, Observable } from '../../../../../../../../../node_modules/rxjs';
import { SearchEmailModel } from '../../../../../../../shared/models/search-email.model';
import { SendEmailModel } from '../../../../../../../shared/models/send-email-model';
import { COMMON_CONSTANTS } from '../../../../../../../shared/configs/common.config';
import { EmailService } from '../../../../../../../shared/services/email.service';
import { map } from 'rxjs/operators/map';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../../node_modules/ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';
import { BsModalRef } from '../../../../../../../../../node_modules/ngx-bootstrap';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
@Component({
  selector: 'app-interview-notice',
  templateUrl: './interview-notice.component.html',
  styleUrls: ['./interview-notice.component.scss']
})
export class InterviewNoticeComponent implements OnInit {
  @Input() callBack: Function;
  packageId: number;
  modalRef: BsModalRef;
  listEmailSearchTo;
  listEmailSearchCc;
  listEmailSearchBcc;
  searchTermTo$ = new BehaviorSubject<string>('');
  searchTermCc$ = new BehaviorSubject<string>('');
  searchTermBcc$ = new BehaviorSubject<string>('');
  emailModel: SendEmailModel = new SendEmailModel();
  isSendCc = false;
  isSendBcc = false;
  ckeConfig: any;
  file = [];
  packageInfo;
  constructor(
    private emailService: EmailService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private packageService: PackageService,
    private interviewInvitationService: InterviewInvitationService,
  ) { }
  public valueNormalizerTo = (employeeName$: Observable<string>) => employeeName$.pipe(map((employeeName: string) => {
    const emailModelTo = new SearchEmailModel();
    emailModelTo.employeeName = employeeName;
    emailModelTo.employeeEmail = employeeName;
    if (!this.emailModel.to) {
      this.emailModel.to = [];
    }
    this.emailModel.to.push(emailModelTo);
  }))

  public valueNormalizerCc = (employeeName$: Observable<string>) => employeeName$.pipe(map((employeeName: string) => {
    const emailModelCc = new SearchEmailModel();
    emailModelCc.employeeName = employeeName;
    emailModelCc.employeeEmail = employeeName;
    if (!this.emailModel.cc) {
      this.emailModel.cc = [];
    }
    this.emailModel.cc.push(emailModelCc);
  }))

  public valueNormalizerBcc = (employeeName$: Observable<string>) => employeeName$.pipe(map((employeeName: string) => {
    const emailModelBcc = new SearchEmailModel();
    emailModelBcc.employeeName = employeeName;
    emailModelBcc.employeeEmail = employeeName;
    if (!this.emailModel.bcc) {
      this.emailModel.bcc = [];
    }
    this.emailModel.bcc.push(emailModelBcc);
  }))
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.packageId).subscribe( response => {
      this.packageInfo = response;
      this.emailModel.subject = `DỰ ÁN ${this.packageInfo.projectName}, GÓI THẦU ${this.packageInfo.opportunityName} THÔNG BÁO PHỎNG VẤN`;
    });
    // this.emailModel.content = `ĐẶNG BẢO QUYỀN`;
    console.log('this.serveice', this.interviewInvitationService.getChooseInterviewNotification());
    this.searchTermTo$
      .debounceTime(COMMON_CONSTANTS.SearchEmailDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term => {
        this.emailService.searchbymail(term).subscribe(response => {
          this.listEmailSearchTo = response;
        });
      });
    this.searchTermCc$
      .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term => {
        this.emailService.searchbymail(term).subscribe(response => {
          this.listEmailSearchCc = response;
        });
      });
    this.searchTermBcc$
      .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term => {
        this.emailService.searchbymail(term).subscribe(response => {
          this.listEmailSearchBcc = response;
        });
      });
    this.ckeConfig = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['Styles', 'Format', 'FontSize', '-', 'TextColor', 'BGColor'] },
      ]
    };
  }

  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
  }

  uploadfile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        this.file.push(fileList[i]);
      }
      event.target.value = null;
    }
  }

  deleteFileUpload(index: number) {
    this.file.splice(index, 1);
  }

  SendInformation() {
    if (this.emailModel && this.emailModel.to) {
      this.emailModel.bidOpportunityId = this.packageId;
      this.spinner.show();
      this.emailService.sendEmailInterview(this.emailModel, this.file).subscribe(result => {
        this.alertService.success('Gửi thông báo phỏng vấn đến các bên liên quan thành công!');
        this.spinner.hide();
      },
        err => {
          if (err.json().errorCode === 'BusinessException') {
            this.alertService.error('Đã xảy ra lỗi. Trạng thái gói thầu không hợp lệ!');
          } else {
            this.alertService.error('Đã xảy ra lỗi. Gửi thông báo phỏng vấn đến các bên liên quan không thành công!');
          }
          this.spinner.hide();
        });
    }
  }


  closePopup() {
    this.callBack();
  }

}
