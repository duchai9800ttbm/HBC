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
      descOne: this.otherRequirement.greenBuildingStandardName,
      linkOne: this.otherRequirement.greenBuildingStandardLink,
      linkTwo: this.otherRequirement.tenderEvaluationStep1,
      link2Two: this.otherRequirement.tenderEvaluationStep2,
      descThree: this.otherRequirement.profitValue,
      linkThree: this.otherRequirement.profitDesc,
    });



    this.specialRequirementForm.valueChanges.subscribe(data => {
      let obj = new TableYeuCauDacBiet();
      obj = {
        greenBuildingStandardName: data.descOne,
        greenBuildingStandardLink: data.linkOne,
        tenderEvaluationStep1: data.linkTwo,
        tenderEvaluationStep2: data.link2Two,
        profitValue: data.descThree,
        profitDesc: data.linkThree
      };
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
