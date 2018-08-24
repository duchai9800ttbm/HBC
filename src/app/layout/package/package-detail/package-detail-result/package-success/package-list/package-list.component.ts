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
  isSendCc: boolean;
  isSendBcc: boolean;
  textTrungThau: string;
  textNotification: string;
  textTitleSendMail: string;
  showTableSigned: boolean;
  modalUpload: BsModalRef;
  formUpload: FormGroup;
  submitted = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  @Output() active: EventEmitter<any> = new EventEmitter<any>();
  resultData: any = [
    { id: 1, bidReviewDocumentName: 'Tài liệu cung cấp vật tư', bidReviewDocumentVersion: 1, bidReviewDocumentStatus: 'Danh sách tài liệu cung cấp vật tư', employeeName: 'Oliver Dinh', bidReviewDocumentUploadDate: '01/01/2018 ,09:00', interview: 1 },
    { id: 2, bidReviewDocumentName: 'Tài liệu cung cấp giấy tờ liên quan', bidReviewDocumentVersion: 1.1, bidReviewDocumentStatus: '', employeeName: 'Van Dinh', bidReviewDocumentUploadDate: '02/02/2018,09:00', interview: 1 }
  ];
  listData: any = [
    { id: 1, username: 'Oliver Dinh', email: 'oliverdinh@gmail.com' },
    { id: 2, username: 'Van Dinh', email: 'vandinh@gmail.com' },
    { id: 3, username: 'Huy Nhat', email: 'huynhat@gmail.com' }
  ]
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private packageService: PackageService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.showTableSigned =false;
    this.showBtnNotification = false;
    this.isSendCc = false;
    this.isSendBcc = false;
    this.textTrungThau = 'Trúng thầu';
    this.textNotification = 'Thông báo cho phòng hợp đồng';
    this.textTitleSendMail = 'Gửi thư phản hồi đến phòng hợp đồng';
  }
  openModalNotification(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );
  }
  modelViewListData(template: TemplateRef<any>) {
    this.modalViewData = this.modalService.show(template);
  }
  onSelectAll(value: boolean) {
    this.resultData.forEach(x => (x['checkboxSelected'] = value));
  }

  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
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
    this.textTrungThau = this.showBtnNotification ? 'Đã thông báo đến các bên liên quan': 'Đã phản hồi đến phòng hợp đồng' ;
    this.textTitleSendMail = this.showBtnNotification ? 'Gửi thư thông báo đến các bên liên quan' : 'Gửi thư phản hồi đến phòng hợp đồng';
    this.alertService.success('Thông báo đến đến các bên liên quan thành công!');
  }
  uploadkqdt (template: TemplateRef<any>) {
    this.modalUpload = this.modalService.show(template);
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
}
