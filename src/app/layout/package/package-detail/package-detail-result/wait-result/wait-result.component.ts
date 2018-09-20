import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageSuccessService } from '../../../../../shared/services/package-success.service';
import { PagedResult } from '../../../../../shared/models/paging-result.model';
import { Subject } from '../../../../../../../node_modules/rxjs';
import { CancelItem } from '../../../../../shared/models/reason/cancel-item';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-wait-result',
  templateUrl: './wait-result.component.html',
  styleUrls: ['./wait-result.component.scss']
})
export class WaitResultComponent implements OnInit {
  reasonForm: FormGroup;
  isSubmitted: boolean;
  formErrors = {
    reasonName: '',
  };
  public pageSize = 10;
  public skip = 0;
  reasonCance: PagedResult<CancelItem> = new PagedResult<CancelItem>();
  reasonLose: PagedResult<CancelItem> = new PagedResult<CancelItem>();
  reasonWin: PagedResult<CancelItem> = new PagedResult<CancelItem>();
  reason: PagedResult<CancelItem> = new PagedResult<CancelItem>();
  dtTrigger: Subject<any> = new Subject();

  currentPackageId: number;
  modaltrungThau: BsModalRef;
  modaltratThau: BsModalRef;
  modalhuyThau: BsModalRef;
  modalUpload: BsModalRef;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  invalidMessages: string[];
  textTrungThau: string;
  textTratThau: string;
  textHuyThau: string;
  btnTrungThau: boolean;
  btnTratThau: boolean;
  btnHuyThau: boolean;
  packageId: number;
  formUpload: FormGroup;
  submitted = false;
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private packageSuccessService: PackageSuccessService
  ) { }

  ngOnInit() {
    this.reasonForm = this.formBuilder.group({
      reasonName: ['', Validators.required]
    });
    this.reasonForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
    this.formUpload = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: ['']
    });
    this.btnTrungThau = false;
    this.btnHuyThau = false;
    this.btnTratThau = false;

    this.currentPackageId = +PackageDetailComponent.packageId;

    this.spinner.show();
    this.packageSuccessService
      .getReasonCancel(0, 10)
      .subscribe(result => {
        this.reasonCance = result;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });

    this.packageSuccessService
      .getReasonLose(0, 10)
      .subscribe(result => {
        this.reasonLose = result;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });

    this.packageSuccessService
      .getReasonWin(0, 10)
      .subscribe(result => {
        this.reasonWin = result;
        this.spinner.hide();
      }, err => {
        this.spinner.hide();
      });


  }


  modalTrungThau(template: TemplateRef<any>) {
    this.modaltrungThau = this.modalService.show(template);
    this.btnTrungThau = true;
    this.btnHuyThau = false;
    this.btnTratThau = false;
    this.textTrungThau = 'trúng';
    this.reason = this.reasonWin;
  }
  modalTratThau(template: TemplateRef<any>) {
    this.modaltratThau = this.modalService.show(template);
    this.btnTratThau = true;
    this.btnTrungThau = false;
    this.btnHuyThau = false;
    this.textTratThau = 'trật';
    this.reason = this.reasonLose;

  }
  modalHuyThau(template: TemplateRef<any>) {
    this.modalhuyThau = this.modalService.show(template);
    this.btnHuyThau = true;
    this.btnTrungThau = false;
    this.btnTratThau = false;
    this.textHuyThau = 'hủy';
    this.reason = this.reasonCance;

  }
  closeModel() {
    if (this.btnTrungThau) {
      this.modaltrungThau.hide();
    } else if (this.btnTratThau) {
      this.modaltratThau.hide();
    } else {
      this.modalhuyThau.hide();
    }
  }

  submitForm(template: TemplateRef<any>) {
    this.isSubmitted = true;
    const valid = this.validateForm(); console.log('valid', valid);
    if (this.validateForm()) {
      this.spinner.show();
      if (this.btnTrungThau) {
        this.modaltrungThau.hide();
        this.modalUpload = this.modalService.show(template);
        this.alertService.success('Gửi lý do trúng thầu thành công!');
      } else if (this.btnTratThau) {
        this.modaltratThau.hide();
        this.modalUpload = this.modalService.show(template);
        this.alertService.success('Gửi lý do trật thầu thành công!');
      } else {
        this.spinner.show();
        this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-cancel`]);
        this.spinner.hide();
        this.alertService.success('Gửi lý do hủy thầu thành công!');
        this.modalhuyThau.hide();
      }
    }

  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.reasonForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }


  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    if (this.btnTrungThau) {
      this.spinner.show();
      this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success`]);
      this.spinner.hide();
      this.alertService.success('Upload kết quả dự thầu thành công!');
    }
    if (this.btnTratThau) {
      this.spinner.show();
      this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-failed`]);
      this.spinner.hide();
      this.alertService.success('Upload kết quả dự thầu thành công!');
    }

    this.modalUpload.hide();

  }
}
