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
            this.apiErrorCode = 'Địa chỉ email không tồn tại trong hệ thống !';
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
}
