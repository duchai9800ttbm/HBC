import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-need-create-tender-form-director-proposal',
  templateUrl: './need-create-tender-form-director-proposal.component.html',
  styleUrls: ['./need-create-tender-form-director-proposal.component.scss']
})
export class NeedCreateTenderFormDirectorProposalComponent implements OnInit {

  directorProposalForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
    this.directorProposalForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formData = NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
    this.directorProposalForm = this.fb.group({
      isAgreedParticipating: formData ? formData.isAgreedParticipating : null,
      reason: formData ? formData.reason : '',
      date: formData ? DateTimeConvertHelper.fromTimestampToDtObject(formData.date) : new Date(),
      expectedTime: formData ? DateTimeConvertHelper.fromTimestampToDtObject(formData.expectedTime) : new Date(),
      isSigned: formData ? formData.isSigned : false
    });
  }

  clickSigned() {
    this.directorProposalForm.get('isSigned').patchValue(true);
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal = data;
    // tslint:disable-next-line:max-line-length
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.date = DateTimeConvertHelper.fromDtObjectToTimestamp(data.date);
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.expectedTime = DateTimeConvertHelper.fromDtObjectToTimestamp(data.expectedTime);
  }

}
