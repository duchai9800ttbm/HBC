import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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
  }

  addFormArrayControl(name: string) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      description: ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.scopeWorkForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
