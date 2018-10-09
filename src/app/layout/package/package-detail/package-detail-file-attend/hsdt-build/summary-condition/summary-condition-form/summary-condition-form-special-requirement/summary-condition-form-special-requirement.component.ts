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
  otherRequirement = new TableYeuCauDacBiet();
 
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
      descOne: this.otherRequirement.descOne,
      descTwo: this.otherRequirement.descTwo,
      descThree: this.otherRequirement.descThree,
      linkOne: this.otherRequirement.linkOne,
      linkTwo: this.otherRequirement.linkTwo,
      link2Two: this.otherRequirement.link2Two,
      linkThree: this.otherRequirement.linkThree,
    });



    this.specialRequirementForm.valueChanges.subscribe(data => {
      let obj = new TableYeuCauDacBiet();
      obj = {
        descOne: data.descOne,
        descTwo: data.descTwo,
        descThree: data.descThree,
        linkOne: data.linkOne,
        linkTwo: data.linkTwo,
        link2Two: data.link2Two,
        linkThree: data.linkThree,
      };
      console.log(obj);
      this.hoSoDuThauService.emitDataStepSpecial(obj);
    });
  }


  loadData() {
    this.hoSoDuThauService.watchDataLiveForm().subscribe(data => {
      const otherRequirement = data.yeuCauDacBietKhac;
      if (otherRequirement) {
        this.otherRequirement = otherRequirement;
      }
    });
  }


}
