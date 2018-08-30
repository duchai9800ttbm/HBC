import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-summary-condition-form-nonminated-sub-constructor',
  templateUrl: './summary-condition-form-nonminated-sub-constructor.component.html',
  styleUrls: ['./summary-condition-form-nonminated-sub-constructor.component.scss']
})
export class SummaryConditionFormNonminatedSubConstructorComponent implements OnInit {

  nonminateForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.nonminateForm = this.fb.group({
      packageWork: this.fb.array([])
    });
    this.addFormArrayControl('packageWork');
  }

  addFormArrayControl(name: string) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: '',
      description: ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

}
