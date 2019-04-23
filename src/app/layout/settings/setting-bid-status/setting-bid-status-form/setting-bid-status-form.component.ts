import { Component, OnInit, Input } from '@angular/core';
import { BidStatusListItem } from '../../../../shared/models/setting/bid-status-list-item';
import { FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import { SettingService } from '../../../../shared/services/setting.service';
import { Router } from '../../../../../../node_modules/@angular/router';
import { AlertService } from '../../../../shared/services';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-setting-bid-status-form',
  templateUrl: './setting-bid-status-form.component.html',
  styleUrls: ['./setting-bid-status-form.component.scss']
})
export class SettingBidStatusFormComponent implements OnInit {

  @Input() bidStatus: BidStatusListItem;
  bidStatusForm: FormGroup;
  formErrors = {
    statusName: ''
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
    this.bidStatusForm = this.fb.group({
      id: this.bidStatus.id,
      statusName: [this.bidStatus.statusName, CustomValidator.required],
      statusDesc: this.bidStatus.statusDesc
    });
    this.bidStatusForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  submitForm() {
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateBidStatus(this.bidStatusForm.value).subscribe(data => {
        const message = this.bidStatus.id
          ? 'Tình trạng gói thầu đã được cập nhật thành công.'
          : 'Tình trạng gói thầu đã được tạo mới thành công.';
        this.router.navigate([`/settings/bid-status`]);
        this.alertService.success(message);
      }, err => {
        this.alertService.error('Đã xảy ra lỗi ! Vui lòng thử lại sau.');
      });
    }
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.bidStatusForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

}
