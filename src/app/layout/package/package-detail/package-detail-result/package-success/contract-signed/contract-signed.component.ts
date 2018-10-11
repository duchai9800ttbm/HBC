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
  statusPackage;
  public resultData: any[] = this.packageSuccessService.getDataResult();
  subscription: Subscription;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new FilterContractSigning();
  pagedResult: PagedResult<ContractSigningList> = new PagedResult<ContractSigningList>();
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
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
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
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.statusPackage = result.stageStatus.id;
    });
    this.subscription = this.detailResultPackageService.watchListContractSigning().subscribe(value => {
      this.statusPackage = this.bidStatus.DaKyKetHopDong;
    });
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
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  render(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  onSelectAll(value: boolean) {
    this.resultData.forEach(x => (x['checkboxSelected'] = value));
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
    this.packageService.setActiveKickoff(this.isSignedContract)
    this.alertService.success('Upload hợp đồng ký kết thành công!');
    this.textContract = this.isSignedContract ? 'Đã ký kết hợp đồng' : 'Đã phản hồi đến phòng hợp đồng'
    this.modalUpload.hide();
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
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialogUploadContractSigning.close();
  }
}
