import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderScopeOfWork } from '../../../../../../../../shared/models/package/tender-scope-of-work';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { PhamViCongViec } from '../../../../../../../../shared/models/ho-so-du-thau/pham-vi-cong-viec';
import { ThongTinDoiTac } from '../../../../../../../../shared/models/ho-so-du-thau/thong-tin-doi-tac';
import { PhamViCongViecItem } from '../../../../../../../../shared/models/ho-so-du-thau/pham-vi-cong-viec-item';

@Component({
  selector: 'app-summary-condition-form-scope-work',
  templateUrl: './summary-condition-form-scope-work.component.html',
  styleUrls: ['./summary-condition-form-scope-work.component.scss']
})
export class SummaryConditionFormScopeWorkComponent implements OnInit {
  dataStepScope = new PhamViCongViec();
  scopeWorkForm: FormGroup;

  get scopeIncludeFA(): FormArray {
    return this.scopeWorkForm.get('scopeInclude') as FormArray;
  }

  get scopeNotIncludeFA(): FormArray {
    return this.scopeWorkForm.get('scopeNotInclude') as FormArray;
  }

  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.loadData();
  }

  createForm() {
    this.scopeWorkForm = this.fb.group({
      scopeInclude: this.fb.array([]),
      scopeNotInclude: this.fb.array([])
    });
    this.dataStepScope.phamViKhongBaoGom.forEach(x => {
      const control = <FormArray>this.scopeWorkForm.controls.scopeNotInclude;
      control.push(this.fb.group({
        congTac: x.congTac,
        dienGiaiCongTac: x.dienGiaiCongTac
      }));
    });
    this.dataStepScope.phamViBaoGom.forEach(x => {
      const control = <FormArray>this.scopeWorkForm.controls.scopeInclude;
      control.push(this.fb.group({
        congTac: x.congTac,
        dienGiaiCongTac: x.dienGiaiCongTac
      }));
    });

    this.scopeWorkForm.valueChanges.subscribe(data => {
      let obj = new PhamViCongViec();
      obj = {
        phamViBaoGom: data.scopeInclude.map(x => ({
          congTac: x.congTac,
          dienGiaiCongTac: x.dienGiaiCongTac
        })),
        phamViKhongBaoGom: data.scopeNotInclude.map(x => ({
          congTac: x.congTac,
          dienGiaiCongTac: x.dienGiaiCongTac
        }))
      };
      this.hoSoDuThauService.emitDataStepScope(obj);
    });
  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepScope = data.phamViCongViec;
      if (objDataStepScope) {
        this.dataStepScope = objDataStepScope;
      }

      if (!this.dataStepScope) {
        this.dataStepScope = {
          phamViBaoGom: [{
            congTac: '',
            dienGiaiCongTac: ''
          }],
          phamViKhongBaoGom: [{
            congTac: '',
            dienGiaiCongTac: ''
          }],
        };
      }
      if (!this.dataStepScope.phamViBaoGom || this.dataStepScope.phamViBaoGom.length === 0) {
        this.dataStepScope.phamViBaoGom = [];
        this.dataStepScope.phamViBaoGom.push({
          congTac: '',
          dienGiaiCongTac: ''
        });
      }

      if (!this.dataStepScope.phamViKhongBaoGom || this.dataStepScope.phamViKhongBaoGom.length === 0) {
        this.dataStepScope.phamViKhongBaoGom = [];
        this.dataStepScope.phamViKhongBaoGom.push({
          congTac: '',
          dienGiaiCongTac: ''
        });
      }
      this.createForm();

    });
  }

  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    const formItem = this.fb.group({
      congTac: data ? data.name : '',
      dienGiaiCongTac: data ? data.desc : ''
    });
    formArray.push(formItem);
  }


  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }


}
