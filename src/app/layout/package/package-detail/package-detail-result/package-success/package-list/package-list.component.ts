import { Component, OnInit, TemplateRef, Output, EventEmitter, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject, Subscription } from '../../../../../../../../node_modules/rxjs';
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
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { ViewDetailComponent } from '../../view-detail/view-detail.component';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import { slideToLeft } from '../../../../../../router.animations';
import Utils from '../../../../../../shared/helpers/utils.helper';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
@Component({
  selector: 'app-package-list',
  templateUrl: './package-list.component.html',
  styleUrls: ['./package-list.component.scss'],
  animations: [slideToLeft()]
})
export class PackageListComponent implements OnInit, OnDestroy {
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

  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  ChonKQDT = false;
  UploadKQDT = false;
  TaiXuongKQDT = false;
  TaiTemplate = false;
  XoaKQDT = false;
  ThongBaoDenPhongHopDong = false;
  XemEmailPhanHoi = false;
  ThongBaoStakeholders = false;
  XemMailThongBaoTrungThau = false;
  ChuyenGiaoTaiLieu = false;
  XemMailChuyenGiao = false;
  subscription: Subscription;
  checkStatusPackage = CheckStatusPackage;
  isAgain = false;
  inforPackage;
  dialogViewDetail;
  errorMess: string;
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
    private permissionService: PermissionService

  ) { }

  ngOnInit() {
    this.statusPackage = this.packageService.statusPackageValue2;
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'KQDT')[0];
      if (!hsdt) {
        this.listPermissionScreen = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'KetQuaDuThau')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }
      }
      this.ChonKQDT = this.listPermissionScreen.includes('ChonKQDT');
      this.UploadKQDT = this.listPermissionScreen.includes('UploadKQDT');
      this.TaiXuongKQDT = this.listPermissionScreen.includes('TaiXuongKQDT');
      this.TaiTemplate = this.listPermissionScreen.includes('TaiTemplate');
      this.XoaKQDT = this.listPermissionScreen.includes('XoaKQDT');
      this.ThongBaoDenPhongHopDong = this.listPermissionScreen.includes('ThongBaoDenPhongHopDong');
      this.ThongBaoStakeholders = this.listPermissionScreen.includes('ThongBaoStakeholders');
      this.ChuyenGiaoTaiLieu = this.listPermissionScreen.includes('ChuyenGiaoTaiLieu');

    });
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
    // tslint:disable-next-line:max-line-length
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.inforPackage = result;
      // this.defaultContentEmail();
    });
  }

  defaultContentEmail() {
    // tslint:disable-next-line:max-line-length
    this.emailModel.content = `<p style="text-align: center;"><span style="font-size:16px;"><strong>THƯ CẢM ƠN TH&Ocirc;NG B&Aacute;O KẾT QUẢ TR&Uacute;NG THẦU</strong></span></p>

    <p>Dự án: ${(this.inforPackage && this.inforPackage.projectName) ? this.inforPackage.projectName : ''}</p>
    
    <p>Gói thầu: ${(this.inforPackage && this.inforPackage.opportunityName) ? this.inforPackage.opportunityName : ''}</p>
    
    <p>Địa điểm: ${(this.inforPackage && this.inforPackage.place) ? this.inforPackage.place : ''}</p>
    
    <p>K&iacute;nh gửi: <strong>Quý ${(this.inforPackage && this.inforPackage.customer && this.inforPackage.customer.text) ? this.inforPackage.customer.text : ''}</strong></p>
    
    <p>Truớc ti&ecirc;n, Ph&ograve;ng Dự thầu C&ocirc;ng ty CP XD &amp; Kinh Doanh Địa Ốc Ho&agrave; B&igrave;nh cảm ơn Qu&yacute; c&ocirc;ng ty đ&atilde; hợp t&aacute;c với ch&uacute;ng t&ocirc;i trong suốt qu&aacute; tr&igrave;nh đấu thầu. Trong thời gian qua, Ph&ograve;ng Dự thầu nhận được sự hỗ trợ v&agrave; hợp t&aacute;c tốt từ Qu&yacute; c&ocirc;ng ty l&agrave; điều ch&uacute;ng t&ocirc;i lu&ocirc;n lu&ocirc;n đ&aacute;nh gi&aacute; cao v&agrave; ghi nhận.</p>
    
    <p>Hiện nay, ch&uacute;ng t&ocirc;i xin được th&ocirc;ng b&aacute;o đến Qu&yacute; c&ocirc;ng ty rằng: C&ocirc;ng ty CP XD &amp; Kinh Doanh Địa Ốc Ho&agrave; B&igrave;nh đ&atilde; <u><strong>TR&Uacute;NG THẦU</strong></u>&nbsp;dự &aacute;n tr&ecirc;n.</p>
    
    <p>Mọi th&ocirc;ng tin li&ecirc;n lạc của qu&yacute; c&ocirc;ng ty, Ph&ograve;ng Dự thầu đ&atilde; chuyển cho c&aacute;c Bản Chỉ Huy C&ocirc;ng Truờng v&agrave; Ph&ograve;ng ban li&ecirc;n quan để tiếp tục qu&aacute; tr&igrave;nh chọn thầu theo Quy tr&igrave;nh của c&ocirc;ng ty Ho&agrave; B&igrave;nh.</p>
    
    <p>Qu&yacute; c&ocirc;ng ty vui l&ograve;ng li&ecirc;n hệ với c&aacute;c th&agrave;nh vi&ecirc;n sau của c&ocirc;ng ty Ho&agrave; B&igrave;nh để chuẩn bị tiếp c&aacute;c buớc tiếp theo về qu&aacute; tr&igrave;nh chọn nh&agrave; thầu phụ/ cung cấp của C&ocirc;ng ty ch&uacute;ng t&ocirc;i:</p>
    
    <p><strong>&nbsp; &nbsp; &nbsp; &nbsp; 1. Ban chỉ huy c&ocirc;ng tr&igrave;nh:</strong></p>
    
    <p>&nbsp; &nbsp; &nbsp; &nbsp; &Ocirc;ng/b&agrave;: ........................................ Điện thoại ................................ Email ................................</p>
    
    <p><strong>&nbsp; &nbsp; &nbsp; &nbsp; 2. Ph&ograve;ng QS - Hợp đồng:</strong></p>
    
    <p>&nbsp; &nbsp; &nbsp; &nbsp; &Ocirc;ng/b&agrave;: ........................................ Điện thoại ................................ Email ................................</p>
    
    <p>Cần hỗ trợ th&ocirc;ng tin g&igrave; th&ecirc;m từ Ph&ograve;ng Dự Thầu, vui l&ograve;ng li&ecirc;n hệ với Trưởng nh&oacute;m dự thầu:</p>
    
    <p>&nbsp; &nbsp; &nbsp; &nbsp; &Ocirc;ng/b&agrave;: ........................................ Điện thoại ................................ Email ................................</p>
    
    <p>Lần nữa, cảm ơn Qu&yacute; c&ocirc;ng ty đ&atilde; đồng h&agrave;nh v&agrave; hợp t&aacute;c th&agrave;nh c&ocirc;ng tốt đẹp với c&ocirc;ng ty Ho&agrave; B&igrave;nh tại dự &aacute;n n&agrave;y, Ch&uacute;ng t&ocirc;i hy vọng sẽ đuợc Qu&yacute; c&ocirc;ng ty hỗ trợ cho c&aacute;c dự &aacute;n kh&aacute;c trong tương lai.</p>
    
    <p>Tr&acirc;n trọng.</p>
    
    <p style="text-align: right;">Tp.HCM, ng&agrave;y ...... th&aacute;ng ....... năm ........</p>
    
    <p style="text-align: right;">Truởng nh&oacute;m dự thầu,&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</p>
    
    <p>&nbsp;</p>`;
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  openModalNotification(template: TemplateRef<any>, actionSendEmail: string, isAgain: boolean) {
    this.actionSendEmail = actionSendEmail;
    this.errorMess = null;
    this.emailModel = new SendEmailModel();
    switch (actionSendEmail) {
      case 'ContractRoom': {
        break;
      }
      case 'Stakeholders': {
        this.defaultContentEmail();
        break;
      }
    };
    this.isAgain = isAgain;
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
  uploadkqdt(updateStatusPackage: boolean) {
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
    instance.updateStatusPackage = updateStatusPackage;
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
      this.maxVersion = (response && response.length !== 0) ? Math.max.apply(Math, this.listFileResult.map(item => item.version)) : 0;
      // tslint:disable-next-line:max-line-length
      this.maxInterviewTimes = (response && response.length !== 0) ? Math.max.apply(Math, this.listFileResult.map(item => item.interviewTimes)) : 0;
      if (alert) {
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Đã xảy ra lỗi 1!');
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
        this.alertService.error('Tài liệu kết quả dự thầu này không có file đính kèm.');
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
    // : FileList
    const fileList = event.target.files;
    if (fileList.length > 0 && Utils.checkTypeFile(fileList)) {
      this.errorMess = null;
      for (let i = 0; i < fileList.length; i++) {
        this.file.push(fileList[i]);
      }
      event.target.value = null;
    } else {
      // tslint:disable-next-line:max-line-length
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx';
    }
  }
  deleteFileUpload(index: number) {
    this.file.splice(index, 1);
  }
  SendInformation() {
    if (this.emailModel && this.emailModel.to) {
      this.emailModel.bidOpportunityId = this.currentPackageId;
      this.spinner.show();
      switch (this.actionSendEmail) {
        case ('ContractRoom'): {
          this.detailResultPackageService.sendFeedbackToContractRoom(this.emailModel, this.file).subscribe(result => {
            this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaPhanHoiDenPhongHopDong.text);

            // this.defaultContentEmail();
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
          this.detailResultPackageService.sendFeedbackToStakeholders(this.emailModel, this.file, this.isAgain).subscribe(result => {
            this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaThongBaoCacBenLienQuan.text);
            this.emailModel = new SendEmailModel();
            this.file = [];
            this.alertService.success('Gửi thông báo cho các bên liên quan thành công!');
            this.modalRef.hide();
            this.spinner.hide();
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi. Gửi thông báo cho các bên liên quan không thành công!');
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

  viewDetail(item) {
    this.dialogViewDetail = this.dialogService.open({
      content: ViewDetailComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogViewDetail.content.instance;
    instance.callBack = () => this.closePopuupDialogViewDetail();
    instance.content = item;
  }

  closePopuupDialogViewDetail() {
    this.dialogViewDetail.close();
  }

  downloadTemplate(type) {
    switch (type) {
      case 'LostBid': {
        this.detailResultPackageService.downloadTemplateLostBid().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
      case 'WinBid': {
        this.detailResultPackageService.downloadTemplateWinBid().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
      case 'LessonLearn': {
        this.detailResultPackageService.downloadTemplateLessonLearn().subscribe(response => {
        },
          err => {
            this.alertService.error('Tải về template không thành công.');
          });
        break;
      }
    }
  }

  // downloadTemplate() {
  // this.detailResultPackageService.downloadTemplateResult().subscribe(response => {
  // },
  //   err => {
  //     this.alertService.error('Đã xảy ra lỗi 2!');
  //   });
  // }

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
