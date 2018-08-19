import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, AlertService, DataService, SessionService, UserNotificationService } from '../../shared/services/index';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidationHelper from '../../shared/helpers/validation.helper';
import { UserModel } from '../../shared/models/user/user.model';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';

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
    isSubmitted: boolean;
    authForm: FormGroup;
    invalidMessages: string[];
    apiErrorCode: string;
    formErrors = {
        username: '',
        password: '',
    };
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
                                this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
                                this.isManageUsers = this.listPrivileges.some(x => x === 'ManagerUsers');
                                this.isManageSettings = this.listPrivileges.some(x => x === 'ManageSettings');
                                this.isManageUserGroups = this.listPrivileges.some(x => x === 'ManageUserGroups');
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
                                } else {
                                    this.router.navigate(['/package']);
                                    this.spinner.hide();
                                }
                            }
                        }, 300);

                    },
                    err => {
                        this.apiErrorCode = 'Nhập sai tên người dùng hoặc mật khẩu!';
                    }
                );
        }
    }

    ngOnInit() { }
}
