import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { Requirement } from '../../../../../../../../shared/models/package/requirement';
import { TenderOtherSpecRequirement } from '../../../../../../../../shared/models/package/tender-other-spec-requirement';

@Component({
  selector: 'app-summary-condition-form-special-requirement',
  templateUrl: './summary-condition-form-special-requirement.component.html',
  styleUrls: ['./summary-condition-form-special-requirement.component.scss']
})
export class SummaryConditionFormSpecialRequirementComponent implements OnInit {

  specialRequirementForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.specialRequirementForm = this.fb.group({
      requirements: this.fb.array([])
    });
    this.initFormData();
    this.specialRequirementForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initFormData() {
    if (SummaryConditionFormComponent.formModel.otherSpecialRequirement) {
      const data = SummaryConditionFormComponent.formModel.otherSpecialRequirement;
      if (data.requirements.length > 0) {
        data.requirements.forEach(e => {
          this.addFormArrayControl('requirements', e);
        });
      } else {
        this.addFormArrayControl('requirements');
      }
    } else {
      this.addFormArrayControl('requirements');
    }
  }

  addFormArrayControl(name: string, data?: Requirement) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: data ? data.name : '',
      desc: data ? data.desc : '',
      link: data ? data.link : ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  mappingToLiveFormData(data) {
    const value = new TenderOtherSpecRequirement();
    value.requirements = [];
    data.requirements.forEach(e => {
      let item = new Requirement();
      item = e;
      value.requirements.push(item);
    });
    SummaryConditionFormComponent.formModel.otherSpecialRequirement = value;
  }

}
