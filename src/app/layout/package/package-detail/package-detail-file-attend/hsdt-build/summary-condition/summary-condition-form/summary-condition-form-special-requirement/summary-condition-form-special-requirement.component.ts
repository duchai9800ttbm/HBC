import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { Requirement } from '../../../../../../../../shared/models/package/requirement';
import { TenderOtherSpecRequirement } from '../../../../../../../../shared/models/package/tender-other-spec-requirement';
import { HoSoDuThauService } from '../../../../../../../../shared/services/ho-so-du-thau.service';
import { TableYeuCauDacBiet } from '../../../../../../../../shared/models/ho-so-du-thau/table-yeu-cau';

@Component({
  selector: 'app-summary-condition-form-special-requirement',
  templateUrl: './summary-condition-form-special-requirement.component.html',
  styleUrls: ['./summary-condition-form-special-requirement.component.scss']
})
export class SummaryConditionFormSpecialRequirementComponent implements OnInit {

  specialRequirementForm: FormGroup;
  otherRequirement = new Array<TableYeuCauDacBiet>();
  get requirementsFA(): FormArray {
    return this.specialRequirementForm.get('requirements') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private hoSoDuThauService: HoSoDuThauService
  ) { }

  ngOnInit() {
    this.loadData();
    this.createForm();
  }
  createForm() {
    this.specialRequirementForm = this.fb.group({
      requirements: this.fb.array([])
    });

    this.otherRequirement.forEach(x => {
      const control = <FormArray>this.specialRequirementForm.controls.requirements;
      control.push(this.fb.group({
        name: x.name,
        desc: x.desc,
        link: x.link
      }));
    });

    this.specialRequirementForm.valueChanges.subscribe(data => {
      let obj = new Array<TableYeuCauDacBiet>();
      obj = (data.requirements || []).map(x => ({
        name: x.name,
        desc: x.desc,
        link: x.link
      }));
      this.hoSoDuThauService.emitDataStepSpecial(obj);
    });
  }


  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const otherRequirement = data.yeuCauDacBietKhac;
      if (otherRequirement) {
        this.otherRequirement = otherRequirement;
      }
      if (!otherRequirement) {
        this.otherRequirement = [];
        this.otherRequirement.push({
          name: '',
          desc: '',
          link: ''
        });
      }
    });
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

}
