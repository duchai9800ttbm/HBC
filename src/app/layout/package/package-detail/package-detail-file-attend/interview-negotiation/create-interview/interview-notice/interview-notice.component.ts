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
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { StatusObservableHsdtService } from '../../../../../../../shared/services/status-observable-hsdt.service';
import { Router } from '../../../../../../../../../node_modules/@angular/router';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
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
  interviewChoose;
  maxBidInterviewInvitationId = 1;
  arrayBidInterviewInvitationId = [];
  constructor(
    private emailService: EmailService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private packageService: PackageService,
    private interviewInvitationService: InterviewInvitationService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private router: Router,
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
    this.packageService.getInforPackageID(this.packageId).subscribe(response => {
      this.packageInfo = response;
      if (this.packageInfo.projectName) {
        // tslint:disable-next-line:max-line-length
        this.emailModel.subject = `Dự án ${this.packageInfo.projectName}, gói thầu ${this.packageInfo.opportunityName} thông báo phỏng vấn`;
      } else {
        // tslint:disable-next-line:max-line-length
        this.emailModel.subject = `Gói thầu ${this.packageInfo.opportunityName} thông báo phỏng vấn`;
      }
    });
    if (this.interviewInvitationService.getChooseInterviewNotification()) {
      this.interviewChoose = this.interviewInvitationService.getChooseInterviewNotification();
      // Bỏ max Interview
      // const sortInterviewTimes = this.interviewChoose.sort((a, b) => b.interviewTimes - a.interviewTimes);
      // this.maxBidInterviewInvitationId = sortInterviewTimes[0].id;
      this.emailModel.content = `<br>`;
      this.interviewChoose = this.interviewChoose.sort((a, b) => a.interviewTimes - b.interviewTimes);
      this.interviewChoose.forEach((element, index) => {
        this.interviewInvitationService.LoadFileCreateInterview(element.id).subscribe(response => {
          this.file.push(response);
        });
        const approvedDate = DateTimeConvertHelper.fromTimestampToDtObject(element.approvedDate * 1000);
        const approvedDateStr = approvedDate.getDate() + '/' + (approvedDate.getMonth() + 1) + '/' + approvedDate.getFullYear();
        const interviewDate = DateTimeConvertHelper.fromTimestampToDtObject(element.interviewDate * 1000);
        let interviewDateStr = '';
        if (interviewDate) {
          const hour = interviewDate.getHours() < 10 ? '0' + interviewDate.getHours() : interviewDate.getHours();
          const minutes = interviewDate.getMinutes() < 10 ? '0' + interviewDate.getMinutes() : interviewDate.getMinutes();
          interviewDateStr = interviewDate.getDate() + '/' + (interviewDate.getMonth() + 1) + '/' + interviewDate.getFullYear()
            + ',' + hour + ':' + minutes;
        }
        this.emailModel.content = this.emailModel.content + `
                              <div>Lần phỏng vấn: ${element.interviewTimes}</div>
                              <li> <span>Khách hàng:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;<span>${element.customer && element.customer.customerName ? element.customer.customerName : ''}</span></li>
                              <li> <span>Ngày nhận phỏng vấn:</span>&emsp;&ensp;<span>${approvedDateStr}</span></li>
                              <li> <span>Thời gian phỏng vấn:</span>&emsp;&emsp;<span>${interviewDateStr}</span></li>
                              <li> <span>Địa điểm:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;<span>${element.place}</span></li>
                              <li> <span>Nội dung:</span>&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&nbsp;<span>${element.content ? element.content : ''}</span></li>`;
      });
    }
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
        { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
        { name: 'clipboard', items: ['Cut', 'Copy', 'Paste', 'PasteText', 'Undo', 'Redo'] },
      ],
      allowedContent: true,
      extraPlugins: 'colorbutton,font,justify,print,tableresize,pastefromword,liststyle,autolink,uploadimage',
      pasteFromWord_inlineImages: true,
      forcePasteAsPlainText: false,
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
      // this.maxBidInterviewInvitationId
      this.interviewChoose.forEach((element, index) => {
        this.arrayBidInterviewInvitationId.push(element.id);
      });
      this.emailService.sendEmailInterview(this.emailModel, this.file, this.arrayBidInterviewInvitationId).subscribe(result => {
        this.closePopup();
        this.statusObservableHsdtService.change();
        this.router.navigate([`/package/detail/${this.packageId}/attend/interview-negotiation/prepare`]);
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
  customSearchFn(term: string, item: SearchEmailModel) {
    term = term.toLocaleLowerCase();
    return item.employeeName.toLocaleLowerCase().indexOf(term) > -1 || item.employeeEmail.toLocaleLowerCase().indexOf(term) > -1;
  }

  validateEmailTo(e) {
    this.emailModel.to = this.emailModel.to
      .filter(x => x.employeeId || (!x.employeeId && CustomValidator.validateEmail(x.employeeName)));
  }

  validateEmailCc(e) {
    this.emailModel.cc = this.emailModel.cc
      .filter(x => x.employeeId || (!x.employeeId && CustomValidator.validateEmail(x.employeeName)));
  }

  validateEmailBcc(e) {
    this.emailModel.bcc = this.emailModel.bcc
      .filter(x => x.employeeId || (!x.employeeId && CustomValidator.validateEmail(x.employeeName)));
  }

}
