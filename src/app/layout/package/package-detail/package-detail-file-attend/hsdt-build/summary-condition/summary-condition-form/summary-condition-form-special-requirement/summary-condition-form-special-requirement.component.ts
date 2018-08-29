import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

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
    this.addFormArrayControl('requirements');
  }

  addFormArrayControl(name: string) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      description: ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.specialRequirementForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
