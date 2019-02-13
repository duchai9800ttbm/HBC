import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { ActivatedRoute } from '@angular/router';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
@Component({
  selector: 'app-group-configuration-form',
  templateUrl: './group-configuration-form.component.html',
  styleUrls: ['./group-configuration-form.component.scss']
})
export class GroupConfigurationFormComponent implements OnInit {
  config: number;
  groupConfigForm: FormGroup;
  formErrors = {
    groupConfigName: ''
  };
  invalidMessages: string[];
  isSubmitted: boolean;
  constructor(
    private fb: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(result => {
      this.config = +result.id;
    });
    this.createForm();
  }

  createForm() {
    this.groupConfigForm = this.fb.group({
      id: null,
      groupConfigName: ['', CustomValidator.required],
      groupConfigDes: [''],
    });
    this.groupConfigForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.groupConfigForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      // my code
    }
  }

}
