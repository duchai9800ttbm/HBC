import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';

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
  modalRef: BsModalRef;
  textTitleSendMail: string;
  textMetting: string;
  doNotiMeeting: boolean;
  textUploadReport: string;
  type: number;
  isSendCc: boolean;
  isSendBcc: boolean;
  reportMeeting: boolean;
  reportFile:boolean;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  reasons: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Thiết kế đẹp ' },
    { id: 2, name: 'Kỹ thuật, nguồn lực tốt' },
    { id: 3, name: 'Khác' }

  ];
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) { }

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
    this.reportFile = true;
    this.reportMeeting = true;
    this.modalUpload.hide();
  }
  submitForm() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    console.log('2');
    this.reportFile = false;
    this.reportMeeting = true;
    this.modalUpload.hide();
  }


  sendMail() {
    this.doNotiMeeting = true;
    this.textMetting = this.doNotiMeeting ? 'Đã thông báo họp kick-off' : 'Đã nhận tài liệu';
    this.modalRef.hide();
  }

  ClosePopup() {
    this.modalRef.hide();
  }

  modalUp(template: TemplateRef<any>, type: number) {
    this.type = type;
    if (this.type == 1) {
      this.textUploadReport = 'Upload biên bản cuộc họp';
    } else {
      this.textUploadReport = 'Upload file presentation';
    }
    this.modalUpload = this.modalService.show(template);

  }

}
