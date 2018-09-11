import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';

@Component({
  selector: 'app-need-create-tender-form-analysis',
  templateUrl: './need-create-tender-form-analysis.component.html',
  styleUrls: ['./need-create-tender-form-analysis.component.scss']
})
export class NeedCreateTenderFormAnalysisComponent implements OnInit {

  analysisForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.analysisForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const value = NeedCreateTenderFormComponent.formModel;
    this.analysisForm = this.fb.group({
      documentName: value && value.documentName ? value.documentName : '',
      employerAnalysis: this.fb.group({
        reputation: value && value.employerAnalysis ? value.employerAnalysis.reputation : '',
        financeCapacity: value && value.employerAnalysis ? value && value.employerAnalysis.financeCapacity : '',
        projectRealizable: value && value.employerAnalysis ? value && value.employerAnalysis.projectRealizable : ''
      })
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.documentName = data.documentName;
    NeedCreateTenderFormComponent.formModel.employerAnalysis = data.employerAnalysis;
  }

}
