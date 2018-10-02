import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderScopeOfWork } from '../../../../../../../../shared/models/package/tender-scope-of-work';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { PhamViCongViec } from '../../../../../../../../shared/models/ho-so-du-thau/tom-tat-dkdt.model';

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
    this.scopeWorkForm = this.fb.group({
      scopeInclude: this.fb.array([]),
      scopeNotInclude: this.fb.array([])
    });
    this.scopeWorkForm.valueChanges.subscribe(data => this.hoSoDuThauService.emitDataStepScope(data));
  }

  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const objDataStepScope = data.phamViCongViec;
      if (objDataStepScope) {
        this.dataStepScope.phamViBaoGom = objDataStepScope.phamViBaoGom;
        this.dataStepScope.phamViKhongBaoGom = objDataStepScope.phamViKhongBaoGom;
      }
    });
  }

  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: data ? data.name : '',
      desc: data ? data.desc : ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  mappingToLiveFormData(data) {
    const value = new TenderScopeOfWork();
    value.includedWorks = [];
    value.nonIncludedWorks = [];
    data.scopeInclude.forEach(e => {
      let work = new DictionaryItemText();
      work = e;
      value.includedWorks.push(work);
    });
    data.scopeNotInclude.forEach(e => {
      let work = new DictionaryItemText();
      work = e;
      value.nonIncludedWorks.push(work);
    });
    SummaryConditionFormComponent.formModel.scopeOfWork = value;
  }

}
