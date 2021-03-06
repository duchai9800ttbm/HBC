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
    const reasonName = this.reasonLoseForm.get('bidOpportunityReasonName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      // trim()
      this.reasonLoseForm.value.bidOpportunityReasonName = this.reasonLoseForm.value.bidOpportunityReasonName
        ? this.reasonLoseForm.value.bidOpportunityReasonName.trim() : this.reasonLoseForm.value.bidOpportunityReasonName;
      this.reasonLoseForm.value.bidOpportunityReasonDesc = this.reasonLoseForm.value.bidOpportunityReasonDesc
        ? this.reasonLoseForm.value.bidOpportunityReasonDesc.trim() : this.reasonLoseForm.value.bidOpportunityReasonDesc;

      this.settingService.createOrUpdateOpportunityReason(this.reasonLoseForm.value, SETTING_REASON.Lose).subscribe(data => {
        const message = this.reasonLose.id
          ? `Lý do trật thầu ${reasonName} đã được cập nhật thành công.`
          : `Lý do trật thầu ${reasonName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/reason/lose`]);
        this.alertService.success(message);
      }, err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`Lý do trật thầu này đã tồn tại`);
        } else {
          this.alertService.error('Đã xảy ra lỗi ! Vui lòng thử lại sau.');
        }
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
