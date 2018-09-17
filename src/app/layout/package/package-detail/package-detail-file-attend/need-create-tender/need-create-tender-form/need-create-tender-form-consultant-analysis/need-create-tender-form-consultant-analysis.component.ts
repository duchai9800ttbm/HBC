import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';

@Component({
  selector: 'app-need-create-tender-form-consultant-analysis',
  templateUrl: './need-create-tender-form-consultant-analysis.component.html',
  styleUrls: ['./need-create-tender-form-consultant-analysis.component.scss']
})
export class NeedCreateTenderFormConsultantAnalysisComponent implements OnInit {

  routerAction: string;
  consultantAnalysForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.routerAction = NeedCreateTenderComponent.routerAction;
    this.createForm();
    this.consultantAnalysForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.consultantAnalysis;
    this.consultantAnalysForm = this.fb.group({
      reputation: formValue ? formValue.reputation : '',
      pastWorkingExperience: formValue ? formValue.pastWorkingExperience : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.consultantAnalysis = data;
  }

}
