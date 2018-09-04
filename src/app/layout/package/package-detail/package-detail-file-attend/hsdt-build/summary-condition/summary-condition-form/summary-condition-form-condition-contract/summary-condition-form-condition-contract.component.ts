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
      contractType: '',
      desc: '',
      contractCondition: this.fb.group({
        executiveGuaranteePercent: 0,
        executiveGuaranteeEfficiency: 0,
        advanceGuaranteePercent: 0,
        advanceGuaranteeEfficiency: 0,
        paymentType: '',
        paymentTime: 0,
        paymentMaterialOnSite: '',
        retainedPercent: 0,
        retainedLimit: 0,
        retainedPayment: 0,
        punishhOverduePercent: 0,
        punishhOverdueLimit: 0,
        guaranteeDuration: 0,
        insurranceMachineOfContractor: '',
        insurrancePersonOfContractor: '',
        insurranceConstructionAnd3rdPart: '',
      insurances: this.fb.array([])
      }),
    });
    this.addFormArrayControl('insurances');
  }

  addFormArrayControl(name: string) {
    const formGroup = this.conditionContractForm.get('contractCondition') as FormGroup;
    const formArray = formGroup.get(name) as FormArray;
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
