import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-summary-condition-form-condition-contract',
  templateUrl: './summary-condition-form-condition-contract.component.html',
  styleUrls: ['./summary-condition-form-condition-contract.component.scss']
})
export class SummaryConditionFormConditionContractComponent implements OnInit {

  conditionContractForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.conditionContractForm = this.fb.group({
      insurances: this.fb.array([])
    });
    this.addFormArrayControl('insurances');
  }

  addFormArrayControl(name: string) {
    const formArray = this.conditionContractForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      description: ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.conditionContractForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
