import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-summary-condition-form-main-material',
  templateUrl: './summary-condition-form-main-material.component.html',
  styleUrls: ['./summary-condition-form-main-material.component.scss']
})
export class SummaryConditionFormMainMaterialComponent implements OnInit {

  mainMaterialForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.mainMaterialForm = this.fb.group({
      materials: this.fb.array([])
    });
    this.addFormArrayControl('materials');
  }

  addFormArrayControl(name: string) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      description: ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
