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
  isSignedContract: boolean = false;
  textContract :string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  total:number;
  public resultData :any [] = this.packageSuccessService.getDataResult();
  
  constructor(
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private packageSuccessService: PackageSuccessService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    //  this.isContract= false;
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
}
