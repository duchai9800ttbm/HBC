import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { HoSoDangLuuY } from '../../../../../../../../shared/models/ho-so-du-thau/danh-sach-vat-tu';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { DictionaryItemText } from '../../../../../../../../shared/models';

@Component({
  selector: 'app-summary-condition-form-tender-submission',
  templateUrl: './summary-condition-form-tender-submission.component.html',
  styleUrls: ['./summary-condition-form-tender-submission.component.scss']
})
export class SummaryConditionFormTenderSubmissionComponent implements OnInit {

  hoSoDangLuuY = new HoSoDangLuuY();
  hoSoDangLuuYForm: FormGroup;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private fb: FormBuilder
  ) { }


  get taiLieuLuuYFA(): FormArray {
    return this.hoSoDangLuuYForm.get('taiLieuLuuY') as FormArray;
  }
  ngOnInit() {
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
          soLuong: null,
          ngonNgu: ''
        };
      }
    });
  }

  createForm() {
    this.hoSoDangLuuYForm = this.fb.group({
      taiLieuLuuY: this.fb.array([]),
      soLuong: this.hoSoDangLuuY.soLuong,
      ngonNgu: this.hoSoDangLuuY.ngonNgu
    });

    this.hoSoDangLuuY.taiLieuLuuY.forEach(x => {
      const control = <FormArray>this.hoSoDangLuuYForm.controls.taiLieuLuuY;
      control.push(this.fb.group({
        taiLieu: x
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
  }

  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.hoSoDangLuuYForm.get(name) as FormArray;
    const formItem = this.fb.group({
      taiLieu: data ? data.name : '',
    });
    formArray.push(formItem);
  }


  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.hoSoDangLuuYForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }


}
