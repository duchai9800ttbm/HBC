import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import { ApiConvertHelper } from '../../../../../../../../shared/helpers/api-convert.helper';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-summary-condition-form-profile-destination',
  templateUrl: './summary-condition-form-profile-destination.component.html',
  styleUrls: ['./summary-condition-form-profile-destination.component.scss']
})
export class SummaryConditionFormProfileDestinationComponent implements OnInit {

  profileForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const formValue = SummaryConditionFormComponent.formModel.requestDocument;
    this.profileForm = this.fb.group({
      destination: formValue ? formValue.destination : '',
      receivedPerson: formValue ? formValue.receivedPerson : '',
      closingTime: formValue ? DateTimeConvertHelper.fromTimestampToDtObject(formValue.closingTime) : new Date()
    });
    this.profileForm.valueChanges.subscribe(data => {
      SummaryConditionFormComponent.formModel.requestDocument = data;
      SummaryConditionFormComponent.formModel.requestDocument.closingTime = DateTimeConvertHelper.fromDtObjectToTimestamp(data.closingTime);
    });
  }

}
