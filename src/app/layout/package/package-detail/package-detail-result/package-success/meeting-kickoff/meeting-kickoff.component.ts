import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
import { ConfirmationService, AlertService } from '../../../../../../shared/services';
import { EmailService } from '../../../../../../shared/services/email.service';
import { SendEmailModel } from '../../../../../../shared/models/send-email-model';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { UploadKickOffComponent } from './upload-kick-off/upload-kick-off.component';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';

@Component({
  selector: 'app-meeting-kickoff',
  templateUrl: './meeting-kickoff.component.html',
  styleUrls: ['./meeting-kickoff.component.scss']
})
export class MeetingKickoffComponent implements OnInit {
  formUpload: FormGroup;
  submitted = false;
  currentPackageId: number;
  modalUpload: BsModalRef;
  modalViewData: BsModalRef;
  modalRef: BsModalRef;
  textTitleSendMail: string;
  textMetting: string;
  doNotiMeeting: boolean;
  textUploadReport: string;
  type: number;
  isSendCc: boolean;
  isSendBcc: boolean;
  reportMeeting: boolean;
  reportFile: boolean;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  listData: any = [
    { id: 1, username: 'Oliver Dinh', email: 'oliverdinh@gmail.com' },
    { id: 2, username: 'Van Dinh', email: 'vandinh@gmail.com' },
    { id: 3, username: 'Huy Nhat', email: 'huynhat@gmail.com' }
  ];
  listEmailSearchTo;
  listEmailSearchCc;
  listEmailSearchBcc;
  emailModel: SendEmailModel = new SendEmailModel();
  ckeConfig;
  file = [];
  actionEmail: string;
  dialogUploadMettingKickOff;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService,
    private detailResultPackageService: DetailResultPackageService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.formUpload = this.formBuilder.group({
      name: [''],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: [''],
      link: ['']
    });
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.textMetting = 'Đã nhận tài liệu';
    this.textTitleSendMail = 'Gửi thư thông báo họp kich-off dự án';
    this.doNotiMeeting = false;
    this.isSendCc = false;
    this.reportMeeting = false;
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

    this.emailService.searchbymail('').subscribe(response => {
      this.listEmailSearchTo = response;
      this.listEmailSearchCc = response;
      this.listEmailSearchBcc = response;
    });
  }

  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
  }
  modalNoti(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );
  }

  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success/meeting-kickoff/report-meeting`]);
    this.alertService.success('Upload biên bản cuộc họp thành công!');
    this.reportFile = true;
    this.reportMeeting = true;
    this.modalUpload.hide();
  }

  submitForm() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success/meeting-kickoff/report-meeting`]);
    this.alertService.success('Upload file Presentation thành công!');
    this.reportFile = false;
    this.reportMeeting = true;
    this.modalUpload.hide();
  }


  sendMail() {
    this.doNotiMeeting = true;
    this.alertService.success('Gửi thông báo họp kick-off thành công!');
    this.textMetting = this.doNotiMeeting ? 'Đã thông báo họp kick-off' : 'Đã nhận tài liệu';
    this.modalRef.hide();
  }

  ClosePopup() {
    this.modalRef.hide();
  }

  // modalUp(template: TemplateRef<any>, type: number) {
  //   this.type = type;
  //   if (this.type === 1) {
  //     this.textUploadReport = 'Upload biên bản cuộc họp';
  //   } else {
  //     this.textUploadReport = 'Upload file presentation';
  //   }
  //   this.modalUpload = this.modalService.show(template);
  // }
  modelViewListData(template: TemplateRef<any>) {
    this.modalViewData = this.modalService.show(template);
  }
  // Gửi thư thông báo kick-off
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
      this.emailModel.bidOpportunityId = this.currentPackageId;
      this.spinner.show();
      this.detailResultPackageService.notiMeetingKickOff(this.emailModel, this.file).subscribe(result => {
        this.emailModel = new SendEmailModel();
        this.file = [];
        this.alertService.success('Gửi thư thông báo họp kick-off dự án thành công!');
        this.modalRef.hide();
        this.spinner.hide();
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi. Gửi thư thông báo họp kick-off dự án không thành công!');
          this.modalRef.hide();
          this.spinner.hide();
        });
    }
  }
  // Upload meeting kick-off
  modalUp(action) {
    this.dialogUploadMettingKickOff = this.dialogService.open({
      content: UploadKickOffComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadMettingKickOff.content.instance;
    instance.callBack = () => this.closePopuup();
    instance.action = action;
  }
  closePopuup() {
    this.dialogUploadMettingKickOff.close();
  }
}
