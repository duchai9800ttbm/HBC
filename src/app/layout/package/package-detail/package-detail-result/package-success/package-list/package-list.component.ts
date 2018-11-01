import { Component, OnInit, TemplateRef, Output, EventEmitter } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
import { Router } from '@angular/router';
import { PackageService } from '../../../../../../shared/services/package.service';
import { ConfirmationService, AlertService } from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UploadResultFileAttendComponent } from './upload-result-file-attend/upload-result-file-attend.component';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { DocumentResultList } from '../../../../../../shared/models/result-attend/document-result-list.model';
import { NotificationContractComponent } from './notification-contract/notification-contract.component';
import { SendEmailModel } from '../../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../../shared/services/email.service';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';
@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss']
})
export class PackageListComponent implements OnInit {
  packageId: number;
  modalRef: BsModalRef;
  modalViewData: BsModalRef;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  showBtnNotification: boolean;
  textTrungThau: string;
  textNotification: string;
  textTitleSendMail: string;
  showTableSigned: boolean;
  modalUpload: BsModalRef;
  formUpload: FormGroup;
  submitted = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  dialogUploadResultAttend;
  dialogNotificationContract;
  currentPackageId: number;
  listFileResult: DocumentResultList[];
  currentFieldSort;
  statusSort;
  emailModel: SendEmailModel = new SendEmailModel();
  ckeConfig: any;
  isSendCc = false;
  isSendBcc = false;
  file = [];
  listEmailSearchTo;
  listEmailSearchCc;
  listEmailSearchBcc;
  actionSendEmail = 'ContractRoom';
  bidStatus = BidStatus;
  maxVersion = 0;
  maxInterviewTimes = 0;
  @Output() active: EventEmitter<any> = new EventEmitter<any>();
  resultData: any = [
    { id: 1, bidReviewDocumentName: 'Tài liệu cung cấp vật tư', bidReviewDocumentVersion: 1, bidReviewDocumentStatus: 'Danh sách tài liệu cung cấp vật tư', employeeName: 'Oliver Dinh', bidReviewDocumentUploadDate: '01/01/2018 ,09:00', interview: 1 },
    { id: 2, bidReviewDocumentName: 'Tài liệu cung cấp giấy tờ liên quan', bidReviewDocumentVersion: 1.1, bidReviewDocumentStatus: '', employeeName: 'Van Dinh', bidReviewDocumentUploadDate: '02/02/2018,09:00', interview: 1 }
  ];
  listData: any = [
    { id: 1, username: 'Oliver Dinh', email: 'oliverdinh@gmail.com' },
    { id: 2, username: 'Van Dinh', email: 'vandinh@gmail.com' },
    { id: 3, username: 'Huy Nhat', email: 'huynhat@gmail.com' }
  ];
  statusPackage = {
    text: 'DaThongBaoCacBenLienQuan',
    stage: 'KQDT',
    id: null,
  };
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private packageService: PackageService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private dialogService: DialogService,
    private detailResultPackageService: DetailResultPackageService,
    private confirmationService: ConfirmationService,
    private emailService: EmailService,
  ) { }

  ngOnInit() {
    this.statusPackage = this.packageService.statusPackageValue2;
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.packageService.statusPackageValue$.subscribe(status => {
      this.statusPackage = status;
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
    this.emailService.searchbymail('').subscribe(response => {
      this.listEmailSearchTo = response;
      this.listEmailSearchCc = response;
      this.listEmailSearchBcc = response;
    });
    // this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
    //   this.statusPackage = result.stageStatus.id;
    // });
    this.refesh(false);
    this.detailResultPackageService.watchListFileResult().subscribe(response => {
      this.refesh(false);
    });
    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.showTableSigned = false;
    this.showBtnNotification = false;
    this.isSendCc = false;
    this.isSendBcc = false;
    this.textTrungThau = 'Trúng thầu';
  }
  openModalNotification(template: TemplateRef<any>, actionSendEmail: string) {
    this.actionSendEmail = actionSendEmail;
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );
  }
  modelViewListData(template: TemplateRef<any>) {
    this.modalViewData = this.modalService.show(template);
  }
  onSelectAll(value: boolean) {
    this.listFileResult.forEach(x => (x['checkboxSelected'] = value));
  }
  ClosePopup() {
    this.modalRef.hide();
    this.router.navigate([`/package/detail/${this.packageId}/result`]);
  }
  SendMailHD() {
    this.modalRef.hide();
    this.showBtnNotification = true;
    this.packageService.setUserId(this.showBtnNotification);
    this.textTrungThau = this.showBtnNotification ? 'Đã phản hồi đến phòng hợp đồng' : 'Trúng thầu';
    this.textNotification = this.showBtnNotification ? 'Thông báo cho các bên liên quan' : 'Thông báo cho phòng hợp đồng';
    this.textTitleSendMail = this.showBtnNotification ? 'Gửi thư thông báo đến các bên liên quan' : 'Gửi thư phản hồi đến phòng hợp đồng';
    this.alertService.success('Thông báo đến phòng hợp đồng thành công!');
  }
  SendMailOther() {
    this.modalRef.hide();
    this.showBtnNotification = true;
    this.showTableSigned = true;
    this.textTrungThau = this.showBtnNotification ? 'Đã thông báo đến các bên liên quan' : 'Đã phản hồi đến phòng hợp đồng';
    this.textTitleSendMail = this.showBtnNotification ? 'Gửi thư thông báo đến các bên liên quan' : 'Gửi thư phản hồi đến phòng hợp đồng';
    this.alertService.success('Thông báo đến đến các bên liên quan thành công!');
  }
  uploadkqdt() {
    this.dialogUploadResultAttend = this.dialogService.open({
      content: UploadResultFileAttendComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadResultAttend.content.instance;
    instance.callBack = () => this.closePopuup();
    instance.version = this.maxVersion + 1;
    instance.interviewTimes = this.maxInterviewTimes + 1;
    instance.winOrLost = true;
  }
  closePopuup() {
    this.dialogUploadResultAttend.close();
  }
  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.modalUpload.hide();
    this.alertService.success('Upload file kết quả dự thầu thành công!');
  }
  refesh(alert: boolean) {
    this.spinner.show();
    this.detailResultPackageService.getListFileResult(this.currentPackageId).subscribe(response => {
      this.listFileResult = response;
      this.maxVersion = Math.max.apply(Math, this.listFileResult.map(item => item.version));
      this.maxInterviewTimes = Math.max.apply(Math, this.listFileResult.map(item => item.interviewTimes));
      if (alert) {
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Đã xảy ra lỗi!');
      });
  }
  downloadTemplate() {
    this.detailResultPackageService.downloadTemplateResult().subscribe(response => {
    },
      err => {
        this.alertService.error('Đã xảy ra lỗi!');
      });
  }
  deleteFileResult() {
    const listItemCheckbox = [];
    this.listFileResult.forEach(x => {
      if (x['checkboxSelected'] === true) {
        listItemCheckbox.push(x.id);
      }
    });
    switch (listItemCheckbox.length) {
      case 0: {
        this.alertService.error('Bạn chưa chọn tài liệu cần xóa!');
        break;
      }
      case 1: {
        this.confirmationService.confirm(
          'Bạn có chắc chắn muốn xóa tài liệu được chọn?',
          () => {
            this.detailResultPackageService.deleteFileResult(listItemCheckbox[0]).subscribe(response => {
              this.refesh(false);
              this.alertService.success('Xóa tài liệu thành công!');
            },
              err => {
                this.alertService.error('Xóa tài liệu không thành công!');
              });
          });
        break;
      }
      default: {
        this.confirmationService.confirm(
          'Bạn có chắc chắn muốn xóa tài liệu được chọn?',
          () => {
            this.detailResultPackageService.deleteMutipleFileResult(listItemCheckbox).subscribe(response => {
              this.refesh(false);
              this.alertService.success('Xóa tài liệu thành công!');
            },
              err => {
                this.alertService.error('Xóa tài liệu không thành công!');
              });
          });
      }
    }
  }
  downloadFileItem(tenderResultDocumentId) {
    this.detailResultPackageService.downloadFileResult(tenderResultDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải tài liệu không thành công');
      });
  }
  render(listFileResult: any) {
    this.listFileResult = listFileResult;
    // this.dtTrigger.next();
  }
  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSort = fieldSort;
    this.statusSort = statusSort;
    switch (this.statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'name': {
            this.listFileResult = this.listFileResult.sort((a, b) => {
              return ('' + a.name).localeCompare(b.name);
            });
            this.render(this.listFileResult);
            break;
          }
          case 'version': {
            this.listFileResult = this.listFileResult.sort((a, b) => a.version - b.version);
            this.render(this.listFileResult);
            break;
          }
          case 'employeeName': {
            this.listFileResult = this.listFileResult.sort((a, b) => {
              return ('' + a.uploadBy.employeeName).localeCompare(b.uploadBy.employeeName);
            });
            this.render(this.listFileResult);
            break;
          }
          case 'uploadDate': {
            this.listFileResult = this.listFileResult.sort((a, b) => a.uploadDate - b.uploadDate);
            this.render(this.listFileResult);
            break;
          }
          case 'interviewTimes': {
            this.listFileResult = this.listFileResult.sort((a, b) => a.interviewTimes - b.interviewTimes);
            this.render(this.listFileResult);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'name': {
            this.listFileResult = this.listFileResult.sort((a, b) => {
              return ('' + b.name).localeCompare(a.name);
            });
            this.render(this.listFileResult);
            break;
          }
          case 'version': {
            this.listFileResult = this.listFileResult.sort((a, b) => b.version - a.version);
            this.render(this.listFileResult);
            break;
          }
          case 'employeeName': {
            this.listFileResult = this.listFileResult.sort((a, b) => {
              return ('' + b.uploadBy.employeeName).localeCompare(a.uploadBy.employeeName);
            });
            this.render(this.listFileResult);
            break;
          }
          case 'uploadDate': {
            this.listFileResult = this.listFileResult.sort((a, b) => b.uploadDate - a.uploadDate);
            this.render(this.listFileResult);
            break;
          }
          case 'interviewTimes': {
            this.listFileResult = this.listFileResult.sort((a, b) => b.interviewTimes - a.interviewTimes);
            this.render(this.listFileResult);
            break;
          }
        }
        break;
      }
      case '': {
        this.listFileResult = this.listFileResult.sort((a, b) => a.id - b.id);
        this.render(this.listFileResult);
        break;
      }
    }
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
      this.emailModel.bidOpportunityId = this.currentPackageId;
      this.spinner.show();
      console.log('this.actionSendEmail', this.actionSendEmail);
      switch (this.actionSendEmail) {
        case ('ContractRoom'): {
          this.detailResultPackageService.sendFeedbackToContractRoom(this.emailModel, this.file).subscribe(result => {
            this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaPhanHoiDenPHopDong.text);
            this.emailModel = new SendEmailModel();
            this.file = [];
            this.alertService.success('Gửi phản hồi đến phòng hợp đồng thành công!');
            this.modalRef.hide();
            this.spinner.hide();
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi. Gửi phản hồi đến phòng hợp đồng không thành công!');
              this.modalRef.hide();
              this.spinner.hide();
            });
          break;
        }
        case ('Stakeholders'): {
          this.detailResultPackageService.sendFeedbackToStakeholders(this.emailModel, this.file).subscribe(result => {
            this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaThongBaoCacBenLienQuan.text);
            this.emailModel = new SendEmailModel();
            this.file = [];
            this.alertService.success('Gửi phản hồi đến phòng hợp đồng thành công!');
            this.modalRef.hide();
            this.spinner.hide();
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi. Gửi phản hồi đến phòng hợp đồng không thành công!');
              this.modalRef.hide();
              this.spinner.hide();
            });
          break;
        }
      }

    }
  }
  deleteFileItem(tenderResultDocumentId: number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu được chọn?',
      () => {
        this.detailResultPackageService.deleteFileResult(tenderResultDocumentId).subscribe(response => {
          this.refesh(false);
          this.alertService.success('Xóa tài liệu thành công!');
        },
          err => {
            this.alertService.error('Xóa tài liệu không thành công!');
          });
      });
  }
}
