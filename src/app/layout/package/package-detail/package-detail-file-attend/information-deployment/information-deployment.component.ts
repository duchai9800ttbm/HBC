import { Component, OnInit, TemplateRef, ViewChild, ElementRef, ViewChildren } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { UploadItem } from '../../../../../shared/models/upload/upload-item.model';
import { from } from 'rxjs/observable/from';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GridDataResult, PageChangeEvent, } from '@progress/kendo-angular-grid';
import { SortDescriptor, orderBy } from '@progress/kendo-data-query';
import { Router } from '@angular/router';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../node_modules/rxjs';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { SendEmailModel } from '../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../shared/services/email.service';
import { COMMON_CONSTANTS } from '../../../../../shared/configs/common.config';
import { SearchEmailModel } from '../../../../../shared/models/search-email.model';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { map } from 'rxjs/operators/map';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { TenderPreparationPlanningRequest } from '../../../../../shared/models/api-request/package/tender-preparation-planning-request';
@Component({
  selector: 'app-information-deployment',
  templateUrl: './information-deployment.component.html',
  styleUrls: ['./information-deployment.component.scss']
})
export class InformationDeploymentComponent implements OnInit {
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
  textInformation: string;
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
  datePickerConfig = DATETIME_PICKER_CONFIG;
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
  tenderPlan: TenderPreparationPlanningRequest;
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private emailService: EmailService,
    private packageService: PackageService
  ) {
    this.loadItems();
  }

  ngOnInit() {

    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.emailService.searchbymail('').subscribe(response => {
      this.listEmailSearchTo = response;
      this.listEmailSearchCc = response;
      this.listEmailSearchBcc = response;
    });

    this.getPackageInfo();
    this.getTenderPlanInfo();
    this.ckeConfig = {
      toolbar: [
        { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike'] },
        { name: 'justify', items: ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
        { name: 'styles', items: ['Styles', 'Format', 'FontSize', '-', 'TextColor', 'BGColor'] },
      ]
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
    this.textInformation = '';
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

  searchEmailTo(event) {
    console.log('searchEmailTo', event);
  }

  getTenderPlanInfo() {
    this.spinner.show();
    this.packageService.getTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
      this.tenderPlan = data;
      this.spinner.hide();
      setTimeout(() => {
        this.dtTrigger.next();
      });
    }, err => {
      this.spinner.hide();
      this.alertService.error('Lấy thông tin bảng phân công tiến độ thất bại');
    });
  }

  getPackageInfo() {
    this.spinner.show();
    this.packageService
      .getInforPackageID(this.bidOpportunityId)
      .subscribe(data => {
        this.packageInfo = data;
        this.spinner.hide();
        const isTrienKhai = this.packageInfo.stageStatus.id === this.bidStatus.DaThongBaoTrienKhai;
        // tslint:disable-next-line:max-line-length
        this.toggleTextUpFile = isTrienKhai ? 'Hiện chưa có bảng phân công tiến độ nào' : 'Bạn cần phải thông báo triển khai trước khi phân công tiến độ';
        this.textInformation = isTrienKhai ? 'Đã thông báo triển khai' : 'Chưa thông báo triển khai';
        console.log(data);
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
      this.spinner.show();
      this.emailService.sendEmailDeployment(this.emailModel, this.file).subscribe(result => {
        this.isSendInformation = !this.isSendInformation;
        this.isTeamPlate = !this.isTeamPlate;
        this.dowloadTem = true;
        this.alertService.success('Gửi thông báo triển khai thành công!');
        this.modalRef.hide();
        this.spinner.hide();
        this.getPackageInfo();
      },
        err => {
          if (err.json().errorCode === 'BusinessException') {
            this.alertService.error('Đã xảy ra lỗi. Hồ sơ mời thầu này đã được gửi thư thông báo triển khai!');
          } else {
            this.alertService.error('Đã xảy ra lỗi. Gửi thông báo triển khai không thành công!');
          }
          this.modalRef.hide();
          this.spinner.hide();
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
    this.textInformation = 'Đã xác nhận phân công';
    this.alertService.success('Xác nhận phân công tiến độ thành công!');
  }
  sendConfirmAssignment() {
    this.setHSDT = true;
    this.modelSendAssignment.hide();
    this.textConfirmProgress = 'Gửi lại phân công tiến độ';
    this.alertService.success('Gửi phân công tiến độ thành công!');
  }

  public sortChange(sort: SortDescriptor[]): void {
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
        this.spinner.show();
        this.router.navigate([`/package/detail/${this.packageId}/attend/build`]);
        this.spinner.hide();
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
      this.spinner.show();
      this.packageService.deleteTenderPreparationPlanning(this.bidOpportunityId).subscribe(data => {
        this.alertService.success('Xóa bảng phân công tiến độ thành công!');
        this.spinner.hide();
        // this.proposedTender = null;
        // this.getProposedTenderParticipateReportInfo();
        this.tenderPlan = null;
        this.getPackageInfo();
      }, err => {
        this.alertService.error('Xóa bảng phân công tiến độ thất bại!');
        this.spinner.hide();
      });
    });
  }

  confirmTenderPlan() {
    this.tenderPlan.isDraftVersion = false;
    this.packageService.createOrUpdateTenderPreparationPlanning(this.tenderPlan).subscribe(success => {
      this.spinner.hide();
      this.alertService.success('Xác nhận phân công tiến độ thành công!');
    }, err => {
      this.spinner.hide();
      this.alertService.error('Xác nhận phân công tiến độ thất bại!');
    });
  }

  sendTenderPlan() {
    this.spinner.show();
    this.packageService.sendTenderPreparationPlanning(this.bidOpportunityId).subscribe(success => {
      this.spinner.hide();
      this.alertService.success('Gửi phân công tiến độ thành công!');
    }, err => {
      this.spinner.hide();
      this.alertService.error('Gửi phân công tiến độ thất bại!');
    });
  }

  customSearchFn(term: string, item: SearchEmailModel) {
    term = term.toLocaleLowerCase();
    return item.employeeName.toLocaleLowerCase().indexOf(term) > -1 || item.employeeEmail.toLocaleLowerCase() === term;
  }
  // sendTenderPlan() {
  //   this.spinner.show();
  //   this.packageService.sendTenderPreparationPlanning(this.bidOpportunityId).subscribe(success => {
  //     this.spinner.hide();
  //     this.alertService.success('Gửi phân công tiến độ thành công!');
  //   }, err => {
  //     this.spinner.hide();
  //     this.alertService.error('Gửi phân công tiến độ thất bại!');
  //   });
  // }
  // onChange(e) {
  // console.log('data', this.emailModel.content);
  // const urlRegex = 'https://www.24h.com.vn/';
  // console.log('replace', `<a href="${urlRegex}">${urlRegex}</a>`);
  // this.emailModel.content = this.emailModel.content.replace(urlRegex, `<a href="${urlRegex}">${urlRegex}</a>`);
  // this.emailModel.content = `<a href="https://www.24h.com.vn/">https://www.24h.com.vn/</a>`;

  // this.ckeditor.model.change(writer => {
  //   const insertPosition = this.ckeditor.model.document.selection.getFirstPosition();
  //   writer.insertText('CKEditor 5 rocks!', { linkHref: 'https://ckeditor.com/' }, insertPosition);
  // });
  // this.emailModel.content = '123';
  // console.log('ckeditor', this.informationDeployment, this.ckeditor);
  // this.ckeditor.instance.setData('');
  // console.log('this.emailModel.content', this.emailModel.content);
  // .elementRef.nativeElement.nextElementSibling
  //   this.emailModel.content = '<p>123</p>';
  // }
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
