import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import * as moment from 'moment';
import { PackageService } from '../../../../../../../shared/services/package.service';

@Component({
  selector: 'app-need-create-tender-form-decision-board',
  templateUrl: './need-create-tender-form-decision-board.component.html',
  styleUrls: ['./need-create-tender-form-decision-board.component.scss']
})
export class NeedCreateTenderFormDecisionBoardComponent implements OnInit {

  routerAction: string;
  decisionBoardForm: FormGroup;
  expectedTimeStr;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => this.routerAction = router);
    this.createForm();
    this.decisionBoardForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formData = NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector;
    const directorData = NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
    this.expectedTimeStr = directorData && directorData.expectedTime ? moment(directorData.expectedTime * 1000).format('DD/MM/YYYY') : '';
    this.decisionBoardForm = this.fb.group({
      isSigned: formData ? formData.isSigned : false,
      // tslint:disable-next-line:max-line-length
      expectedTime: directorData && directorData.expectedTime ? DateTimeConvertHelper.fromTimestampToDtObject(directorData.expectedTime * 1000) : null
    });
  }

  clickSigned() {
    this.decisionBoardForm.get('isSigned').patchValue(true);
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector = data;
    const directorData = NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
    // tslint:disable-next-line:max-line-length
    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector.expectedTime = directorData && directorData.expectedTime ? directorData.expectedTime : 0;
  }

}
