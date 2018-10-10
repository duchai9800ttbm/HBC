import { Component, OnInit, Input, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
import { PackageSuccessService } from '../../../../../../shared/services/package-success.service'
import { ConfirmationService, AlertService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service'
import { PackageDetailComponent } from '../../../package-detail.component';
import { SendEmailModel } from '../../../../../../shared/models/send-email-model';
import { EmailService } from '../../../../../../shared/services/email.service';

@Component({
  selector: 'app-contract-signed',
  templateUrl: './contract-signed.component.html',
  styleUrls: ['./contract-signed.component.scss']
})
export class ContractSignedComponent implements OnInit {
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
  public resultData: any [] = this.packageSuccessService.getDataResult();
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private packageSuccessService: PackageSuccessService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private packageService: PackageService,
    private emailService: EmailService
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
    this.formUpload = this.formBuilder.group({
      name: [''],
      link: [''],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.textContract ='Đã phản hồi đến phòng hợp đồng';
     this.total = this.resultData.length;
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
    this.textContract = this.isSignedContract ? 'Đã ký kết hợp đồng':'Đã phản hồi đến phòng hợp đồng'
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
}
