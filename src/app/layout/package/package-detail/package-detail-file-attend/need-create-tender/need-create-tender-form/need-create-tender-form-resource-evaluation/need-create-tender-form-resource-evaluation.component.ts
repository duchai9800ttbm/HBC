import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';

@Component({
  selector: 'app-need-create-tender-form-resource-evaluation',
  templateUrl: './need-create-tender-form-resource-evaluation.component.html',
  styleUrls: ['./need-create-tender-form-resource-evaluation.component.scss']
})
export class NeedCreateTenderFormResourceEvaluationComponent implements OnInit {

  routerAction: string;
  resourceEvaluationForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.routerAction = NeedCreateTenderComponent.routerAction;
    this.createForm();
    this.resourceEvaluationForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.internalResourcesEvaluation;
    this.resourceEvaluationForm = this.fb.group({
      currentSituation: formValue ? formValue.currentSituation : '',
      humanResorcesAndEquipments: formValue ? formValue.humanResorcesAndEquipments : '',
      financeCapacity: formValue ? formValue.financeCapacity : '',
      competitor: formValue ? formValue.competitor : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.internalResourcesEvaluation = data;
  }

}
