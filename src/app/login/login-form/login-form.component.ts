import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, AlertService, DataService, SessionService, UserNotificationService } from '../../shared/services/index';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidationHelper from '../../shared/helpers/validation.helper';
import { UserModel } from '../../shared/models/user/user.model';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { AdministeredPackageList } from '../../shared/constants/administered-package';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    animations: [routerTransition()],
    providers: [UserService]
})
export class LoginFormComponent implements OnInit {
    userModel: UserModel;
    listPrivileges = [];
    isManageBidOpportunitys;
    isManageUsers;
    isManageUserGroups;
    isManageSettings;
    isManageReport;
    isSubmitted: boolean;
    authForm: FormGroup;
    invalidMessages: string[];
    apiErrorCode: string;
    formErrors = {
        username: '',
        password: '',
    };
    administeredPackageList = AdministeredPackageList;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private dataService: DataService,
        private sessionService: SessionService,
        private fb: FormBuilder,
        private userNotificationService: UserNotificationService,
        private spinner: NgxSpinnerService
    ) {
        this.authForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.authForm.valueChanges
            .subscribe(data => this.onFormValueChanged(data));
    }

    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(this.authForm, this.formErrors);
        return this.invalidMessages.length === 0;
    }

    submitForm() {
        this.isSubmitted = true;
        this.apiErrorCode = '';
        if (this.validateForm()) {
            const credentials = this.authForm.value;
            this.userService
                .attemptAuth('login', credentials.username, credentials.password)
                .subscribe(
                    data => {
                        this.spinner.show();
                        setTimeout(() => {
                            this.userModel = this.sessionService.userInfo;
                            this.listPrivileges = this.userModel.privileges;
                            if (this.listPrivileges) {
                                this.isManageBidOpportunitys = this.administeredPackageList.some(r => this.listPrivileges.includes(r));
                                this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
                                // tslint:disable-next-line:max-line-length
                                this.isManageSettings = this.listPrivileges.some(x => (x === 'ManageInformationSettings' || x === 'ManageKPISettings'));
                                this.isManageUserGroups = this.listPrivileges.some(x => x === 'ManageUserGroups');
                                this.isManageReport = this.listPrivileges.some(x => x === 'ManageTrackingReports');
                                if (this.route.snapshot.queryParamMap.get('returnUrl')) {
                                    switch (this.route.snapshot.queryParamMap.get('returnUrl').split('/')[1]) {
                                        case 'package': {
                                            if (this.isManageBidOpportunitys) {
                                                this.router.navigate([`${this.route.snapshot.queryParamMap.get('returnUrl')}`]);
                                                this.spinner.hide();
                                            } else if (this.isManageUserGroups) {
                                                this.router.navigate(['/management-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageUsers) {
                                                this.router.navigate(['/management-user/group-user/manage-user-list/manage-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageSettings) {
                                                this.router.navigate(['/settings']);
                                                this.spinner.hide();
                                            } else if (this.isManageReport) {
                                                this.router.navigate(['/monitoring-report']);
                                                this.spinner.hide();
                                            } else {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            }
                                            break;
                                        }
                                        case 'management-user': {
                                            if (this.isManageUserGroups || this.isManageUsers) {
                                                this.router.navigate([`${this.route.snapshot.queryParamMap.get('returnUrl')}`]);
                                                this.spinner.hide();
                                            } else if (this.isManageBidOpportunitys) {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            } else if (this.isManageSettings) {
                                                this.router.navigate(['/settings']);
                                                this.spinner.hide();
                                            } else if (this.isManageReport) {
                                                this.router.navigate(['/monitoring-report']);
                                                this.spinner.hide();
                                            } else {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            }
                                            break;
                                        }
                                        case 'settings': {
                                            if (this.isManageSettings) {
                                                this.router.navigate([`${this.route.snapshot.queryParamMap.get('returnUrl')}`]);
                                                this.spinner.hide();
                                            } else if (this.isManageBidOpportunitys) {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            } else if (this.isManageUserGroups) {
                                                this.router.navigate(['/management-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageUsers) {
                                                this.router.navigate(['/management-user/group-user/manage-user-list/manage-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageReport) {
                                                this.router.navigate(['/monitoring-report']);
                                                this.spinner.hide();
                                            } else {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            }
                                            break;
                                        } case 'monitoring-report': {
                                            if (this.isManageReport) {
                                                this.router.navigate([`${this.route.snapshot.queryParamMap.get('returnUrl')}`]);
                                                this.spinner.hide();
                                            } else if (this.isManageBidOpportunitys) {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            } else if (this.isManageUserGroups) {
                                                this.router.navigate(['/management-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageUsers) {
                                                this.router.navigate(['/management-user/group-user/manage-user-list/manage-user']);
                                                this.spinner.hide();
                                            } else if (this.isManageSettings) {
                                                this.router.navigate(['/settings']);
                                                this.spinner.hide();
                                            } else {
                                                this.router.navigate(['/package']);
                                                this.spinner.hide();
                                            }
                                            break;
                                        }
                                        default: {
                                            this.router.navigate(['/package']);
                                            this.spinner.hide();
                                        }
                                    }
                                    return;
                                }
                                if (this.isManageBidOpportunitys) {
                                    this.router.navigate(['/package']);
                                    this.spinner.hide();
                                } else if (this.isManageUserGroups) {
                                    this.router.navigate(['/management-user']);
                                    this.spinner.hide();
                                } else if (this.isManageUsers) {
                                    this.router.navigate(['/management-user/group-user/manage-user-list/manage-user']);
                                    this.spinner.hide();
                                } else if (this.isManageSettings) {
                                    this.router.navigate(['/settings']);
                                    this.spinner.hide();
                                } else if (this.isManageReport) {
                                    this.router.navigate(['/monitoring-report']);
                                    this.spinner.hide();
                                } else {
                                    this.router.navigate(['/package']);
                                    this.spinner.hide();
                                }
                            }
                        }, 300);
                    },
                    err => {
                        if (err._body && JSON.parse(err._body).errorCode === 'UserLoginIsNotActive') {
                            this.apiErrorCode = 'Tài khoản này đã bị khoá hoạt động, vui lòng liên hệ admin để được hỗ trợ!';
                        } else if (err._body && JSON.parse(err._body).errorCode === 'UserLoginInvalidUserNameOrPassword') {
                            this.apiErrorCode = 'Nhập sai tên người dùng hoặc mật khẩu!';
                        } else {
                            this.apiErrorCode = 'Đã xảy ra lỗi. Vui lòng thử lại sau!';
                        }
                    }
                );
        }
    }

    ngOnInit() {
        const browserName = this.getBrowser();
        if (browserName === 'Firefox') {
            document.getElementById('formLogin').classList.add('col-xl-12');
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
