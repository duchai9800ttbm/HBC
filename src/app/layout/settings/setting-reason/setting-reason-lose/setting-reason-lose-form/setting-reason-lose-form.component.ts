import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { SettingService } from '../../../../../shared/services/setting.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../../shared/services';
import { OpportunityReasonLoseModel } from '../../../../../shared/models/setting/opportunity-reason-lose-model';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';

@Component({
  selector: 'app-setting-reason-lose-form',
  templateUrl: './setting-reason-lose-form.component.html',
  styleUrls: ['./setting-reason-lose-form.component.scss']
})
export class SettingReasonLoseFormComponent implements OnInit {

  reasonLoseForm: FormGroup;
  @Input() reasonLose: OpportunityReasonLoseModel;
  formErrors = {
    bidOpportunityReasonName: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];

  constructor(
    private fb: FormBuilder,
    private settingService: SettingService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.reasonLoseForm = this.fb.group({
      id: this.reasonLose.id,
      bidOpportunityReasonName: [this.reasonLose.reasonName, CustomValidator.required],
      bidOpportunityReasonDesc: this.reasonLose.reasonDesc
    });
    this.reasonLoseForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateOpportunityReason(this.reasonLoseForm.value, SETTING_REASON.Lose).subscribe(data => {
        const message = this.reasonLose.id
          ? 'Lý do đã được chỉnh sửa.'
          : 'Lý do đã được tạo.';
        this.router.navigate([`/settings/reason/lose`]);
        this.alertService.success(message);
      });
    }
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.reasonLoseForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }
}
