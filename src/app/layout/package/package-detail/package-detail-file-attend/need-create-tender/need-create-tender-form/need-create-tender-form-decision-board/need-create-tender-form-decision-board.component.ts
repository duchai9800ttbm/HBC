import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';

@Component({
  selector: 'app-need-create-tender-form-decision-board',
  templateUrl: './need-create-tender-form-decision-board.component.html',
  styleUrls: ['./need-create-tender-form-decision-board.component.scss']
})
export class NeedCreateTenderFormDecisionBoardComponent implements OnInit {

  decisionBoardForm: FormGroup;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const formData = NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector;
    this.decisionBoardForm = this.fb.group({
      isSigned: formData ? formData.isSigned : false
    });
  }

  clickSigned() {
    this.decisionBoardForm.get('isSigned').patchValue(true);
  }

}
