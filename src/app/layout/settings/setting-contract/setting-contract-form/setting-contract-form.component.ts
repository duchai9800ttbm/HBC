import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { AlertService } from '../../../../shared/services';
import { Contract } from '../../../../shared/models/setting/contract';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-setting-contract-form',
  templateUrl: './setting-contract-form.component.html',
  styleUrls: ['./setting-contract-form.component.scss']
})
export class SettingContractFormComponent implements OnInit {
  @Input() contract: Contract;
  contractForm: FormGroup;
  formErrors = {
    contractNameVi: ''
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
    this.contractForm = this.fb.group({
      id: this.contract.id,
      contractNameVi: [this.contract.contractNameVi, CustomValidator.required],
      contractNameEng: this.contract.contractNameEng,
      contractDesc: this.contract.contractDesc
    });
    this.contractForm.valueChanges
      .subscribe(() => this.onFormValueChanged());
  }
  onFormValueChanged() {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.contractForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }
  submitForm() {
    const contractNameVi = this.contractForm.get('contractNameVi').value;
    this.isSubmitted = true;
    const valid = this.validateForm();
    if (valid) {
      this.settingService.createOrUpdateTypeOfContract(this.contractForm.value).subscribe(() => {
        const message = this.contract.id
          ? `Loại hợp đồng ${contractNameVi} đã được cập nhật thành công.`
          : `Loại hợp đồng ${contractNameVi} đã được tạo mới thành công.`;
        this.router.navigate([`/settings/contract`]);
        this.alertService.success(message);
      }, err => {
        const error = err.json();
        if (error.errorCode === 'BusinessException') {
          this.alertService.error(`Loại hợp đồng này đã tồn tại`);
        } else {
          this.alertService.error('Đã xảy ra lỗi ! Vui lòng thử lại sau.');
        }
      });
    }
  }

}
