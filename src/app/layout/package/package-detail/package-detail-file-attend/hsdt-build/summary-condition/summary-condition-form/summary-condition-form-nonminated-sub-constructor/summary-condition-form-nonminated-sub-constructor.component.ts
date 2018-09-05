import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderNonminatedSubContractor } from '../../../../../../../../shared/models/package/tender-nonminated-sub-contractor';
import { WorkPackage } from '../../../../../../../../shared/models/package/work-package';

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

    this.initFormData();
    this.nonminateForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initFormData() {
    console.log(SummaryConditionFormComponent.formModel.nonminatedSubContractor);
    if (SummaryConditionFormComponent.formModel.nonminatedSubContractor) {
      const data = SummaryConditionFormComponent.formModel.nonminatedSubContractor;
      if (data.workPackages.length > 0) {
        data.workPackages.forEach(e => {
          this.addFormArrayControl('packageWork', e);
        });
      } else {
        this.addFormArrayControl('packageWork');
      }
    } else {
      this.addFormArrayControl('packageWork');
    }
  }

  addFormArrayControl(name: string, data?: WorkPackage) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: data ? data.name : '',
      desc: data ? data.desc : '',
      totalCost: data ? data.totalCost : 0
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.nonminateForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  mappingToLiveFormData(data) {
    const value = new TenderNonminatedSubContractor();
    value.workPackages = [];
    data.packageWork.forEach(e => {
      let work = new WorkPackage();
      work = e;
      value.workPackages.push(work);
    });
    SummaryConditionFormComponent.formModel.nonminatedSubContractor = value;
  }

}
