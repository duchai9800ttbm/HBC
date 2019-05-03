import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HoSoDangLuuY } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-vat-tu';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '../../../../../../../../../../node_modules/@angular/router';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';

@Component({
  selector: 'app-summary-condition-form-tender-submission',
  templateUrl: './summary-condition-form-tender-submission.component.html',
  styleUrls: ['./summary-condition-form-tender-submission.component.scss']
})
export class SummaryConditionFormTenderSubmissionComponent implements OnInit {

  hoSoDangLuuY = new HoSoDangLuuY();
  hoSoDangLuuYForm: FormGroup;
  isModeView = false;
  bidOpportunityId: number;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private fb: FormBuilder,
    private router: Router,
    private parent: SummaryConditionFormComponent
  ) { }


  get taiLieuLuuYFA(): FormArray {
    return this.hoSoDangLuuYForm.get('taiLieuLuuY') as FormArray;
  }
  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.hoSoDuThauService.watchLiveformState().subscribe(data => {
      this.isModeView = data.isModeView;
    });
    this.loadData();
    this.createForm();
  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const obj = data.hoSoDangLuuY;
      if (obj) {
        this.hoSoDangLuuY = obj;
        if (!this.hoSoDangLuuY.taiLieuLuuY) {
          this.hoSoDangLuuY.taiLieuLuuY = [];
          this.hoSoDangLuuY.taiLieuLuuY.push('');
        }
      }
      if (!obj) {
        this.hoSoDangLuuY = {
          taiLieuLuuY: [''],
          soLuong: 0,
          ngonNgu: ''
        };
      }
    });
  }

  createForm() {
    this.hoSoDangLuuYForm = this.fb.group({
      taiLieuLuuY: this.fb.array([]),
      soLuong: { value: this.hoSoDangLuuY.soLuong, disabled: this.isModeView },
      ngonNgu: { value: this.hoSoDangLuuY.ngonNgu, disabled: this.isModeView }
    });
    if (!this.hoSoDangLuuY.ngonNgu) {
      this.hoSoDangLuuYForm.get('ngonNgu').patchValue('');
    }
    this.hoSoDangLuuY.taiLieuLuuY.forEach(x => {
      const control = <FormArray>this.hoSoDangLuuYForm.controls.taiLieuLuuY;
      control.push(this.fb.group({
        taiLieu: { value: x, disabled: this.isModeView }
      }));
    });

    this.hoSoDangLuuYForm.valueChanges.subscribe(data => {
      let obj = new HoSoDangLuuY();
      obj = {
        taiLieuLuuY: data.taiLieuLuuY.map(x => x.taiLieu),
        soLuong: data.soLuong,
        ngonNgu: data.ngonNgu
      };
      this.hoSoDuThauService.emitDataStepTenderSubmit(obj);
    });
    this.hoSoDuThauService.scrollToView(true);
  }

  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.hoSoDangLuuYForm.get(name) as FormArray;
    const formItem = this.fb.group({
      taiLieu: { value: data ? data.name : '', disabled: this.isModeView },
    });
    formArray.push(formItem);
  }


  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.hoSoDangLuuYForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  routerLink(e, link) {
    if (e.code === 'Enter') {
      this.router.navigate([`/package/detail/${this.bidOpportunityId}/attend/build/summary/form/create/${link}`]);
    }
  }

  saveData() {
    this.parent.onSubmit(false, false);
  }
}
