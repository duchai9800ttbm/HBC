import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../../shared/configs/datepicker.config';
import { DATATABLE_CONFIG } from '../../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../../node_modules/rxjs';
import { DocumentItem } from '../../../../../../../../shared/models/document-item';
import { PackageSuccessService } from '../../../../../../../../shared/services/package-success.service';
import { SessionService, DataService } from '../../../../../../../../shared/services/index';
import { PackageService } from '../../../../../../../../shared/services/package.service';
import { ConfirmationService, AlertService } from '../../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { DetailResultPackageService } from '../../../../../../../../shared/services/detail-result-package.service';
import { DepartmentsFormBranches } from '../../../../../../../../shared/models/user/departments-from-branches';
import { HadTransferList } from '../../../../../../../../shared/models/result-attend/had-transfer-list.model';
import { FilterTransferredDoc } from '../../../../../../../../shared/models/result-attend/filter-transferred-doc.model';
import { TransferredDoc } from '../../../../../../../../shared/models/result-attend/transferred-doc.model';
import { groupBy } from '../../../../../../../../../../node_modules/@progress/kendo-data-query';

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
  currentPackageId: number;
  filter = new FilterTransferredDoc();
  transferredDocList: TransferredDoc[];
  searchTerm$ = new BehaviorSubject<string>('');
  docTypeListFilter;
  statusListFilter;
  docHSMTListTranferred;
  docHSDTListTranferred;
  public data: DocumentItem[] = this.packageSuccessService.getdataGetDocument();
  @Input() statusPackage;
  documentTypeList;
  statusList;
  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private sessionService: SessionService,
    private packageService: PackageService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private detailResultPackageService: DetailResultPackageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.filter.documentType = '';
    this.filter.documentTypeId = null;
    this.filter.status = '';
    this.userInfo = this.sessionService.userInfo;
    this.isDataHsmt = true;
    this.isDataHsdt = true;
    this.isManageTransfer = false;
    this.userGetDocument = true;
    this.btnManageTransfer = false;
    this.total = this.data.length;
    this.textmovedata = 'Chưa nhận tài liệu được chuyển giao';
    this.total = this.data.length;
    this.bntConfirm = false;
    this.searchTerm$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterFuc(false);
      });
  }
  onSelectAll(value: boolean) {
    this.data.forEach(x => (x['checkboxSelected'] = value));
    this.docHSMTListTranferred.forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        itemChild.checkboxSelected = value;
      });
    });
    this.docHSDTListTranferred.forEach(itemPar => {
      itemPar.items.forEach(itemChild => {
        itemChild.checkboxSelected = value;
      });
    });
  }
  refesh() {
    this.filterFuc(true);
  }

  filterList() {
    const newfilter = new FilterTransferredDoc();
    this.detailResultPackageService.filterTransferDocDetailsList(
      this.currentPackageId,
      '',
      newfilter
    ).subscribe(response => {
      this.transferredDocList = response;
      response.forEach(item => {
        this.documentTypeList = item.bidTransferDocDetails.map(itembidTransfer => itembidTransfer.documentType);
        this.documentTypeList = this.documentTypeList.sort((a, b) => a - b);
        this.documentTypeList = this.documentTypeList.filter((el, i, a) => i === a.indexOf(el));
      });
      console.log(this.documentTypeList);
    },
      err => {
      });
  }

  filterFuc(alertShow: boolean) {
    this.detailResultPackageService.filterTransferDocDetailsList(
      this.currentPackageId,
      this.searchTerm$.value,
      this.filter
    ).subscribe(response => {
      this.transferredDocList = response;
      response.forEach(item => {
        switch (item.bidDocumentState.key) {
          case 'HSMT': {
            this.docHSMTListTranferred = item.bidTransferDocDetails;
            break;
          }
          case 'HSDT': {
            this.docHSDTListTranferred = item.bidTransferDocDetails;
            break;
          }
        }
      });

      console.log('filterFuc', this.docHSMTListTranferred, this.docHSDTListTranferred);
      // Hồ sơ mời thầu
      this.docHSMTListTranferred.forEach((itemPra, indexPra) => {
        itemPra['documentTypeStr'] = JSON.stringify(itemPra.documentType);
      });
      this.docHSMTListTranferred = groupBy(this.docHSMTListTranferred, [{ field: 'documentTypeStr' }]);

      // Hồ sơ dự thầu
      this.docHSDTListTranferred.forEach((itemPra, indexPra) => {
        itemPra['documentTypeStr'] = JSON.stringify(itemPra.documentType);
      });
      this.docHSDTListTranferred = groupBy(this.docHSDTListTranferred, [{ field: 'documentTypeStr' }]);
      console.log('this.transferredDocList-3', this.docHSMTListTranferred, this.docHSDTListTranferred);
      if (alertShow) {
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }
    },
      err => {
      });
  }
  getDocTypeList() {
    // this.docTypeListFilter = this.transferredDocList.transferredDocList.map
    // docTypeListFilter;
    // statusListFilter;
  }
  getStatusList() {

  }
  clearFilterFuc() {
    this.filter.documentType = '';
    this.filter.status = '';
    this.filterFuc(false);
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
