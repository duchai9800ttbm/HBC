import { Component, OnInit } from '@angular/core';
import { routerTransition, slideToLeft } from '../../../router.animations';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import { UserService } from '../../../shared/services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-get-active-code',
  templateUrl: './get-active-code.component.html',
  styleUrls: ['./get-active-code.component.scss'],
  animations: [slideToLeft()],
})
export class GetActiveCodeComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
  ) { }
  isSubmitted: boolean;
  apiErrorCode: string;
  getActiveCodeForm: FormGroup;
  invalidMessages: string[];
  formErrors = {
    email: '',
  };
  ngOnInit() {
    this.createForm();
    const browserName = this.getBrowser();
    if (browserName === 'Firefox') {
      document.getElementById('formLogin').classList.add('col-xl-12');
    }

  }

  createForm() {
    this.getActiveCodeForm = this.fb.group({
      email: ['', [Validators.required, CustomValidator.emailOrEmpty]],
    });
    this.getActiveCodeForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.getActiveCodeForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }
  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  submitForm() {
    this.isSubmitted = true;
    this.apiErrorCode = '';
    if (this.validateForm()) {
      const form = this.getActiveCodeForm.value;
      this.userService
        .getActiveCode(form.email)
        .subscribe(
          data => {
            this.router.navigate(['/login/forgot-password/enter-active-code'], { queryParams: { email: form.email } });
          },
          err => {
            if (err._body && JSON.parse(err._body).errorCode === 'NotFound') {
              this.apiErrorCode = 'Địa chỉ email không tồn tại trong hệ thống !';
            } else {
              this.apiErrorCode = 'Đã xảy ra lỗi. Vui lòng thử lại sau!';
            }
          });
    }
  }
  // submitForm() {
  //   this.isSubmitted = true;
  //   this.apiErrorCode = '';
  //   if (this.validateForm()) {
  //     const form = this.getActiveCodeForm.value;
  //     this.router.navigate(['/login/forgot-password/enter-active-code'], { queryParams: { email: form.email } });
  //   }
  // }

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
