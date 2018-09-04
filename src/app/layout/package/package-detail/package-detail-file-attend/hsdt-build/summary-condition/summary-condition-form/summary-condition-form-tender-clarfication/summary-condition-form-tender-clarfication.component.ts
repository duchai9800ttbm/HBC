import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-summary-condition-form-tender-clarfication',
  templateUrl: './summary-condition-form-tender-clarfication.component.html',
  styleUrls: ['./summary-condition-form-tender-clarfication.component.scss']
})
export class SummaryConditionFormTenderClarficationComponent implements OnInit {

  clarficationForm: FormGroup;

  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    const formValue = SummaryConditionFormComponent.formModel.requestTenderClarification;
    this.clarficationForm = this.fb.group({
      consultant: this.fb.group({
        companyName: formValue ? formValue.consultant.companyName : '',
        companyAddress: formValue ? formValue.consultant.companyAddress : '',
        contactPerson: this.fb.group({
          name: formValue ? formValue.consultant.contactPerson.name : '',
          address: formValue ? formValue.consultant.contactPerson.address : '',
          email: formValue ? formValue.consultant.contactPerson.email : '',
          level: formValue ? formValue.consultant.contactPerson.level : ''
        })
      }),
      employer: this.fb.group({
        companyName: formValue ? formValue.employer.companyName : '',
        companyAddress: formValue ? formValue.employer.companyAddress : '',
        contactPerson: this.fb.group({
          name: formValue ? formValue.employer.contactPerson.name : '',
          address: formValue ? formValue.employer.contactPerson.address : '',
          email: formValue ? formValue.employer.contactPerson.email : '',
          level: formValue ? formValue.employer.contactPerson.level : ''
        })
      }),
      closingTime: this.fb.group({
        closingTime: formValue ? DateTimeConvertHelper.fromTimestampToDtObject(formValue.closingTime.closingTime) : new Date(),
        desc: formValue ? formValue.closingTime.desc : ''
      })
    });
    this.clarficationForm.valueChanges.subscribe(data => {
      SummaryConditionFormComponent.formModel.requestTenderClarification = data;
      SummaryConditionFormComponent.formModel.requestTenderClarification.closingTime.closingTime =
        DateTimeConvertHelper.fromDtObjectToTimestamp(data.closingTime.closingTime);
    });
  }

}
