import { Component, OnInit, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject, Subscription } from '../../../../../../../node_modules/rxjs';
import { PackageDetailComponent } from '../../package-detail.component';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocumentResultList } from '../../../../../shared/models/result-attend/document-result-list.model';
import { DetailResultPackageService } from '../../../../../shared/services/detail-result-package.service';
import { UploadResultFileAttendComponent } from '../package-success/package-list/upload-result-file-attend/upload-result-file-attend.component';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';

@Component({
  selector: 'app-package-failed',
  templateUrl: './package-failed.component.html',
  styleUrls: ['./package-failed.component.scss']
})
export class PackageFailedComponent implements OnInit, OnDestroy {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  currentPackageId: number;
  modalRef: BsModalRef;
  modalViewData: BsModalRef;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  ckeditorContent = '<p>Dear All!</p>';
  isSendCc: boolean;
  isSendBcc: boolean;
  textHeader: string;
  textNotification: string;
  showBtnNotification: boolean;
  modalUpload: BsModalRef;
  formUpload: FormGroup;
  submitted = false;
  bidDocumentReviewListItemSearchResult: any = [
    { id: 1, bidReviewDocumentName: 'Tài liệu cung cấp vật tư', bidReviewDocumentVersion: 1, bidReviewDocumentStatus: 'Danh sách tài liệu cung cấp vật tư', employeeName: 'Oliver Dinh', bidReviewDocumentUploadDate: '01/01/2018 ,09:00', interview: 1 },
    { id: 2, bidReviewDocumentName: 'Tài liệu cung cấp giấy tờ liên quan', bidReviewDocumentVersion: 1.1, bidReviewDocumentStatus: '', employeeName: 'Van Dinh', bidReviewDocumentUploadDate: '02/02/2018,09:00', interview: 1 }
  ];
  listData = [
    { id: 1, username: 'Oliver Dinh', email: 'oliverdinh@gmail.com' },
    { id: 2, username: 'Van Dinh', email: 'vandinh@gmail.com' },
    { id: 3, username: 'Huy Nhat', email: 'huynhat@gmail.com' }
  ];
  listFileResult: DocumentResultList[];
  currentFieldSort;
  statusSort;
  dialogUploadResultAttend;
  subscription: Subscription;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
    private detailResultPackageService: DetailResultPackageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.isSendCc = false;
    this.isSendBcc = false;
    this.showBtnNotification = false;
    this.textHeader = 'Trật thầu';
    this.textNotification = 'Thông báo các bên liên quan';
    this.refesh(false);
    this.subscription = this.detailResultPackageService.watchListFileResult().subscribe(response => {
      this.refesh(false);
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
  onSelectAll(value: boolean) {
    this.listFileResult.forEach(x => (x['checkboxSelected'] = value));
  }
  modelViewListData(template: TemplateRef<any>) {
    this.modalViewData = this.modalService.show(template);
  }
  openModalNotification(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );
  }
  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
  }
  SendMail() {
    this.modalRef.hide();
    this.showBtnNotification = true;
    this.textHeader = this.showBtnNotification ? 'Đã thông báo cho các bên liên quan' : 'Trật thầu';
    this.textNotification = this.showBtnNotification ? 'Thông báo lại cho các bên liên quan' : 'Thông báo cho các bên liên quan';
    this.alertService.success('Thông báo cho các bên liên quan thành công!');
  }

  ClosePopup() {
    this.modalRef.hide();
    this.router.navigate([`/package/detail/${this.currentPackageId}/result`]);
  }
  // uploadkqdt(template: TemplateRef<any>) {
  //   this.modalUpload = this.modalService.show(template);
  // }

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

  render(listFileResult: any) {
    this.listFileResult = listFileResult;
    this.dtTrigger.next();
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
  downloadTemplate() {
    this.detailResultPackageService.downloadTemplateResult().subscribe(response => {
    },
      err => {
        this.alertService.error('Đã xảy ra lỗi!');
      });
  }
  uploadkqdt() {
    this.dialogUploadResultAttend = this.dialogService.open({
      content: UploadResultFileAttendComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadResultAttend.content.instance;
    instance.callBack = () => this.closePopuup();
    // // instance.reloadData = () => this.reloadData();
  }
  closePopuup() {
    this.dialogUploadResultAttend.close();
  }
  downloadFileItem(tenderResultDocumentId) {
    this.detailResultPackageService.downloadFileResult(tenderResultDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải tài liệu không thành công');
      });
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

