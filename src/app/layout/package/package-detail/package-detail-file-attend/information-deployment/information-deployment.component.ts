import { Component, OnInit, TemplateRef, ViewChild, ViewChildren, OnDestroy } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { UploadItem } from '../../../../../shared/models/upload/upload-item.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridDataResult, } from '@progress/kendo-angular-grid';
import { SortDescriptor } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { BehaviorSubject, Subject, Subscription, Observable } from '../../../../../../../node_modules/rxjs';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { SendEmailModel } from '../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../shared/services/email.service';
import { SearchEmailModel } from '../../../../../shared/models/search-email.model';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { TenderPreparationPlanningRequest } from '../../../../../shared/models/api-request/package/tender-preparation-planning-request';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { groupBy } from '@progress/kendo-data-query';
import { PagedResult } from '../../../../../shared/models';
// tslint:disable-next-line:max-line-length
import { ProposedTenderParticipationHistory } from '../../../../../shared/models/api-response/package/proposed-tender-participation-history.model';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../shared/components/form-in/form-in.component';
import { slideToLeft } from '../../../../../router.animations';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../shared/models/permission/permission.model';
import { ScheduleAssignments } from '../../../../../shared/constants/schedule-assignments';
@Component({
  selector: 'app-information-deployment',
  templateUrl: './information-deployment.component.html',
  styleUrls: ['./information-deployment.component.scss'],
  animations: [slideToLeft()]
})
export class InformationDeploymentComponent implements OnInit, OnDestroy {
  loading = false;
  file = [];
  public gridView: GridDataResult;
  public items: any[] = listUsers;
  public mySelection: number[] = [];
  isSendCc: boolean;
  isSendBcc: boolean;
  formUpload: FormGroup;
  submitted = false;
  private dataUploadFile: UploadItem[] = [];
  uploadItem: UploadItem[];
  modalRef: BsModalRef;
  modalViewListData: BsModalRef;
  modelSendAssignment: BsModalRef;
  modelUp: BsModalRef;
  currentPackageId: number;
  toggleTextUpFile: string;
  isTeamPlate: boolean;
  isSendInformation: boolean;
  showTabelAssignment: boolean;
  hideButon: boolean;
  showButtonAssignmet: boolean;
  isconfirmProgress: boolean;
  textConfirmProgress: string;
  setHSDT: boolean;
  dowloadTem: boolean;
  dataConfirm = true;
  isShowTable: boolean;
  packageId: number;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger2: Subject<any> = new Subject();
  dtOptions2: any = DATATABLE_CONFIG;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  scheduleAssignments = ScheduleAssignments;
  public skip = 0;
  pageSize = 5;
  checkboxSeclectAll: boolean;
  roms: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Sales' },
    { id: 2, name: 'Master' }
  ];
  listUsers: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Oliver Dinh' },
    { id: 2, name: 'Phuong VD' },
    { id: 3, name: 'Nghia Nguyen' },
    { id: 4, name: 'Dao Nhan' },
    { id: 5, name: 'Dang Quyen' }
  ];
  listData: any = [
    { id: 1, rom: 'Phòng Giám đốc', username: 'Oliver Dinh', email: 'oliverdinh@gmail.com', checkboxSelected: 'checkboxSelected' },
    { id: 2, rom: 'Phòng Hành chính', username: 'Van Dinh', email: 'vandinh@gmail.com', checkboxSelected: 'checkboxSelected' },
    { id: 3, rom: 'Phòng lưu trữ', username: 'Huy Nhat', email: 'huynhat@gmail.com', checkboxSelected: 'checkboxSelected' }
  ];
  emailModel: SendEmailModel = new SendEmailModel();

  ckeConfig: any;
  @ViewChildren('ckeditor') ckeditor: any;
  @ViewChild('informationDeployment') informationDeployment;
  listEmailSearchTo;
  listEmailSearchToEmail;
  listEmailSearchCc;
  listEmailSearchBcc;
  toEmployeeEmail;
  searchTermTo$ = new BehaviorSubject<string>('');
  searchTermCc$ = new BehaviorSubject<string>('');
  searchTermBcc$ = new BehaviorSubject<string>('');
  public selectedSizes: Array<string> = [];
  bidOpportunityId;
  packageInfo: PackageInfoModel;
  bidStatus = BidStatus;
  tenderPlan: TenderPreparationPlanningRequest = null;
  historyList;
  pagedResultChangeHistoryList: PagedResult<ProposedTenderParticipationHistory[]> = new PagedResult<ProposedTenderParticipationHistory[]>();
  indexItemHistoryChange: number;
  dialog;
  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  ThongBaoTrienKhai = false;
  XemEmail = false;
  TaoMoiBangPCTD = false;
  XemBangPCTD = false;
  SuaBangPCTD = false;
  XoaBangPCTD = false;
  InBangPCTD = false;
  XacNhanKyPrepared = false;
  XacNhanKyApproved = false;
  GuiPCTD = false;
  TaiTemplatePCTD = false;
  BatDauLapHSDT = false;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private emailService: EmailService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private confirmService: ConfirmationService,
    private dialogService: DialogService,
    private permissionService: PermissionService
  ) {
    this.loadItems();
  }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.loading = true;

    this.subscription = this.permissionService.get().concatMap(response => response.length > 0 ? Observable.of(response) :
      Observable.throw('Error Permission')).retry(1).subscribe(data => {
        console.log('check phan quyen');
        if (this.listPermission === []) {

        }
        this.listPermission = data;
        console.log(this.listPermission);
        const hsdt = this.listPermission.length &&
          this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
        if (!hsdt) {
          this.listPermissionScreen = [];
        }
        if (hsdt) {
          const screen = hsdt.userPermissionDetails.length
            && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'TrienKhaiVaPhanCongTienDo')[0];
          if (!screen) {
            this.listPermissionScreen = [];
          }
          if (screen) {
            this.listPermissionScreen = screen.permissions.map(z => z.value);
          }
        }
        this.ThongBaoTrienKhai = this.listPermissionScreen.includes('ThongBaoTrienKhai');
        this.XemEmail = this.listPermissionScreen.includes('XemEmail');
        this.TaoMoiBangPCTD = this.listPermissionScreen.includes('TaoMoiBangPCTD');
        this.XemBangPCTD = this.listPermissionScreen.includes('XemBangPCTD');
        this.SuaBangPCTD = this.listPermissionScreen.includes('SuaBangPCTD');
        this.XoaBangPCTD = this.listPermissionScreen.includes('XoaBangPCTD');
        this.InBangPCTD = this.listPermissionScreen.includes('InBangPCTD');
        this.XacNhanKyPrepared = this.listPermissionScreen.includes('XacNhanKyPrepared');
        this.XacNhanKyApproved = this.listPermissionScreen.includes('XacNhanKyApproved');
        this.GuiPCTD = this.listPermissionScreen.includes('GuiPCTD');
        this.TaiTemplatePCTD = this.listPermissionScreen.includes('TaiTemplatePCTD');
        this.BatDauLapHSDT = this.listPermissionScreen.includes('BatDauLapHSDT');
      });
    this.emailService.searchbymail('').subscribe(response => {

      this.listEmailSearchTo = response;
      this.listEmailSearchCc = response;
      this.listEmailSearchBcc = response;
    });

    this.getPackageInfo();
    this.getTenderPlanInfo(); this.getChangeHistory(0, 10);

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

    this.packageId = +PackageDetailComponent.packageId;
    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
    });

    this.isSendCc = false;
    this.isSendBcc = false;
    this.setHSDT = false;
    this.dowloadTem = false;
    this.isTeamPlate = false;
    this.isconfirmProgress = false;
    this.hideButon = false;
    this.isSendInformation = false;
    this.showTabelAssignment = false;
    this.isShowTable = true;
    this.showButtonAssignmet = false;
    this.textConfirmProgress = 'Gửi phân công tiến độ';
    this.toggleTextUpFile = '';
    this.currentPackageId = +PackageDetailComponent.packageId;

    // this.searchTermTo$
    //   .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
    //   .distinctUntilChanged()
    //   .subscribe(term => {
    //     this.emailService.searchbymail(term).subscribe(response => {
    //       this.listEmailSearchTo = response;
    //     });
    //   });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  refresh() {
    this.getPackageInfo();
    this.getTenderPlanInfo();
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }

  searchEmailTo(event) {
  }

  getTenderPlanInfo() {
    this.loading = true;
    this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
      this.tenderPlan = data;
      setTimeout(() => {
        this.loading = false;
      });
    }, () => {
      this.loading = false;
      this.alertService.error('Lấy thông tin bảng phân công tiến độ thất bại');
    });
  }

  onPaste(e) {
  }

  getPackageInfo() {
    this.packageService
      .getInforPackageID(this.bidOpportunityId)
      .subscribe(data => {
        this.packageInfo = data;
        const isTrienKhai = this.packageInfo.stageStatus.id === this.bidStatus.DaThongBaoTrienKhai;
        // tslint:disable-next-line:max-line-length
        this.toggleTextUpFile = isTrienKhai ? 'Hiện chưa có bảng phân công tiến độ nào' : 'Bạn cần phải thông báo triển khai trước khi phân công tiến độ thực hiện';
      });
  }

  openModalDeployment(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg-max' })
    );

  }
  openModalUpload(template: TemplateRef<any>) {
    this.modelUp = this.modalService.show(template);
  }
  openModeSendAssignment(template: TemplateRef<any>) {
    this.modelSendAssignment = this.modalService.show(template);
  }

  SendInformation() {
    if (this.emailModel && this.emailModel.to) {
      this.emailModel.bidOpportunityId = this.packageId;
      this.emailService.sendEmailDeployment(this.emailModel, this.file).subscribe(() => {
        this.statusObservableHsdtService.change();
        this.isSendInformation = !this.isSendInformation;
        this.isTeamPlate = !this.isTeamPlate;
        this.dowloadTem = true;
        this.alertService.success('Gửi thông báo triển khai thành công!');
        this.modalRef.hide();
        this.getPackageInfo();
      },
        err => {
          if (err.json().errorCode === 'BusinessException') {
            this.alertService.error('Đã xảy ra lỗi. Hồ sơ mời thầu này đã được gửi thư thông báo triển khai!');
          } else {
            this.alertService.error('Đã xảy ra lỗi. Gửi thông báo triển khai không thành công!');
          }
          this.modalRef.hide();
        });
    }
  }

  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }

    this.dataUploadFile.unshift({
      id: this.dataUploadFile.length + 1,
      name: this.formUpload.value.name,
      description: this.formUpload.value.description,
      createDate: '',
      status: null,
      userId: null,
      version: this.formUpload.value.version,
      interview: null
    });
    this.uploadItem = this.dataUploadFile;
    this.formUpload.reset();
    this.submitted = false;
    // this.isSendInformation = false;
    this.hideButon = false;
    this.showTabelAssignment = true;
    this.showButtonAssignmet = true;
    this.alertService.success('Upload file phân công tiến độ thành công!');
    this.modelUp.hide();

  }

  confirmProgress() {
    this.isconfirmProgress = !this.isconfirmProgress;
    this.showButtonAssignmet = !this.showButtonAssignmet;
    this.hideButon = true;
    this.showTabelAssignment = true;
    this.isShowTable = false;
    this.isTeamPlate = false;
    this.dataConfirm = !this.dataConfirm;
    this.alertService.success('Xác nhận phân công tiến độ thành công!');
  }
  sendConfirmAssignment() {
    this.setHSDT = true;
    this.modelSendAssignment.hide();
    this.textConfirmProgress = 'Gửi lại phân công tiến độ';
    this.alertService.success('Gửi phân công tiến độ thành công!');
  }

  public sortChange(): void {
    this.loadItems();
  }

  private loadItems(): void {
    this.gridView = {
      data: this.items.slice(this.skip, this.skip + this.pageSize),
      total: this.items.length
    };
  }
  sendCc() {
    this.isSendCc = !this.isSendCc;
  }
  sendBcc() {
    this.isSendBcc = !this.isSendBcc;
  }
  ClosePopup() {
    this.modalRef.hide();
    // this.router.navigate([`/package/detail/${this.packageId}/result`]);
  }
  onSelectAll(value: boolean) {
    this.listData.forEach(x => (x['checkboxSelected'] = value));
  }

  lapHSDT() {
    this.confirmationService.confirm(
      'Bạn có muốn lập hồ sơ dự thầu?',
      () => {
        this.router.navigate([`/package/detail/${this.packageId}/attend/build`]);
        this.alertService.success('Triển khai & phân công tiến độ thành công!');
      }
    );
  }

  uploadfile(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      for (let i = 0; i < fileList.length; i++) {
        this.file.push(fileList[i]);
      }
      event.target.value = null;
    }
  }

  deleteFileUpload(index: number) {
    this.file.splice(index, 1);
  }

  changeAction(data: string) {
    this.packageService.setRouterAction(data);
  }

  deleteTenderPlan() {
    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa bảng phân công tiến độ này?', () => {
      this.packageService.deleteTenderPreparationPlanning(this.bidOpportunityId).subscribe(() => {
        this.alertService.success('Xóa bảng phân công tiến độ thành công!');
        this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
        // this.proposedTender = null;
        // this.getProposedTenderParticipateReportInfo();
        this.tenderPlan = null;
        this.getPackageInfo();
      }, () => {
        this.alertService.error('Xóa bảng phân công tiến độ thất bại!');
      });
    });
  }

  checkAssignment(): boolean {
    let check = false;
    for (let i = 0; i < this.tenderPlan.tasks.length; i++) {
      if (this.tenderPlan.tasks[i].whoIsInChargeId && this.tenderPlan.tasks[i].whoIsInChargeId !== 0) {
        check = true;
        if (!this.tenderPlan.tasks[i].startDate && !this.tenderPlan.tasks[i].finishDate) {
          check = false;
          break;
        }
      } else if (this.tenderPlan.tasks[i].whoIsInCharges && this.tenderPlan.tasks[i].whoIsInCharges.length !== 0) {
        check = true;
        if (!this.tenderPlan.tasks[i].startDate || !this.tenderPlan.tasks[i].finishDate) {
          check = false;
          break;
        }
      }
    }
    return check;
  }

  confirmTenderPlan() {
    if (this.checkAssignment()) {
      this.tenderPlan.isDraftVersion = false;
      // tslint:disable-next-line:max-line-length
      this.tenderPlan.projectDirectorEmployeeId = this.tenderPlan.projectDirectorEmployee ? this.tenderPlan.projectDirectorEmployee.employeeId : null;
      this.tenderPlan.tenderDepartmentEmployeeId = this.tenderPlan.tenderDepartmentEmployee ? this.tenderPlan.tenderDepartmentEmployee.employeeId : null;
      // tslint:disable-next-line:max-line-length
      this.tenderPlan.technicalDepartmentEmployeeId = this.tenderPlan.technicalDepartmentEmployee ? this.tenderPlan.technicalDepartmentEmployee.employeeId : null;
      // tslint:disable-next-line:max-line-length
      this.tenderPlan.bimDepartmentEmployeeId = this.tenderPlan.bimDepartmentEmployee ? this.tenderPlan.bimDepartmentEmployee.employeeId : null;
      this.packageService.comfirmTenderPreparationPlanning(this.tenderPlan).subscribe(() => {
        this.alertService.success('Xác nhận phân công tiến độ thành công!');
        this.getPackageInfo();
      }, () => {
        this.alertService.error('Xác nhận phân công tiến độ thất bại!');
      });
    } else {
      this.alertService.error('Bạn chưa hoàn tất phân công tiến độ, kiểm tra lại bảng phân công.');
    }
  }

  sendTenderPlan() {
    if (this.tenderPlan.isSignedByApprovalPerson && this.tenderPlan.isSignedByPreparedPerson) {
      this.packageService.sendTenderPreparationPlanning(this.bidOpportunityId).subscribe(() => {
        this.alertService.success('Gửi phân công tiến độ thành công!');
        this.getPackageInfo();
      }, () => {
        this.alertService.error('Gửi phân công tiến độ thất bại!');
      });
    } else {
      if (!this.tenderPlan.isSignedByPreparedPerson) {
        this.packageService.setRouterAction('edit');
        this.confirmService.missAction('Bảng phân công tiến độ chưa được xác nhận ký tại Người tạo và người duyệt',
          `/package/detail/${this.bidOpportunityId}/attend/infomation-deployment/edit`);
      } else if (!this.tenderPlan.isSignedByApprovalPerson) {
        this.packageService.setRouterAction('view');
        this.confirmService.missAction('Bảng phân công tiến độ chưa được xác nhận ký tại Người tạo và người duyệt',
          `/package/detail/${this.bidOpportunityId}/attend/infomation-deployment/view`);
      }
    }
  }

  customSearchFn(term: string, item: SearchEmailModel) {
    term = term.toLocaleLowerCase();
    return item.employeeName.toLocaleLowerCase().indexOf(term) > -1 || item.employeeEmail.toLocaleLowerCase().indexOf(term) > -1;
  }
  // sendTenderPlan() {
  //   this.packageService.sendTenderPreparationPlanning(this.bidOpportunityId).subscribe(success => {
  //     this.alertService.success('Gửi phân công tiến độ thành công!');
  //   }, err => {
  //     this.alertService.error('Gửi phân công tiến độ thất bại!');
  //   });
  // }
  onChange() {
  }

  getChangeHistory(page: number | string, pageSize: number | string) {
    this.packageService.getChangeHistoryListTenderPreparationPlanning(this.bidOpportunityId, page, pageSize).subscribe(respone => {
      this.historyList = respone.items;
      this.pagedResultChangeHistoryList = respone;
      // this.historyList = this.historyList.sort((a, b) => parseFloat(a.changedTimes) < parseFloat(b.changedTimes));
      // this.historyList = groupBy(this.historyList, [{ field: 'changedTimes' }]);
      this.historyList = groupBy(respone.items, [{ field: 'changedTime' }]);
      this.historyList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.historyList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormSubject' }]);
        });
      });
      this.indexItemHistoryChange = Number(this.pagedResultChangeHistoryList.total)
        - Number(this.pagedResultChangeHistoryList.pageSize) * Number(this.pagedResultChangeHistoryList.currentPage);
      (this.historyList || []).forEach(itemPar => {
        (itemPar.items || []).forEach(itemChild => {
          (itemChild.liveFormChangeds || []).forEach(itemChildChild => {
            (itemChildChild.items || []).forEach(itemValue => {
              if (itemValue.liveFormSubject === 'AssigmentTask') {
                if (itemValue.newValue) {
                  itemValue.newValue = JSON.parse(itemValue.newValue);
                }
                if (itemValue.oldValue) {
                  itemValue.oldValue = JSON.parse(itemValue.oldValue);
                }
              }
            });
          });
        });
      });
      console.log('getChangeHistory', this.historyList);
      setTimeout(() => {
      });
    },
      () => {
      });
  }

  pagedResultChangeHistory() {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }

  downloadTemplate() {
    this.packageService.downloadPreparationPlanningTemplate().subscribe(() => {
    },
      () => {
        this.alertService.error('Tải template phân công tiến độ không thành công!');
      });
  }

  startSetHSDT() {
    this.packageService.startSetHSDT(this.bidOpportunityId).subscribe(() => {
      this.alertService.success('Bắt đầu lập HSDT thành công!');
      // this.statusObservableHsdtService.change();
      this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
    },
      () => {
        this.alertService.error('Bắt đầu lập HSDT thất bại!');
      });
  }

  print() {
    this.dialog = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialog.content.instance;
    instance.type = 'LiveFormPhanCongTienDo';
    instance.packageId = this.packageId;
  }

}

const listUsers = [
  {
    id: 1,
    name: 'Ngoc Dang',
    rom: 'Sales',
    email: 'ngocdang@gmail.com',
    checkbox: true
  },
  {
    id: 2,
    name: 'Oliver Dinh',
    rom: 'Sales',
    email: 'oliverdinh@gmail.com',
    checkbox: true
  },
  {
    id: 3,
    name: 'Phuong VD',
    rom: 'Sales',
    email: 'phuongvd@gmail.com',
    checkbox: true
  }
];
