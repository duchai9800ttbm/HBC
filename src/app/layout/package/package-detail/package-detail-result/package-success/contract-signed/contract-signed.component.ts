import { Component, OnInit, Input, TemplateRef, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject, Subscription } from '../../../../../../../../node_modules/rxjs';
import { PackageSuccessService } from '../../../../../../shared/services/package-success.service'
import { ConfirmationService, AlertService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service'
import { PackageDetailComponent } from '../../../package-detail.component';
import { SendEmailModel } from '../../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../../shared/services/email.service';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadContractSigningComponent } from './upload-contract-signing/upload-contract-signing.component';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { FilterContractSigning } from '../../../../../../shared/models/result-attend/filter-contract-signing.model';
import { PagedResult } from '../../../../../../shared/models';
import { ContractSigningList } from '../../../../../../shared/models/result-attend/contract-signing.list.model';
import { groupBy } from '../../../../../../../../node_modules/@progress/kendo-data-query';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/Permission.model';

@Component({
  selector: 'app-contract-signed',
  templateUrl: './contract-signed.component.html',
  styleUrls: ['./contract-signed.component.scss']
})
export class ContractSignedComponent implements OnInit, OnDestroy {
  @Input() isContract;
  modalUpload: BsModalRef;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  formUpload: FormGroup;
  submitted = false;
  isSignedContract = false;
  textContract: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  total: number;
  modalRef: BsModalRef;
  currentPackageId;
  ckeConfig;
  listEmailSearchTo;
  listEmailSearchCc;
  listEmailSearchBcc;
  isSendCc = false;
  isSendBcc = false;
  emailModel: SendEmailModel = new SendEmailModel();
  dialogUploadContractSigning;
  bidStatus = BidStatus;
  public resultData: any[] = this.packageSuccessService.getDataResult();
  subscription: Subscription;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new FilterContractSigning();
  pagedResult: PagedResult<ContractSigningList> = new PagedResult<ContractSigningList>();
  isNgOnInit: boolean;
  uploadList;
  interviewTimeList;
  currentFieldSort;
  statusSort;
  statusPackage = {
    text: 'TrungThau',
    stage: 'KQDT',
    id: null,
  };
  checkStatusPackage = CheckStatusPackage;
  isSignedContractAPI = false;
  isShow = false;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  ThemMoiHD = false;
  TaiXuongHD = false;
  XoaHD = false;

  maxVersion = 0;
  maxInterviewTimes = 0;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private packageSuccessService: PackageSuccessService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private packageService: PackageService,
    private emailService: EmailService,
    private dialogService: DialogService,
    private detailResultPackageService: DetailResultPackageService,
    private spinner: NgxSpinnerService,
    private permissionService: PermissionService

  ) { }

  ngOnInit() {
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
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'HopDongKiKet')[0];
        if (!screen) {
          this.listPermissionScreen = [];
        }
        if (screen) {
          this.listPermissionScreen = screen.permissions.map(z => z.value);
        }
      }
      this.ThemMoiHD = this.listPermissionScreen.includes('ThemMoiHD');
      this.TaiXuongHD = this.listPermissionScreen.includes('TaiXuongHD');
      this.XoaHD = this.listPermissionScreen.includes('XoaHD');
    });
    this.statusPackage = this.packageService.statusPackageValue2;
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(response => {
      this.isSignedContractAPI = response.isSignedContract;
      this.isShow = true;
    });
    // this.detailResultPackageService.watchListContractSigning().subscribe( value => {
    //   this.isSignedContractAPI = value;
    // });
    this.filterModel.uploadedDate = null;
    this.filterModel.uploadedByEmployeeId = null;
    this.filterModel.contractDate = null;
    this.filterModel.interviewTime = null;
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
    this.filter(false);
    this.filterList();
    const detail$ = this.detailResultPackageService.watchListContractSigning().subscribe(value => {
      this.isShow = true;
      this.isSignedContractAPI = value;
      this.filter(false);
      this.filterList();
    });
    this.subscription.add(detail$);
    this.searchTerm$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filter(false);
      });
    this.formUpload = this.formBuilder.group({
      name: [''],
      link: [''],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.textContract = 'Đã phản hồi đến phòng hợp đồng';
    this.total = this.resultData.length;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  refresh() {
    this.filter(false);
    this.filterList();
  }

  filterList() {
    const filterModelNew = new FilterContractSigning();
    this.spinner.show();
    this.detailResultPackageService
      .filterContractSigning(
        this.currentPackageId,
        '',
        filterModelNew,
        0,
        1000
      )
      .subscribe(result => {
        this.getUploadList(result);
        this.getInterviewTimeList(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  filter(displayAlert: boolean) {
    this.spinner.show();
    this.detailResultPackageService
      .filterContractSigning(
        this.currentPackageId,
        this.searchTerm$.value,
        this.filterModel,
        0,
        1000
      )
      .subscribe(result => {
        this.render(result);
        if (displayAlert && this.isNgOnInit) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.spinner.hide();
        this.isNgOnInit = true;
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel.uploadedDate = null;
    this.filterModel.uploadedByEmployeeId = null;
    this.filterModel.contractDate = null;
    this.filterModel.interviewTime = null;
    this.filter(false);
  }

  render(pagedResult: any) {
    this.pagedResult = pagedResult;
    // tslint:disable-next-line:max-line-length
    this.maxVersion = (pagedResult.items && pagedResult.items.length !== 0) ? Math.max.apply(Math, pagedResult.items.map(item => item.version)) : 0;
    this.maxInterviewTimes = (pagedResult.items && pagedResult.items.length !== 0) ? Math.max.apply(Math, pagedResult.items.map(item => item.interviewTime)) : 0;
  }

  getUploadList(result) {
    this.uploadList = result.items ? result.items.map(item => item.uploadByEmployee) : [];
    this.uploadList = groupBy(this.uploadList, [{ field: 'employeeId' }]);
    this.uploadList = this.uploadList.map(item => {
      return {
        employeeId: item.items[0].employeeId,
        employeeName: item.items[0].employeeName
      };
    });
    this.uploadList = this.uploadList.sort((a, b) => a.employeeId - b.employeeId);
  }

  getInterviewTimeList(result) {
    this.interviewTimeList = result.items ? result.items.map(item => item.interviewTime) : [];
    this.interviewTimeList = this.interviewTimeList.sort((a, b) => a - b);
    this.interviewTimeList = this.interviewTimeList.filter((el, i, a) => i === a.indexOf(el));
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }

  modalAdd(template: TemplateRef<any>) {
    this.modalUpload = this.modalService.show(template);
  }
  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.isSignedContract = true;
    this.packageService.setActiveKickoff(this.isSignedContract);
    this.alertService.success('Upload hợp đồng ký kết thành công!');
    this.textContract = this.isSignedContract ? 'Đã ký kết hợp đồng' : 'Đã phản hồi đến phòng hợp đồng';
    this.modalUpload.hide();
    this.refesh();
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

  uploadContractSigning() {
    this.dialogUploadContractSigning = this.dialogService.open({
      content: UploadContractSigningComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadContractSigning.content.instance;
    instance.version = this.maxVersion + 1;
    instance.interviewTimes = this.maxInterviewTimes + 1;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialogUploadContractSigning.close();
  }

  downloadTemplateContractSigning() {
    this.detailResultPackageService.downloadTemplateContractSigning().subscribe(response => {
    },
      err => {
        this.alertService.error('Tải template không thành công!');
      });
  }
  refesh() {
    this.filter(true);
    this.filterList();
  }
  deleteContractSign() {
    const listItemCheckbox = [];
    this.pagedResult.items.forEach(x => {
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
            this.detailResultPackageService.deleteContractSigning(listItemCheckbox[0]).subscribe(response => {
              this.filter(false);
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
            console.log('listItemCheckbox', listItemCheckbox);
            this.detailResultPackageService.deleteMultiContractSigning(listItemCheckbox).subscribe(response => {
              this.filter(false);
              this.alertService.success('Xóa tài liệu thành công!');
            },
              err => {
                this.alertService.error('Xóa tài liệu không thành công!');
              });
          });
      }
    }
  }
  downloadFileItem(bidContractDocumentId: number) {
    this.detailResultPackageService.downloadContractSigning(bidContractDocumentId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải về hợp đồng không thành công!');
      });
  }
  deleteFileItem(bidContractDocumentId: number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu được chọn?',
      () => {
        this.detailResultPackageService.deleteContractSigning(bidContractDocumentId).subscribe(response => {
          this.filter(false);
          this.alertService.success('Xóa tài liệu thành công!');
        },
          err => {
            this.alertService.error('Xóa tài liệu không thành công!');
          });
      });
  }
  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSort = fieldSort;
    this.statusSort = statusSort;
    switch (this.statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'name': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + a.name).localeCompare(b.name);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'version': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.version - b.version);
            this.render(this.pagedResult);
            break;
          }
          case 'employeeName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + a.uploadByEmployee.employeeName).localeCompare(b.uploadByEmployee.employeeName);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'uploadDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.uploadDate - b.uploadDate);
            this.render(this.pagedResult);
            break;
          }
          case 'contractDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.contractDate - b.contractDate);
            this.render(this.pagedResult);
            break;
          }
          case 'uploadDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.uploadDate - b.uploadDate);
            this.render(this.pagedResult);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'name': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + b.name).localeCompare(a.name);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'version': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.version - a.version);
            this.render(this.pagedResult);
            break;
          }
          case 'employeeName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + b.uploadByEmployee.employeeName).localeCompare(a.uploadByEmployee.employeeName);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'uploadDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.uploadDate - a.uploadDate);
            this.render(this.pagedResult);
            break;
          }
          case 'contractDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.contractDate - a.contractDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewTimes': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.interviewTime - a.interviewTime);
            this.render(this.pagedResult);
            break;
          }
        }
        break;
      }
      case '': {
        this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.id - b.id);
        this.render(this.pagedResult);
        break;
      }
    }
  }
}
