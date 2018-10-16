import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../../../shared/services/package-success.service';
import { SessionService, DataService } from '../../../../../../../../shared/services/index';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../../../shared/services/detail-result-package.service';
import { NgxSpinnerService } from '../../../../../../../../../../node_modules/ngx-spinner';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { NeedTranferDocList } from '../../../../../../../../shared/models/result-attend/need-transfer-doc-list.model';
import { FilterNeedTransferDoc } from '../../../../../../../../shared/models/result-attend/filter-need-transfer-doc.model';
import { DepartmentsFormBranches } from '../../../../../../../../shared/models/user/departments-from-branches';
import { FormGroup, FormBuilder, FormArray } from '../../../../../../../../../../node_modules/@angular/forms';
import { EmailService } from '../../../../../../../../shared/services/email.service';

@Component({
  selector: 'app-package-document-sender',
  templateUrl: './package-document-sender.component.html',
  styleUrls: ['./package-document-sender.component.scss']
})
export class PackageDocumentSenderComponent implements OnInit {
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
  public data: DocumentItem[] = [];
  searchTerm$ = new BehaviorSubject<string>('');
  currentPackageId;
  filterModel = new FilterNeedTransferDoc();
  isNgOnInit: boolean;
  needTransferDocsList: NeedTranferDocList[];
  departments: DepartmentsFormBranches[];
  // numberDateHSMT: number;
  // numberDateHSDT: number;
  docHSMTList = [];
  docHSDTList = [];
  formHSMTTranferDoc: FormGroup;
  formHSDTTranferDoc: FormGroup;
  defaulttransferNameHSMT = null;
  defaultdateUseHSMT = 0;
  defaulttransferNameHSDT = null;
  defaultdateUseHSDT = 0;
  listData: any = [
    { id: 1, rom: 'Maketing', username: 'Oliver Dinh', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 2, rom: 'Maketing', username: 'Van Dinh', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 3, rom: 'Maketing-slide', username: 'Huy Nhat', nameDocument: 'Maketing online', status: 'Yêu cầu gửi lại' },
    { id: 4, rom: 'Sale', username: 'Phuong VD', nameDocument: 'Maketing online', status: 'Chưa nhận' },
    { id: 5, rom: 'Maketing', username: 'Nghia Nguyen', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 6, rom: 'Maketing-slide', username: 'Dao Nhan', nameDocument: 'Maketing online', status: 'Yêu cầu gửi lại' }
  ];
  // public data :DocumentItem [] = this.packageSuccessService.getdataGetDocument();
  get tranferDocHSMTormControls() {
    return this.formHSMTTranferDoc.get('docs') as FormArray;
  }
  get tranferDocHSDTormControls() {
    return this.formHSMTTranferDoc.get('docs') as FormArray;
  }
  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private sessionService: SessionService,
    private router: Router,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private detailResultPackageService: DetailResultPackageService,
    private spinner: NgxSpinnerService,
    private dataService: DataService,
    private fb: FormBuilder,
    private emailService: EmailService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = false;
    this.isDataHsdt = false;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer = false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa chuyển giao tài liệu';
    this.dataService.getListDepartmentsFromBranches().subscribe( response => {
      this.departments = response;
    });
    // if (this.userGetDocument) {
    //   this.data = this.packageSuccessService.getdataDocuments();
    //   this.total = this.data.length;
    // } else {
    //   this.data = this.packageSuccessService.getdataGetDocument();
    // }
    this.filterModel.documentType = '';
    this.filterModel.documentTypeId = null;
    this.filterModel.interviewTimes = null;
    // this.searchTerm$.debounceTime(600)
    //   .distinctUntilChanged()
    //   .subscribe(keySearch => {
    //     this.filter(false);
    //   });
    this.detailResultPackageService.getListNeedTransferDocs(this.currentPackageId).subscribe(response => {
      response.forEach(item => {
        switch (item.bidOpportunityStage.key) {
          case 'HSMT': {
            this.docHSMTList = item.needTransferDocument;
            break;
          }
          case 'HSDT': {
            this.docHSDTList = item.needTransferDocument;
            break;
          }
        }
      });
      this.createFormHSMTTranferDoc();
      this.createFormHSDTTranferDoc();
    });
  }
  createFormHSMTTranferDoc() {
    this.formHSMTTranferDoc = this.fb.group({
      docs: this.fb.array([])
    });
    this.docHSMTList.forEach(item => {
      (this.formHSMTTranferDoc.get('docs') as FormArray).push(this.addFormHSMTTranferDoc());
    });
  }
  addFormHSMTTranferDoc(): FormGroup {
    return this.fb.group({
      transferName: null,
      dateUse: 0,
      checkbox: false,
    });
  }
  createFormHSDTTranferDoc() {
    this.formHSDTTranferDoc = this.fb.group({
      docs: this.fb.array([])
    });
    this.docHSDTList.forEach(item => {
      (this.formHSDTTranferDoc.get('docs') as FormArray).push(this.addFormHSDTTranferDoc());
    });
  }
  addFormHSDTTranferDoc(): FormGroup {
    return this.fb.group({
      transferName: null,
      dateUse: '',
      checkbox: false
    });
  }
  onSelectAll(value: boolean) {
    this.data.forEach(x => (x['checkboxSelected'] = value));

  }
  onSelectDocument(value: boolean) {
    this.listData.forEach(x => (x['selectedDocument'] = value));
  }
  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;

  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
  transferofdocuments() {
    this.isManageTransfer = true;
    this.btnManageTransfer = false;
    this.textmovedata = this.isManageTransfer ? 'Đã chuyển giao tài liệu' : 'Chưa chuyển giao tài liệu';
    this.confirmationService.confirm(
      'Bạn có muốn chuyên giao tài liệu?',
      () => {
        this.alertService.success('Chuyển giao tài liệu thành công!');
      }
    );
  }


  manageTransferDocument(template: TemplateRef<any>) {
    this.detailResultPackageService.manageTransferDocs(this.currentPackageId).subscribe(response =>
      (console.log('resonsepseMageTranfer', response)));
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }
  // filter(displayAlert: boolean) {
  //   this.spinner.show();
  //   this.detailResultPackageService
  //     .getListNeedTransferDocs(
  //       this.currentPackageId,
  //   )
  //     .subscribe(result => {
  //       this.render(result);
  //       if (displayAlert && this.isNgOnInit) {
  //         this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  //       }
  //       this.spinner.hide();
  //       this.isNgOnInit = true;
  //     }, err => this.spinner.hide());
  // }
  render(needTransferDocsList: any) {
    this.needTransferDocsList = needTransferDocsList;
    this.dtTrigger.next();
  }
  // refesh() {
  //   this.filter(true);
  // }
  downloadTemplate() {
    this.detailResultPackageService.downloadTemplateDoc().subscribe(response => {
    },
      err => {
        this.alertService.error('Tải template tài liệu cần chuyển giao không thành công!');
      });
  }
}
