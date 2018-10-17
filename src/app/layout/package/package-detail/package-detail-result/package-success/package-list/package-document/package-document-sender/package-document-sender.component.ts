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
import { groupBy } from '../../../../../../../../../../node_modules/@progress/kendo-data-query';

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
  defaultdateUseHSMT = '';
  defaulttransferNameHSDT = null;
  defaultdateUseHSDT = '';
  sum = 0;
  listData: any = [
    { id: 1, rom: 'Maketing', username: 'Oliver Dinh', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 2, rom: 'Maketing', username: 'Van Dinh', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 3, rom: 'Maketing-slide', username: 'Huy Nhat', nameDocument: 'Maketing online', status: 'Yêu cầu gửi lại' },
    { id: 4, rom: 'Sale', username: 'Phuong VD', nameDocument: 'Maketing online', status: 'Chưa nhận' },
    { id: 5, rom: 'Maketing', username: 'Nghia Nguyen', nameDocument: 'Maketing online', status: 'Đã nhận' },
    { id: 6, rom: 'Maketing-slide', username: 'Dao Nhan', nameDocument: 'Maketing online', status: 'Yêu cầu gửi lại' }
  ];
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
    this.dataService.getListDepartmentsFromBranches().subscribe(response => {
      this.departments = response;
    });
    this.filterModel.documentType = '';
    this.filterModel.documentTypeId = null;
    this.filterModel.interviewTimes = null;
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
      this.docHSMTList.forEach((itemPra, indexPra) => {
        if (itemPra.childDocuments && itemPra.childDocuments.length !== 0) {
          itemPra.childDocuments.forEach((item, index) =>
            itemPra.childDocuments[index].documentType = JSON.stringify(item.documentType));
          this.docHSMTList[indexPra].childDocuments = groupBy(itemPra.childDocuments,
            [{ field: 'documentType' }]);
          this.docHSMTList[indexPra].childDocuments.forEach((item, indexChirl) => {
            this.docHSMTList[indexPra].childDocuments[indexChirl].value = JSON.parse(item.value);
          });
        }
      });
      console.log('this.docHSMTList', this.docHSMTList);
      // this.createFormHSMTTranferDoc();
      // this.createFormHSDTTranferDoc();
    });
  }
  // Form HSMT
  createFormHSMTTranferDoc() {
    this.formHSMTTranferDoc = this.fb.group({
      docs: this.fb.array([])
    });
    this.docHSMTList.forEach((item, indexPar) => {
      (this.formHSMTTranferDoc.get('docs') as FormArray).push(this.addFormHSMTTranferDoc(item, indexPar));
      if (item.childDocuments && item.childDocuments.length > 0) {
        this.createFormChildDocHSMT(item.childDocuments, indexPar);
      }
    });
  }
  addFormHSMTTranferDoc(dataForm, indexPar): FormGroup {
    if (dataForm.childDocuments && dataForm.childDocuments.length !== 0) {
      return this.fb.group({
        checkbox: false,
        documentTypePar: dataForm.documentType.value,
        documentTypeChild: dataForm.childDocuments[0].value.value,
        documentName: dataForm.childDocuments[0].items[0].documents[0].name,
        transferName: null,
        dateUse: '',
        interviewTimes: dataForm.childDocuments[0].items[0].documents[0].interviewTime,
        docsChild: this.fb.array([]),
      });
    } else {
      return this.fb.group({
        checkbox: false,
        documentTypePar: dataForm.documentType.value,
        documentTypeChild: '',
        documentName: dataForm.documents[0].name,
        transferName: null,
        dateUse: '',
        interviewTimes: dataForm.documents[0].interviewTime,
        docsChild: this.fb.array([])
      });
    }
  }
  createFormChildDocHSMT(childDocuments, indexPar) {
    const docFA = this.formHSMTTranferDoc.get('docs') as FormArray;
    childDocuments.forEach((item, indexChild) => {
      (docFA.controls[indexPar].get('docsChild') as FormArray)
        .push(this.addFormChildDocHSMT(item));
      if (item.items && item.items.length > 1) {
        this.createFormChildChildFormHSMT(item.items, indexPar, indexChild);
      }
    });
  }
  addFormChildDocHSMT(dataFormChild): FormGroup {
    return this.fb.group({
      checkbox: false,
      documentTypePar: '',
      documentTypeChild: dataFormChild.value.value,
      documentName: dataFormChild.items[0].documents[0].name,
      transferName: null,
      dateUse: '',
      interviewTimes: dataFormChild.items[0].documents[0].interviewTimes,
      docsChildChild: this.fb.array([]),
    });
  }
  createFormChildChildFormHSMT(ChildChild, indexPar, indexChild) {
    const docFA = (this.formHSMTTranferDoc.get('docs') as FormArray).controls[indexPar].get('docsChild') as FormArray;
    const docFA2 = docFA.controls[indexChild].get('docsChildChild') as FormArray;
    ChildChild.forEach((itemChild, index) => {
      docFA2.push(this.addFormChildChildDocHSMT(itemChild));
    });
  }
  addFormChildChildDocHSMT(ChildChild): FormGroup {
    return this.fb.group({
      checkbox: false,
      documentTypePar: '',
      documentTypeChild: '',
      documentName: ChildChild.documents[0].name,
      transferName: null,
      dateUse: '',
      interviewTimes: ChildChild.documents[0].interviewTime,
    });
  }
  // Form HSDT
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
    this.docHSMTList.forEach(itemHSMT => {
      if (itemHSMT.childDocuments) {
        itemHSMT.childDocuments.forEach(itemChild => {
          itemChild.items.forEach(itemChildChild => {
            itemChildChild.documents[0].checkboxSelected = value;
          });
        });
      } else {
        itemHSMT.documents[0].checkboxSelected = value;
      }
    });
    this.docHSDTList.forEach(itemHSDT => {
      itemHSDT.documents.forEach(itemDocument => {
        itemDocument.checkboxSelected = value;
      });
    });
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
    // Chọn các tài liệu checkbox = true
    const itemDocChooseTranfer = [];
    this.docHSMTList.forEach(itemHSMT => {
      if (itemHSMT.childDocuments) {
        itemHSMT.childDocuments.forEach(itemChild => {
          itemChild.items.forEach(itemChildChild => {
            if (itemChildChild.documents[0].checkboxSelected === true) {
              itemDocChooseTranfer.push(itemChildChild.documents[0]);
            }
          });
        });
      } else {
        if (itemHSMT.documents[0].checkboxSelected === true) {
          itemDocChooseTranfer.push(itemHSMT.documents[0]);
        }
      }
    });
    this.docHSDTList.forEach(itemHSDT => {
      itemHSDT.documents.forEach(itemDocument => {
        if (itemDocument.checkboxSelected === true) {
          itemDocChooseTranfer.push(itemDocument);
        }
      });
    });
    console.log('this.itemDocument',  itemDocChooseTranfer);
    this.detailResultPackageService.tranferDocs(this.currentPackageId, itemDocChooseTranfer);
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
  renderIndex(i, j, k) {
    let dem = 0;
    for (let indexPar = 0; indexPar < i + 1; indexPar++) {
      if (this.docHSMTList[indexPar].childDocuments) {
        if (indexPar < i) {
          for (let indexChild = 0; indexChild < this.docHSMTList[indexPar].childDocuments.length; indexChild++) {
            dem = dem + this.docHSMTList[indexPar].childDocuments[indexChild].items.length;
          }
        } else {
          for (let indexChild = 0; indexChild < j + 1; indexChild++) {
            if (indexChild < j) {
              dem = dem + this.docHSMTList[indexPar].childDocuments[indexChild].items.length;
            } else {
              for (let indexChildChild = 0; indexChildChild < k + 1; indexChildChild++) {
                dem++;
              }
            }
          }
        }
      } else {
        dem++;
      }
    }
    return dem;
  }
}
