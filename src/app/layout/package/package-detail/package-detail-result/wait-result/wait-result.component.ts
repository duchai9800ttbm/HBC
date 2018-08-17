import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';

@Component({
  selector: 'app-wait-result',
  templateUrl: './wait-result.component.html',
  styleUrls: ['./wait-result.component.scss']
})
export class WaitResultComponent implements OnInit {
  currentPackageId: number;
  modaltrungThau: BsModalRef;
  modaltratThau: BsModalRef;
  modalhuyThau: BsModalRef;
  modalUpload: BsModalRef;
  datePickerConfig = DATETIME_PICKER_CONFIG;

  textTrungThau: string;
  textTratThau: string;
  textHuyThau: string;
  btnTrungThau: boolean;
  btnTratThau: boolean;
  btnHuyThau: boolean;
  packageId: number;
  formUpload: FormGroup;
  submitted = false;
  reasons: Array<{ name: string; id: number }> = [
    { id: 1, name: 'Thiết kế đẹp ' },
    { id: 2, name: 'Kỹ thuật, nguồn lực tốt' },
    { id: 3, name: 'Khác' }

  ];
  constructor(
    private modalService: BsModalService,
    private router: Router,
    private activetedRoute: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
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

  }
  modalTrungThau(template: TemplateRef<any>) {
    this.modaltrungThau = this.modalService.show(template);
    this.btnTrungThau = !this.btnTrungThau;
    this.btnHuyThau = false;
    this.btnTratThau = false;
    this.textTrungThau = 'trúng'
  }
  modalTratThau(template: TemplateRef<any>) {
    this.modaltratThau = this.modalService.show(template);
    this.btnTratThau = !this.btnTratThau;
    this.btnTrungThau = false;
    this.btnHuyThau = false;
    this.textTratThau = 'trật'

  }
  modalHuyThau(template: TemplateRef<any>) {
    this.modalhuyThau = this.modalService.show(template);
    this.btnHuyThau = !this.btnHuyThau;
    this.btnTrungThau = false;
    this.btnTratThau = false;
    this.textHuyThau = 'hủy'

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

  btnOk(template: TemplateRef<any>) {
    if (this.btnTrungThau) {
      this.modaltrungThau.hide();
      this.modalUpload = this.modalService.show(template);
    } else if (this.btnTratThau) {
      this.modaltratThau.hide();
      this.modalUpload = this.modalService.show(template);
    } else {
      this.modalhuyThau.hide();
      console.log('this.packageId', this.packageId);
      this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-cancel`]);
    }
  }
  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    if(this.btnTrungThau) {
      this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success`]);
    }
    if (this.btnTratThau) {
      this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-failed`]);
    }
    
    this.modalUpload.hide();

  }
}
