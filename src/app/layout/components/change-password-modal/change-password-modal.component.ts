import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService, AlertService } from '../../../shared/services/index';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import { Validators } from '@angular/forms';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrls: ['./change-password-modal.component.scss']
})
export class ChangePasswordModalComponent implements OnInit {
  isError;
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    public activeModal: NgbActiveModal,
    private alertService: AlertService,
  ) { }
  apiErrorCode: string;
  isSubmitted: boolean;
  changePasswordForm: FormGroup;
  invalidMessages: string[];
  activeCode: any;
  formErrors = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  };
  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required, CustomValidator.password]],
      newPassword: ['', [Validators.required, CustomValidator.password]],
      confirmPassword: ['', [Validators.required]],
    });
    this.changePasswordForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.changePasswordForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  matchPassword() {
    const newPassword = this.changePasswordForm.get('newPassword').value;
    const confirmPassword = this.changePasswordForm.get('confirmPassword').value;
    return newPassword === confirmPassword;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (!this.matchPassword()) {
        this.formErrors.confirmPassword = 'Mật khẩu không khớp';
        return;
      }
      const oldPassword = this.changePasswordForm.value.oldPassword;
      const newPassword = this.changePasswordForm.value.newPassword;
      this.userService
        .changePassword(oldPassword, newPassword)
        .subscribe(data => {
          this.activeModal.close('Close click');
          this.alertService.success('Cập nhật mật khẩu thành công!', true);
        }, err => {
          const error = err.json();
          if (error.errorCode === 'BusinessException') {
            this.isError = true;
          } else {
            this.alertService.error('Đã xảy ra lỗi. Cập nhật mật khẩu không thành công!');
          }
        });
    }
  }
}
