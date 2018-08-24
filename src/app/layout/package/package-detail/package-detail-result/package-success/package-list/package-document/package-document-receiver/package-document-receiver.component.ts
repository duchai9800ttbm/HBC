import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../../../shared/services/package-success.service';
import { SessionService } from '../../../../../../../../shared/services/index';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { ConfirmationService, AlertService } from '../../../../../../../../shared/services';

@Component({
  selector: 'app-package-document-receiver',
  templateUrl: './package-document-receiver.component.html',
  styleUrls: ['./package-document-receiver.component.scss']
})
export class PackageDocumentReceiverComponent implements OnInit {

  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  seclectAllDocument: boolean;
  isDataHsmt: boolean;
  isDataHsdt: boolean;
  total: number;
  textmovedata: string;
  isManageTransfer: boolean;
  modalRef: BsModalRef;
  userGetDocument: boolean;
  btnManageTransfer: boolean;
  textUserManage: string;
  userInfo: any;
  bntConfirm: boolean;
  public data: DocumentItem[] = this.packageSuccessService.getdataGetDocument();

  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private sessionService: SessionService,
    private packageService: PackageService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {

    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = false;
    this.isDataHsdt = false;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer = false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
    this.total = this.data.length;
    this.bntConfirm = false;
  }
  onSelectAll(value: boolean) {
    this.data.forEach(x => (x['checkboxSelected'] = value));

  }

  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;

  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
  transferofdocuments() {
    this.userGetDocument = false;
    this.isManageTransfer = true;
    this.btnManageTransfer = false;
    this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
  }

  confirmGot() {
    this.confirmationService.confirm(
      'Bạn có muốn xác nhận nhận tài liệu?',
      () => {
        this.alertService.success('Xác nhận nhận tài liệu thành công!');
        this.bntConfirm = true;
        this.packageService.setActiveKickoff(this.bntConfirm)
        this.textmovedata = this.bntConfirm ? 'Đã nhận tài liệu được chuyển giao' : 'Chưa nhận tài liệu được chuyển giao';
      }
    );

  }

  manageTransferDocument(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

}
