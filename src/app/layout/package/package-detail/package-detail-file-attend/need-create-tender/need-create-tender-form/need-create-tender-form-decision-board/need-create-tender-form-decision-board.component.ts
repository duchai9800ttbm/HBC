import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-need-create-tender-form-decision-board',
  templateUrl: './need-create-tender-form-decision-board.component.html',
  styleUrls: ['./need-create-tender-form-decision-board.component.scss']
})
export class NeedCreateTenderFormDecisionBoardComponent implements OnInit {

  routerAction: string;
  decisionBoardForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.routerAction = NeedCreateTenderComponent.routerAction;
    this.createForm();
    this.decisionBoardForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formData = NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector;
    this.decisionBoardForm = this.fb.group({
      isSigned: formData ? formData.isSigned : false,
      expectedTime: formData ? DateTimeConvertHelper.fromTimestampToDtObject(formData.expectedTime * 1000) : new Date()
    });
  }

  clickSigned() {
    this.decisionBoardForm.get('isSigned').patchValue(true);
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector = data;
    // tslint:disable-next-line:max-line-length
    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector.expectedTime = DateTimeConvertHelper.fromDtObjectToSecon(data.expectedTime);
  }

}
