import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { ActivatedRoute } from '@angular/router';

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
    // this.groupConfigForm.valueChanges
    //   .subscribe(data => this.onFormValueChanged(data));
  }

}
