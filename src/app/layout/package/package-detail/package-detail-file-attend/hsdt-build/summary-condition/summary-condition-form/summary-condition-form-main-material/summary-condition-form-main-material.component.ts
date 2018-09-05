import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { SummaryConditionComponent } from '../../summary-condition.component';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { TenderMaterialToSupplier } from '../../../../../../../../shared/models/package/tender-material-to-supplier';
import { DictionaryItemText } from '../../../../../../../../shared/models';

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
    this.initFormData();
    this.mainMaterialForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initFormData() {
    if (SummaryConditionFormComponent.formModel.materialsTobeSuppliedOrAppointedByOwner) {
      const data = SummaryConditionFormComponent.formModel.materialsTobeSuppliedOrAppointedByOwner;
      if (data.materials.length > 0) {
        data.materials.forEach(e => {
          this.addFormArrayControl('materials', e);
        });
      } else {
        this.addFormArrayControl('materials');
      }
    } else {
      this.addFormArrayControl('materials');
    }
  }

  addFormArrayControl(name: string, data?: DictionaryItemText) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    const formItem = this.fb.group({
      name: data ? data.name : '',
      desc: data ? data.desc : ''
    });
    formArray.push(formItem);
  }

  removeFormArrayControl(name: string, idx: number) {
    const formArray = this.mainMaterialForm.get(name) as FormArray;
    formArray.removeAt(idx);
  }

  mappingToLiveFormData(data) {
    const value = new TenderMaterialToSupplier();
    value.materials = [];
    data.materials.forEach(e => {
      let work = new DictionaryItemText();
      work = e;
      value.materials.push(work);
    });
    SummaryConditionFormComponent.formModel.materialsTobeSuppliedOrAppointedByOwner = value;
  }

}
