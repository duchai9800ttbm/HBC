import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DictionaryItemText } from '../../../../../../../../shared/models';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderScopeOfWork } from '../../../../../../../../shared/models/package/tender-scope-of-work';

@Component({
  selector: 'app-summary-condition-form-scope-work',
  templateUrl: './summary-condition-form-scope-work.component.html',
  styleUrls: ['./summary-condition-form-scope-work.component.scss']
})
export class SummaryConditionFormScopeWorkComponent implements OnInit {

  scopeWorkForm: FormGroup;

  get scopeIncludeFA(): FormArray {
    return this.scopeWorkForm.get('scopeInclude') as FormArray;
  }

  get scopeNotIncludeFA(): FormArray {
    return this.scopeWorkForm.get('scopeNotInclude') as FormArray;
  }
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.scopeWorkForm = this.fb.group({
      scopeInclude: this.fb.array([]),
      scopeNotInclude: this.fb.array([])
    });
    // this.initFormData();
    this.scopeWorkForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  // initFormData() {
  //   if (SummaryConditionFormComponent.formModel.scopeOfWork) {
  //     const data = SummaryConditionFormComponent.formModel.scopeOfWork;
  //     if (data.includedWorks.length > 0) {
  //       data.includedWorks.forEach(e => {
  //         this.addFormArrayControl('scopeInclude', e);
  //       });
  //     } else {
  //       this.addFormArrayControl('scopeInclude');
  //     }
  //     if (data.nonIncludedWorks.length > 0) {
  //       data.nonIncludedWorks.forEach(e => {
  //         this.addFormArrayControl('scopeNotInclude', e);
  //       });
  //     } else {
  //       this.addFormArrayControl('scopeNotInclude');
  //     }
  //   } else {
  //     this.addFormArrayControl('scopeInclude');
  //     this.addFormArrayControl('scopeNotInclude');
  //   }
  // }

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
