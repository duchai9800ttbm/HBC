import { Component, OnInit } from '@angular/core';
import { routerTransition, slideToLeft } from '../../../router.animations';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AlertService } from '../../../shared/services/index';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [slideToLeft()],

})
export class ResetPasswordComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) { }
  apiErrorCode: string;
  isSubmitted: boolean;
  resetPasswordForm: FormGroup;
  invalidMessages: string[];
  queryParamsSubsription: Subscription;
  token: any;
  email: any;
  formErrors = {
    newPassword: '',
    confirmPassword: '',
  };
  currentYear = new Date().getFullYear();
  ngOnInit() {
    this.createForm();
    this.queryParamsSubsription = this.activatedRoute.queryParams.subscribe(data => {
      this.email = data.email;
      this.token = data.token;
    });
    const browserName = this.getBrowser();
    if (browserName === 'Firefox') {
      document.getElementById('formLogin').classList.add('col-xl-12');
    }
  }

  createForm() {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, CustomValidator.password]],
      confirmPassword: ['', [Validators.required]]
    });
    this.resetPasswordForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.resetPasswordForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  matchPassword() {
    const newPassword = this.resetPasswordForm.get('newPassword').value;
    const confirmPassword = this.resetPasswordForm.get('confirmPassword').value;
    return newPassword === confirmPassword;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (!this.matchPassword()) {
        this.formErrors.confirmPassword = 'Mật khẩu không khớp';
        return;
      }
      const newPassword = this.resetPasswordForm.value.newPassword;
      this.userService
        .resetPassword(this.email, this.token, newPassword)
        .subscribe(data => {
          this.alertService.success('Đặt lại mật khẩu thành công!', true);
          this.router.navigate(['/login']);
        }, err => {
          this.apiErrorCode = 'Đã có lỗi xảy ra, vui lòng thử lại';
        });

    }
  }
  getBrowser(): string {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) !== -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf('Chrome') !== -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') !== -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
      return 'Firefox';
    } else if ((navigator.userAgent.indexOf('MSIE') !== -1) || (!!(<any>document).documentMode === true)) {
      return 'IE';
    } else {
      return 'unknown';
    }
  }
}
