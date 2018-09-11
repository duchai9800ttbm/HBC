import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { OpportunityReasonWinModel } from '../../../../../shared/models/setting/opportunity-reason-win-model';
import { SettingService } from '../../../../../shared/services/setting.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../../shared/services';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-setting-reason-win-form',
  templateUrl: './setting-reason-win-form.component.html',
  styleUrls: ['./setting-reason-win-form.component.scss']
})
export class SettingReasonWinFormComponent implements OnInit {

  reasonWinForm: FormGroup;
  @Input() reasonWin: OpportunityReasonWinModel;
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
    this.reasonWinForm = this.fb.group({
      id: this.reasonWin.id,
      bidOpportunityReasonName: [this.reasonWin.reasonName, CustomValidator.required],
      bidOpportunityReasonDesc: this.reasonWin.reasonDesc
    });
    this.reasonWinForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    const reasonName = this.reasonWinForm.get('bidOpportunityReasonName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateOpportunityReason(this.reasonWinForm.value, SETTING_REASON.Win).subscribe(data => {
        const message = this.reasonWin.id
          ? `Lý do trúng thầu ${reasonName} đã được cập nhật thành công.`
          : `Lý do trúng thầu ${reasonName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/reason/win`]);
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
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.reasonWinForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
