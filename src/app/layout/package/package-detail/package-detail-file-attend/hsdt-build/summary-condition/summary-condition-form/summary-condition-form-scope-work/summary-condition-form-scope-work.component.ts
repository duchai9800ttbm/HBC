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
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.scopeWorkForm = this.fb.group({
      scopeInclude: this.fb.array([]),
      scopeNotInclude: this.fb.array([])
    });
    this.addFormArrayControl('scopeInclude');
    this.addFormArrayControl('scopeNotInclude');
    this.scopeWorkForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  addFormArrayControl(name: string) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      desc: ''
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
