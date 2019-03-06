import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../node_modules/@angular/forms';
import { SettingService } from '../../../../../shared/services/setting.service';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../../shared/services';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { OpportunityReasonRejectModel } from '../../../../../shared/models/setting/opportunity-reason-reject-model';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-setting-reason-reject-form',
  templateUrl: './setting-reason-reject-form.component.html',
  styleUrls: ['./setting-reason-reject-form.component.scss']
})
export class SettingReasonRejectFormComponent implements OnInit {

  reasonRejectForm: FormGroup;
  @Input() reasonReject: OpportunityReasonRejectModel;
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
    this.reasonRejectForm = this.fb.group({
      id: this.reasonReject.id,
      bidOpportunityReasonName: [this.reasonReject.reasonName, CustomValidator.required],
      bidOpportunityReasonDesc: this.reasonReject.reasonDesc
    });
    this.reasonRejectForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    const reasonName = this.reasonRejectForm.get('bidOpportunityReasonName').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      // trim()
      this.reasonRejectForm.value.bidOpportunityReasonName = this.reasonRejectForm.value.bidOpportunityReasonName
        ? this.reasonRejectForm.value.bidOpportunityReasonName.trim() : this.reasonRejectForm.value.bidOpportunityReasonName;
      this.reasonRejectForm.value.bidOpportunityReasonDesc = this.reasonRejectForm.value.bidOpportunityReasonDesc
        ? this.reasonRejectForm.value.bidOpportunityReasonDesc.trim() : this.reasonRejectForm.value.bidOpportunityReasonDesc;

      this.settingService.createOrUpdateOpportunityReason(this.reasonRejectForm.value, SETTING_REASON.Cancel).subscribe(data => {
        const message = this.reasonReject.id
          ? `Lý do hủy thầu ${reasonName} đã được cập nhật thành công.`
          : `Lý do hủy thầu ${reasonName} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/reason/reject`]);
        this.alertService.success(message);
      }, err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`Lý do hủy thầu này đã tồn tại`);
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
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.reasonRejectForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
