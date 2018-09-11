import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';

@Component({
  selector: 'app-need-create-tender-form-estimated-budget',
  templateUrl: './need-create-tender-form-estimated-budget.component.html',
  styleUrls: ['./need-create-tender-form-estimated-budget.component.scss']
})
export class NeedCreateTenderFormEstimatedBudgetComponent implements OnInit {

  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  estimatedBudgetForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.estimatedBudgetForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage;
    this.estimatedBudgetForm = this.fb.group({
      draftBudgetOfPackage: formValue ? formValue.draftBudgetOfPackage : 0,
      draftBudgetOfPackageCurrency: this.fb.group({
        key: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.key : this.listCurrency[0],
        value: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.value : this.listCurrency[0],
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.displayText : this.listCurrency[0]
      }),
      additionalNote: formValue ? formValue.additionalNote : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage = data;
  }

}
