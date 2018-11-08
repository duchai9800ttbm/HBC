import { Component, OnInit, TemplateRef, Input, ViewChild, ElementRef } from '@angular/core';
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
import { DocumentService } from '../../../../../../../../shared/services/document.service';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { HadTransferList } from '../../../../../../../../shared/models/result-attend/had-transfer-list.model';
import { ManageNeedTranferList } from '../../../../../../../../shared/models/result-attend/manage-need-transfer-list.model';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { CheckStatusPackage } from '../../../../../../../../shared/constants/check-status-package';
import { DocumentTypeAll } from '../../../../../../../../shared/models/package/document-type-all';
import { NeedTransferDocFilter } from '../../../../../../../../shared/models/result-attend/need-transfer-doc-filter.model';
import { DocmentParent } from '../../../../../../../../shared/models/result-attend/docment-parent.model';
import { InterviewInvitationService } from '../../../../../../../../shared/services/interview-invitation.service';
import { DialogService } from '../../../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../../../shared/components/form-in/form-in.component';

@Component({
  selector: 'app-package-document-sender',
  templateUrl: './package-document-sender.component.html',
  styleUrls: ['./package-document-sender.component.scss'],
  providers: [HoSoDuThauService, InterviewInvitationService]
})
export class PackageDocumentSenderComponent implements OnInit {
  @Input() statusPackage;
  @ViewChild('nameit') private elementRef: ElementRef;
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
  filterModelHad = new NeedTransferDocFilter();
  isNgOnInit: boolean;
  needTransferDocsList: NeedTranferDocList[];
  departments: DepartmentsFormBranches[];
  // Chưa chuyển giao tài liệu
  docHSMTList = [];
  docHSDTList = [];
  formHSMTTranferDoc: FormGroup;
  formHSDTTranferDoc: FormGroup;
  defaulttransferNameHSMT = null;
  defaultdateUseHSMT = '';
  defaulttransferNameHSDT = null;
  defaultdateUseHSDT = '';
  sum = 0;
  // Đã chuyển giao tài liệu
  hadTransferList: HadTransferList[];
  docHSMTHadTransfer;
  docHSDTHadTransfer;
  manageNeedTranferList = [];
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
  checkStatusPackage = CheckStatusPackage;
  isShowEdit = false;
  currentEdit = 0;
  documentTypeAll: DocmentParent[];
  documentTypeAllControl = [];
  transferDepartmentList = [];
  useDaysList = [];
  interviewTimesList = [];
  searchTerm = '';
  dialogPrintLiveForm;
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
    private emailService: EmailService,
    private documentService: DocumentService,
    private hoSoDuThauService: HoSoDuThauService,
    private packageService: PackageService,
    private interviewInvitationService: InterviewInvitationService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = true;
    this.isDataHsdt = true;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer = false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa chuyển giao tài liệu';
    this.dataService.getListDepartmentsFromBranches().subscribe(response => {
      this.departments = response;
    });

    this.filterModel.documentType = null;
    this.filterModel.documentTypeId = null;
    this.filterModel.interviewTimes = null;
    // Đã chuyển giao
    this.filterModelHad.documentType = null;
    this.filterModelHad.departmentId = null;
    this.filterModelHad.interviewTimes = null;
    this.filterModelHad.useDate = null;
    this.getListNeedTransferDocs(false);
    this.searchTerm$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(value => {
        this.searchTerm = '';
        this.getHadTransferredList(false);
      });
    this.getTypeDocListFilter();
  }

  // getTypeDocListFilter() {
  //   this.detailResultPackageService.documentTypeHsdtAndHsmt().subscribe(response => {
  //     this.documentTypeAll = response;
  //     (this.documentTypeAll || []).forEach(item => {
  //       item.detail.forEach(itemChild => {
  //         itemChild['bidOpportunityStage'] = item.bidOpportunityStage.id;
  //       });
  //     });
  //     (this.documentTypeAll || []).forEach(item => {
  //       this.documentTypeAllControl = this.documentTypeAllControl.concat(item.detail);
  //     });
  //   });
  // }

  getTypeDocListFilter() {
    this.detailResultPackageService.getDocumentParentList().subscribe(response => {
      this.documentTypeAll = response;
      (this.documentTypeAll || []).forEach(item => {
        (item.detail || []).forEach(itemChild => {
          itemChild['bidOpportunityStage'] = item.bidOpportunityStage.id;
        });
      });
      (this.documentTypeAll || []).forEach(item => {
        this.documentTypeAllControl = this.documentTypeAllControl.concat(item.detail);
      });
    });
  }

  getListFilter() {
    // this.transferDepartmentList = [];
    // this.useDaysList = [];
    // this.interviewTimesList = [];
    const filterNew = new NeedTransferDocFilter();
    this.detailResultPackageService.getHadTransferredList(this.currentPackageId, '', filterNew).subscribe(response => {
      response.forEach(item => {
        item.transferDocument.forEach(itemPra => {
          if (itemPra.childDocuments && itemPra.childDocuments.length !== 0) {
            (itemPra.childDocuments || []).forEach(itemChild => {
              (itemChild.documents || []).forEach(itemChildDoc => {
                (itemChildDoc.departments || []).forEach((itemDepartment) => {
                  this.transferDepartmentList.push(itemDepartment);
                });
                this.useDaysList.push(itemChildDoc.useDays);
                this.interviewTimesList.push(itemChildDoc.interviewTime);
              });
            });
          } else if (itemPra.documents && itemPra.documents.length !== 0) {
            (itemPra.documents || []).forEach(itemDoc => {
              (itemDoc.departments || []).forEach((itemDepartment) => {
                this.transferDepartmentList.push(itemDepartment);
              });
              this.useDaysList.push(itemDoc.useDays);
              this.interviewTimesList.push(itemDoc.interviewTime);
            });
          }
        });
      });
      if (this.transferDepartmentList) {
        this.transferDepartmentList = groupBy(this.transferDepartmentList, [{ field: 'key' }]);
        const transferDepartmentListTemp = [];
        this.transferDepartmentList.forEach(item => {
          transferDepartmentListTemp.push(item.items[0]);
        });
        this.transferDepartmentList = transferDepartmentListTemp;
      }
      this.transferDepartmentList = this.transferDepartmentList.sort((a, b) => a - b);
      this.transferDepartmentList = this.transferDepartmentList.filter((el, i, a) => i === a.indexOf(el));
      this.useDaysList = this.useDaysList.sort((a, b) => a - b);
      this.useDaysList = this.useDaysList.filter((el, i, a) => i === a.indexOf(el));
      this.interviewTimesList = this.interviewTimesList.sort((a, b) => a - b);
      this.interviewTimesList = this.interviewTimesList.filter((el, i, a) => i === a.indexOf(el));
    });
  }

  getListNeedTransferDocs(alert: boolean) {
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
      if (this.docHSMTList) {
        (this.docHSMTList || []).forEach(itemchildDocuments => {
          if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
            (itemchildDocuments.childDocuments || []).forEach(itemChild => {
              (itemChild.items || []).forEach(items => {
                if (items.documents[0].dateUse) {
                  items.documents[0].dateUse = items.documents[0].dateUse.toString() + ' ngày';
                }
              });
            });
          } else if (!itemchildDocuments.childDocuments || (itemchildDocuments.childDocuments.length === 0)) {
            (itemchildDocuments.documents || []).forEach(documents => {
              if (documents.dateUse) {
                documents.dateUse = documents.dateUse.toString() + ' ngày';
              }
            });
          }
        });
      }

      this.docHSDTList.forEach((itemPra, indexPra) => {
        if (itemPra.childDocuments && itemPra.childDocuments.length !== 0) {
          itemPra.childDocuments.forEach((item, index) => itemPra.childDocuments[index].documentType = JSON.stringify(item.documentType));
          this.docHSDTList[indexPra].childDocuments = groupBy(itemPra.childDocuments,
            [{ field: 'documentType' }]);
          this.docHSDTList[indexPra].childDocuments.forEach((item, indexChirl) => {
            this.docHSDTList[indexPra].childDocuments[indexChirl].value = JSON.parse(item.value);
          });
        }
      });
      if (this.docHSDTList) {
        (this.docHSDTList || []).forEach(itemchildDocuments => {
          if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
            (itemchildDocuments.childDocuments || []).forEach(itemChild => {
              (itemChild.items || []).forEach(items => {
                if (items.documents[0].dateUse) {
                  items.documents[0].dateUse = items.documents[0].dateUse.toString() + ' ngày';
                }
              });
            });
          } else if (!itemchildDocuments.childDocuments || (itemchildDocuments.childDocuments.length === 0)) {
            (itemchildDocuments.documents || []).forEach(documents => {
              if (documents.dateUse) {
                documents.dateUse = documents.dateUse.toString() + ' ngày';
              }
            });
          }
        });
      }
      if (alert) {
        this.alertService.success('Dữ liệu được cập nhật mới nhât!');
      }
    }, err => {
      this.alertService.error('Đã xảy ra lỗi!');
    });
  }
  getHadTransferredList(alert: boolean) {
    this.getListFilter();
    // tslint:disable-next-line:max-line-length
    this.detailResultPackageService.getHadTransferredList(this.currentPackageId, this.searchTerm, this.filterModelHad).subscribe(response => {
      this.hadTransferList = response;
      response.forEach(item => {
        switch (item.bidOpportunityStage.key) {
          case 'HSMT': {
            this.docHSMTHadTransfer = item.transferDocument;
            break;
          }
          case 'HSDT': {
            this.docHSDTHadTransfer = item.transferDocument;
            break;
          }
        }
      });
      (this.docHSMTHadTransfer || []).forEach((itemPra, indexPra) => {
        if (itemPra.childDocuments && itemPra.childDocuments.length !== 0) {
          (itemPra.childDocuments || []).forEach((item, index) =>
            itemPra.childDocuments[index].documentType = JSON.stringify(item.documentType));
          this.docHSMTHadTransfer[indexPra].childDocuments = groupBy(itemPra.childDocuments,
            [{ field: 'documentType' }]);
          (this.docHSMTHadTransfer[indexPra].childDocuments || []).forEach((item, indexChirl) => {
            this.docHSMTHadTransfer[indexPra].childDocuments[indexChirl].value = JSON.parse(item.value);
          });
        }
      });
      if (this.docHSMTHadTransfer) {
        (this.docHSMTHadTransfer || []).forEach(itemchildDocuments => {
          if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
            (itemchildDocuments.childDocuments || []).forEach(itemChild => {
              (itemChild.items || []).forEach(items => {
                if (items.documents[0].useDays) {
                  items.documents[0].useDays = items.documents[0].useDays.toString() + ' ngày';
                }
              });
            });
          } else if (!itemchildDocuments.childDocuments || (itemchildDocuments.childDocuments.length === 0)) {
            (itemchildDocuments.documents || []).forEach(documents => {
              if (documents.useDays) {
                documents.useDays = documents.useDays.toString() + ' ngày';
              }
            });
          }
        });
      }
      (this.docHSDTHadTransfer || []).forEach((itemPra, indexPra) => {
        if (itemPra.childDocuments && itemPra.childDocuments.length !== 0) {
          (itemPra.childDocuments || []).forEach((item, index) =>
            itemPra.childDocuments[index].documentType = JSON.stringify(item.documentType));
          this.docHSDTHadTransfer[indexPra].childDocuments = groupBy(itemPra.childDocuments,
            [{ field: 'documentType' }]);
          (this.docHSDTHadTransfer[indexPra].childDocuments || []).forEach((item, indexChirl) => {
            this.docHSDTHadTransfer[indexPra].childDocuments[indexChirl].value = JSON.parse(item.value);
          });
        }
      });
      if (this.docHSDTHadTransfer) {
        (this.docHSDTHadTransfer || []).forEach(itemchildDocuments => {
          if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
            (itemchildDocuments.childDocuments || []).forEach(itemChild => {
              (itemChild.items || []).forEach(items => {
                if (items.documents[0].useDays) {
                  items.documents[0].useDays = items.documents[0].useDays.toString() + ' ngày';
                }
              });
            });
          } else if (!itemchildDocuments.childDocuments || itemchildDocuments.childDocuments.length === 0) {
            (itemchildDocuments.documents || []).forEach(documents => {
              if (documents.useDays) {
                documents.useDays = documents.useDays.toString() + ' ngày';
              }
            });
          }
        });
      }
      if (alert) {
        this.alertService.success('Dữ liệu được cập nhật mới nhât!');
      }
    }, err => {
      this.alertService.error('Đã xảy ra lỗi!');
    });
  }
  clearFilterHad() {
    this.filterModelHad.documentType = null;
    this.filterModelHad.departmentId = null;
    this.filterModelHad.interviewTimes = null;
    this.filterModelHad.useDate = null;
    this.getHadTransferredList(false);
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
  defaulttransferNameHSMTFuc() {
    if (this.docHSMTList && this.docHSMTList.length !== 0) {
      this.docHSMTList.forEach(itemchildDocuments => {
        if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
          itemchildDocuments.childDocuments.forEach(itemChild => {
            itemChild.items.forEach(items => {
              items.documents[0].transferName = this.defaulttransferNameHSMT;
            });
          });
        }
        if (!itemchildDocuments.childDocuments || itemchildDocuments.childDocuments.length === 0) {
          itemchildDocuments.documents.forEach(documents => {
            documents.transferName = this.defaulttransferNameHSMT;
          });
        }
      });
    }
  }
  defaultdateUseHSMTFuc() {
    if (this.docHSMTList && this.docHSMTList.length !== 0) {
      this.docHSMTList.forEach(itemchildDocuments => {
        if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
          itemchildDocuments.childDocuments.forEach(itemChild => {
            itemChild.items.forEach(items => {
              if (items.documents[0].dateUse) {
                items.documents[0].dateUse = (+this.defaultdateUseHSMT).toString() + ' ngày';
              }
            });
          });
        }
        if (!itemchildDocuments.childDocuments || itemchildDocuments.childDocuments.length === 0) {
          itemchildDocuments.documents.forEach(documents => {
            if (documents.dateUse) {
              documents.dateUse = (+this.defaultdateUseHSMT).toString() + ' ngày';
            }
          });
        }
      });
    }
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
      if (itemHSMT.childDocuments && itemHSMT.childDocuments.length !== 0) {
        itemHSMT.childDocuments.forEach(itemChild => {
          itemChild.items.forEach(itemChildChild => {
            itemChildChild.documents[0].checkboxSelected = value;
          });
        });
      } else {
        if (itemHSMT.documents && itemHSMT.documents.length !== 0) {
          itemHSMT.documents.forEach(itemChild => {
            itemChild.checkboxSelected = value;
          });
        }
      }
    });
    this.docHSDTList.forEach(itemHSDT => {
      if (itemHSDT.childDocuments && itemHSDT.childDocuments.length !== 0) {
        itemHSDT.childDocuments.forEach(itemChild => {
          itemChild.items.forEach(itemChildChild => {
            itemChildChild.documents[0].checkboxSelected = value;
          });
        });
      } else {
        if (itemHSDT.documents && itemHSDT.documents.length !== 0) {
          itemHSDT.documents.forEach(itemChild => {
            itemChild.checkboxSelected = value;
          });
        }
      }
    });
  }
  defaulttransferNameHSDTFuc() {
    if (this.docHSDTList && this.docHSDTList.length !== 0) {
      (this.docHSDTList || []).forEach(itemchildDocuments => {
        if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
          (itemchildDocuments.childDocuments || []).forEach(itemChild => {
            (itemChild.items || []).forEach(items => {
              items.documents[0].transferName = this.defaulttransferNameHSDT;
            });
          });
        }
        if (!itemchildDocuments.childDocuments || itemchildDocuments.childDocuments.length === 0) {
          (itemchildDocuments.documents || []).forEach(documents => {
            documents.transferName = this.defaulttransferNameHSDT;
          });
        }
      });
    }
  }
  defaultdateUseHSDTFuc() {
    if (this.docHSDTList && this.docHSDTList.length !== 0) {
      (this.docHSDTList || []).forEach(itemchildDocuments => {
        if (itemchildDocuments.childDocuments && itemchildDocuments.childDocuments.length !== 0) {
          (itemchildDocuments.childDocuments || []).forEach(itemChild => {
            (itemChild.items || []).forEach(items => {
              if (items.documents[0].dateUse) {
                items.documents[0].dateUse = (+this.defaultdateUseHSDT).toString() + '  ngày';
              }
            });
          });
        }
        if (!itemchildDocuments.childDocuments || itemchildDocuments.childDocuments.length === 0) {
          (itemchildDocuments.documents || []).forEach(documents => {
            if (documents.dateUse) {
              documents.dateUse = (+this.defaultdateUseHSDT).toString() + ' ngày';
            }
          });
        }
      });
    }
  }

  showhsmt() {
    this.isDataHsmt = !this.isDataHsmt;
  }
  showhsdt() {
    this.isDataHsdt = !this.isDataHsdt;
  }
  transferofdocuments() {
    const itemDocChooseTranfer = [];
    this.docHSMTList.forEach(itemHSMT => {
      if (itemHSMT.childDocuments && itemHSMT.childDocuments.length !== 0) {
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
      if (itemHSDT.childDocuments && itemHSDT.childDocuments.length !== 0) {
        itemHSDT.childDocuments.forEach(itemChild => {
          itemChild.items.forEach(itemChildChild => {
            if (itemChildChild.documents[0].checkboxSelected === true) {
              itemDocChooseTranfer.push(itemChildChild.documents[0]);
            }
          });
        });
      } else {
        if (itemHSDT.documents && itemHSDT.documents.length !== 0) {
          itemHSDT.documents.forEach(itemDocument => {
            if (itemDocument.checkboxSelected === true) {
              itemDocChooseTranfer.push(itemDocument);
            }
          });
        }
      }
    });

    // (itemDocChooseTranfer || []).forEach(item => {
    //   if (item.dateUse && item.dateUse.indexOf(' ngày') !== -1) {
    //     item.dateUse = item.dateUse.replace(' ngày', '');
    //   }
    // });

    if (this.checkDepartmentAndDateUse(itemDocChooseTranfer)) {
      if (itemDocChooseTranfer && itemDocChooseTranfer.length !== 0) {
        this.confirmationService.confirm(
          'Bạn có muốn chuyển giao tài liệu?',
          () => {
            this.detailResultPackageService.tranferDocs(this.currentPackageId, itemDocChooseTranfer).subscribe(response => {
              this.packageService.changeStatusPackageValue(this.checkStatusPackage.DaChuyenGiaoTaiLieu.text);
              // this.detailResultPackageService.getHadTransferredList(this.currentPackageId).subscribe(responseHadTransferList => {
              //   this.hadTransferList = responseHadTransferList;
              // });
              this.getHadTransferredList(false);
              this.filterModelHad = new NeedTransferDocFilter();
              // this.textmovedata = this.isManageTransfer ? 'Đã chuyển giao tài liệu' : 'Chưa chuyển giao tài liệu';
              this.alertService.success('Chuyển giao tài liệu thành công!');
            },
              err => {
                this.alertService.error('Chuyển giao tài liệu không thành công!');
              });
          }
        );
      } else {
        this.alertService.error('Bạn phải chọn ít nhất một tài liệu để chuyển giao!');
      }
    } else {
      this.alertService.error('Bạn cần chọn phòng ban và số ngày sử dụng cho phòng ban đã chọn.');
    }
  }

  checkDepartmentAndDateUse(itemDocChooseTranfer) {
    return itemDocChooseTranfer.every(itemDocTranfer => {
      return (itemDocTranfer.transferName && itemDocTranfer.transferName.length !== 0
        && itemDocTranfer.dateUse && itemDocTranfer.dateUse !== '0');
    });
  }


  manageTransferDocument(template: TemplateRef<any>) {
    this.detailResultPackageService.manageTransferDocs(this.currentPackageId).subscribe(response => {
      this.manageNeedTranferList = response;
      this.manageNeedTranferList.forEach(item => {
        item['documentTypeStr'] = JSON.stringify(item.document);
      });
      this.manageNeedTranferList = groupBy(this.manageNeedTranferList, [{ field: 'documentTypeStr' }]);
      this.manageNeedTranferList.forEach(itemDocumentType => {
        itemDocumentType.items.forEach(itemDepart => {
          itemDepart['itemDepartStr'] = JSON.stringify(itemDepart.department);
        });
      });
      this.manageNeedTranferList.forEach(itemDocumentType => {
        itemDocumentType.items = groupBy(itemDocumentType.items, [{ field: 'itemDepartStr' }]);
      });
    });
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
  }
  refesh() {
    if (this.statusPackage.id === this.checkStatusPackage.DaThongBaoCacBenLienQuan.id) {
      this.getListNeedTransferDocs(true);
    } else {
      this.getHadTransferredList(true);
    }
  }
  downloadTemplate() {
    this.detailResultPackageService.downloadTemplateDoc().subscribe(response => {
    },
      err => {
        this.alertService.error('Tải template tài liệu cần chuyển giao không thành công!');
      });
  }
  renderIndexHSMTTransfer(i, j, k) {
    let dem = 0;
    for (let indexPar = 0; indexPar < i + 1; indexPar++) {
      if (this.docHSMTList[indexPar].childDocuments && this.docHSMTList[indexPar].childDocuments.length !== 0) {
        if (indexPar < i) {
          for (let indexChild = 0; indexChild < this.docHSMTList[indexPar].childDocuments.length; indexChild++) {
            dem = dem + (this.docHSMTList[indexPar].childDocuments[indexChild].items || []).length;
          }
        } else {
          for (let indexChild = 0; indexChild < j + 1; indexChild++) {
            if (indexChild < j) {
              dem = dem + (this.docHSMTList[indexPar].childDocuments[indexChild].items || []).length;
            } else {
              for (let indexChildChild = 0; indexChildChild < k + 1; indexChildChild++) {
                dem++;
              }
            }
          }
        }
      } else {
        if (indexPar < i) {
          dem = dem + this.docHSMTList[indexPar].documents.length;
        } else {
          dem = dem + j + 1;
        }
      }
    }
    return dem;
  }
  renderIndexHSDTTransfer(i, j, k) {
    let dem = 0;
    if (this.docHSDTList && this.docHSDTList.length !== 0) {
      for (let indexPar = 0; indexPar < i + 1; indexPar++) {
        if (this.docHSDTList[indexPar].childDocuments && this.docHSDTList[indexPar].childDocuments.length !== 0) {
          if (indexPar < i) {
            for (let indexChild = 0; indexChild < this.docHSDTList[indexPar].childDocuments.length; indexChild++) {
              dem = dem + (this.docHSDTList[indexPar].childDocuments[indexChild].items || []).length;
            }
          } else {
            for (let indexChild = 0; indexChild < j + 1; indexChild++) {
              if (indexChild < j) {
                dem = dem + (this.docHSDTList[indexPar].childDocuments[indexChild].items || []).length;
              } else {
                for (let indexChildChild = 0; indexChildChild < k + 1; indexChildChild++) {
                  dem++;
                }
              }
            }
          }
        } else {
          if (indexPar < i) {
            dem = dem + (this.docHSDTList[indexPar].documents || []).length;
          } else {
            dem = dem + j + 1;
          }
        }
      }
    }
    return dem;
  }
  downloadFileItemHSMT(bidDocumentId) {
    this.documentService.download(bidDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải tài liệu không thành công!');
      });
  }
  downloadFileItemHSDT(bidDocumentId) {
    this.hoSoDuThauService.taiHoSoDuThau(bidDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải tài liệu không thành công!');
      });
  }
  renderIndexHSMTHadTransfer(i, j, k) {
    let dem = 0;
    if (this.docHSMTHadTransfer && this.docHSMTHadTransfer.length !== 0) {
      for (let indexPar = 0; indexPar < i + 1; indexPar++) {
        if (this.docHSMTHadTransfer[indexPar].childDocuments && this.docHSMTHadTransfer[indexPar].childDocuments.length !== 0) {
          if (indexPar < i) {
            for (let indexChild = 0; indexChild < this.docHSMTHadTransfer[indexPar].childDocuments.length; indexChild++) {
              dem = dem + (this.docHSMTHadTransfer[indexPar].childDocuments[indexChild].items || []).length;
            }
          } else {
            for (let indexChild = 0; indexChild < j + 1; indexChild++) {
              if (indexChild < j) {
                dem = dem + (this.docHSMTHadTransfer[indexPar].childDocuments[indexChild].items || []).length;
              } else {
                for (let indexChildChild = 0; indexChildChild < k + 1; indexChildChild++) {
                  dem++;
                }
              }
            }
          }
        } else {
          if (indexPar < i) {
            dem = dem + this.docHSMTHadTransfer[indexPar].documents.length;
          } else {
            dem = dem + j + 1;
          }
        }
      }
    }
    return dem;
  }
  renderIndexHSDTHadTransfer(i, j, k) {
    let dem = 0;
    for (let indexPar = 0; indexPar < i + 1; indexPar++) {
      if (this.docHSDTHadTransfer[indexPar].childDocuments && this.docHSDTHadTransfer[indexPar].childDocuments.length !== 0) {
        if (indexPar < i) {
          for (let indexChild = 0; indexChild < this.docHSDTHadTransfer[indexPar].childDocuments.length; indexChild++) {
            dem = dem + (this.docHSDTHadTransfer[indexPar].childDocuments[indexChild].items || []).length;
          }
        } else {
          for (let indexChild = 0; indexChild < j + 1; indexChild++) {
            if (indexChild < j) {
              dem = dem + (this.docHSDTHadTransfer[indexPar].childDocuments[indexChild].items || []).length;
            } else {
              for (let indexChildChild = 0; indexChildChild < k + 1; indexChildChild++) {
                dem++;
              }
            }
          }
        }
      } else {
        if (indexPar < i) {
          dem = dem + (this.docHSDTHadTransfer[indexPar].documents || []).length;
        } else {
          dem = dem + j + 1;
        }
      }
    }
    return dem;
  }
  // Tài liệu đã chuyển giao
  onSelectAllHadTransfer(value: boolean) {
    if (this.docHSMTHadTransfer && this.docHSMTHadTransfer.length !== 0) {
      this.docHSMTHadTransfer.forEach(itemHSMT => {
        if (itemHSMT.childDocuments && itemHSMT.childDocuments.length !== 0) {
          itemHSMT.childDocuments.forEach(itemChild => {
            itemChild.items.forEach(itemChildChild => {
              itemChildChild.documents[0].checkboxSelected = value;
            });
          });
        } else {
          itemHSMT.documents[0].checkboxSelected = value;
        }
      });
    }
    if (this.docHSDTHadTransfer && this.docHSDTHadTransfer.length !== 0) {
      this.docHSDTHadTransfer.forEach(itemHSDT => {
        if (itemHSDT.childDocuments && itemHSDT.childDocuments.length !== 0) {
          itemHSDT.childDocuments.forEach(itemChild => {
            itemChild.items.forEach(itemChildChild => {
              itemChildChild.documents[0].checkboxSelected = value;
            });
          });
        } else {
          itemHSDT.documents.forEach(itemChild => {
            itemChild.checkboxSelected = value;
          });
        }
      });
    }
  }
  // Quản lý tài liệu
  onSelectDocumentManage(value: boolean) {
    this.manageNeedTranferList.forEach(tranferListByDocumentTypes => {
      tranferListByDocumentTypes.items.forEach(itemsTranferListByDocumentType => {
        itemsTranferListByDocumentType.items.forEach(itemsTranferListByDepart => {
          itemsTranferListByDepart.selectedDocument = value;
        });
      });
    });
  }
  renderIndexManage(i, j, k) {
    let dem = 0;
    for (let indexPar = 0; indexPar < this.manageNeedTranferList.length; indexPar++) {
      if (indexPar < i) {
        for (let indexChild = 0; indexChild < this.manageNeedTranferList[indexPar].items.length; indexChild++) {
          dem = dem + (this.manageNeedTranferList[indexPar].items[indexChild].items || []).length;
        }
      }
      if (indexPar === i) {
        for (let indexChild = 0; indexChild < this.manageNeedTranferList[indexPar].items.length; indexChild++) {
          if (indexChild < j) {
            dem = dem + (this.manageNeedTranferList[indexPar].items[indexChild].items || []).length;
          }
          if (indexChild === j) {
            return dem = dem + k + 1;
          }
        }
      }
    }
  }
  requestToreSubmitDoc(bidTransferDocDetailId: number) {
    this.detailResultPackageService.resubmitDoc(bidTransferDocDetailId).subscribe(response => {
      this.alertService.success('Yêu cầu gửi lại tài liệu thành công!');
    },
      err => {
        this.alertService.error('Yêu cầu gửi lại tài liệu không thành công!');
      });
  }
  // Router live form
  viewDetailLiveForm(typeLiveForm) {
    this.interviewInvitationService.changeNoDirection(true);
    switch (typeLiveForm) {
      case 'TenderConditionalSummary': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/build/summary`], { queryParams: { direction: false } });
        break;
      }
      case 'SiteSurveyingReport': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/build/liveformsite`], { queryParams: { direction: false } });
        break;
      }
      case 'TenderPriceApproval': {
        this.router.navigate([`/package/detail/${this.currentPackageId}/attend/price-review/detail`], { queryParams: { direction: false } });
        break;
      }
    }
  }
  formatToNumber(item) {
    this.detailResultPackageService.updateUsedays(item.transferDocId, item.useDays).subscribe(response => {
      this.alertService.success('Thay đổi ngày sử dụng tài liệu đã chuyển giao thành công!');
    }, err => {
      this.alertService.error('Thay đổi ngày sử dụng tài liệu đã chuyển giao không thành công!');
    });
    this.currentEdit = 0;
  }
  showEdit(e, i, j, k) {
    const table = e as HTMLElement;
    const index = this.renderIndexHSMTHadTransfer(i, j, k) * 2;
    this.currentEdit = index;
    const item = table.getElementsByTagName('input');
    item[index].disabled = false;
    item[index].focus();
  }

  showEditSHDT(e, i, j, k) {
    let dem = 0;
    if (this.docHSMTHadTransfer && this.docHSMTHadTransfer.length !== 0) {
      for (let indexPar = 0; indexPar < this.docHSMTHadTransfer.length; indexPar++) {
        if (this.docHSMTHadTransfer[indexPar].childDocuments) {
          for (let indexChild = 0; indexChild < this.docHSMTHadTransfer[indexPar].childDocuments.length; indexChild++) {
            dem = dem + this.docHSMTHadTransfer[indexPar].childDocuments[indexChild].items.length;
          }
        } else {
          dem = dem + this.docHSMTHadTransfer[indexPar].documents.length;
        }
      }
    }
    const table = e as HTMLElement;
    const index = (dem + this.renderIndexHSDTHadTransfer(i, j, k)) * 2;
    const item = table.getElementsByTagName('input');
    item[index].focus();
  }

  // In liveform
  inLiveForm(typeLiveForm) {
    switch (typeLiveForm) {
      case 'TenderPriceApproval': {
        this.dialogPrintLiveForm = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialogPrintLiveForm.content.instance;
        instance.type = 'LiveFormTrinhDuyetGia';
        instance.packageId = this.currentPackageId;
        break;
      }
      case 'SiteSurveyingReport': {
        this.dialogPrintLiveForm = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialogPrintLiveForm.content.instance;
        instance.type = 'LiveFormThamQuanBaoCaoCongTruong';
        instance.packageId = this.currentPackageId;
        break;
      }
      case 'TenderConditionalSummary': {
        this.dialogPrintLiveForm = this.dialogService.open({
          title: 'FORM IN',
          content: FormInComponent,
          width: window.screen.availWidth * 0.8,
          minWidth: 250,
          height: window.screen.availHeight * 0.7
        });
        const instance = this.dialogPrintLiveForm.content.instance;
        instance.type = 'LiveFormTomTatDieuKienDuThau';
        instance.packageId = this.currentPackageId;
        break;
      }
      default: break;
    }
  }
}
