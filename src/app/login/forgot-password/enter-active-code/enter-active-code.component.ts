import { Component, OnInit } from '@angular/core';
import { routerTransition, slideToLeft } from '../../../router.animations';
import { FormGroup, FormBuilder } from '@angular/forms';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { Validators } from '@angular/forms';
import { UserService } from '../../../shared/services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AlertService } from '../../../shared/services/alert.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-enter-active-code',
  templateUrl: './enter-active-code.component.html',
  styleUrls: ['./enter-active-code.component.scss'],
  animations: [slideToLeft()],
})
export class EnterActiveCodeComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService
  ) { }
  isSubmitted: boolean;
  apiErrorCode: string;
  enterActiveCodeForm: FormGroup;
  invalidMessages: string[];
  queryParamsSubsription: Subscription;
  email: string;
  isMessengerAlert = false;
  messengerAlert: string;
  formErrors = {
    numberOne: '',
    numberTwo: '',
    numberThree: '',
    numberFour: '',
    numberFive: '',
    numberSix: ''
  };
  ngOnInit() {
    this.createForm();
    this.queryParamsSubsription = this.activatedRoute.queryParams.subscribe(data => {
      this.email = data.email;
    });
    const browserName = this.getBrowser();
    if (browserName === 'Firefox') {
      document.getElementById('formLogin').classList.add('col-xl-12');
    }
  }

  createForm() {
    this.enterActiveCodeForm = this.fb.group({
      numberOne: ['', Validators.required],
      numberTwo: ['', Validators.required],
      numberThree: ['', Validators.required],
      numberFour: ['', Validators.required],
      numberFive: ['', Validators.required],
      numberSix: ['', Validators.required],
    });
    this.enterActiveCodeForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }
  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.enterActiveCodeForm, this.formErrors);
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
      const code = [
        this.enterActiveCodeForm.value.numberOne,
        this.enterActiveCodeForm.value.numberTwo,
        this.enterActiveCodeForm.value.numberThree,
        this.enterActiveCodeForm.value.numberFour,
        this.enterActiveCodeForm.value.numberFive,
        this.enterActiveCodeForm.value.numberSix,
      ].join('');

      this.userService
        .validateActiveCode(code, this.email)
        .subscribe(
          data => {
            if (data) {
              // this.userService.deleteEmail();
              this.router.navigate(['/login/forgot-password/reset-password'], {
                queryParams: {
                  // activeCode: code
                  email: this.email,
                  token: data,
                }
              });
            } else {
              this.apiErrorCode = 'Mã xác nhận không đúng.';
            }
          },
          err => {
            this.apiErrorCode = 'Mã xác nhận chưa đúng. Vui lòng kiểm tra lại email đã nhận!';
          });
      // this.router.navigate(['/login/forgot-password/reset-password'], { queryParams: { activeCode: code } });
    }
  }
  sendCodeAgain() {
    this.userService
      .getActiveCode(this.email)
      .subscribe(
        data => {
          this.isMessengerAlert = true;
          this.messengerAlert = `Đã gửi lại mã xác nhận vào email ${this.email}!`;
        },
        err => {
          this.apiErrorCode = 'Đã có lỗi xảy ra, vui lòng thử lại!';
        });
  }

  ngOnDestroy() {
    if (this.queryParamsSubsription) {
      this.queryParamsSubsription.unsubscribe();
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

  valueChangeKeypress(key) {
  }

  pastValue(event) {
    let key = event.clipboardData.getData('text/plain');
    let keyCheck = key;
    for (let i = 0; keyCheck.length > 0; i++) {
      if (!Number.isInteger(Number(key.substr(0, 1)))) {
        this.alertService.error('Mã xác nhận phải là kiểu số!');
        event.preventDefault();
        return;
      }
      keyCheck = keyCheck.substr(1, keyCheck.length - 1);
    }
    for (let i = 0; key.length > 0; i++) {
      switch (i) {
        case 0:
          this.enterActiveCodeForm.get('numberOne').patchValue(key.substr(0, 1));
          break;
        case 1:
          this.enterActiveCodeForm.get('numberTwo').patchValue(key.substr(0, 1));
          break;
        case 2:
          this.enterActiveCodeForm.get('numberThree').patchValue(key.substr(0, 1));
          break;
        case 3:
          this.enterActiveCodeForm.get('numberFour').patchValue(key.substr(0, 1));
          break;
        case 4:
          this.enterActiveCodeForm.get('numberFive').patchValue(key.substr(0, 1));
          break;
        case 5:
          this.enterActiveCodeForm.get('numberSix').patchValue(key.substr(0, 1));
          break;
      }
      key = key.substr(1, key.length - 1);
    }
  }
}
