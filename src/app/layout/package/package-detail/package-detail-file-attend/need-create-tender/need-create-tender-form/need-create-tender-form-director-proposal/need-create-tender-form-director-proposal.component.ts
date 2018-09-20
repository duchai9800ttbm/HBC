import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';

@Component({
  selector: 'app-need-create-tender-form-director-proposal',
  templateUrl: './need-create-tender-form-director-proposal.component.html',
  styleUrls: ['./need-create-tender-form-director-proposal.component.scss']
})
export class NeedCreateTenderFormDirectorProposalComponent implements OnInit {

  routerAction: string;
  directorProposalForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.routerAction = NeedCreateTenderComponent.routerAction;
    this.createForm();
    this.directorProposalForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formData = NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
    this.directorProposalForm = this.fb.group({
      isAgreedParticipating: NeedCreateTenderFormComponent.formModel.isAgreedParticipating,
      reason: formData ? formData.reason : '',
      date: formData ? DateTimeConvertHelper.fromTimestampToDtObject(formData.date * 1000) : new Date(),
      expectedTime: formData ? DateTimeConvertHelper.fromTimestampToDtObject(formData.expectedTime * 1000) : new Date(),
      isSigned: formData ? formData.isSigned : false
    });
    console.log(this.directorProposalForm.value);
  }

  clickSigned() {
    this.directorProposalForm.get('isSigned').patchValue(true);
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal = data;
    NeedCreateTenderFormComponent.formModel.isAgreedParticipating = data.isAgreedParticipating;
    // tslint:disable-next-line:max-line-length
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.date = DateTimeConvertHelper.fromDtObjectToSecon(data.date);
    NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.expectedTime = DateTimeConvertHelper.fromDtObjectToSecon(data.expectedTime);
  }

}
