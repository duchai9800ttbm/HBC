import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { UserService, AlertService, DataService, SessionService, UserNotificationService } from '../../shared/services/index';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidationHelper from '../../shared/helpers/validation.helper';

@Component({
    selector: 'app-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss'],
    animations: [routerTransition()],
    providers: [UserService]
})
export class LoginFormComponent implements OnInit {
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
        private userNotificationService: UserNotificationService
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
                        // this.userNotificationService.listNoticationsReminder(0, 100)
                        //     .subscribe(result => {
                        //         this.sessionService.saveNotificationList(result.items);
                        //     });
                        // this.dataService.getBranches().subscribe(branches => {
                        //     if (branches && branches.length === 1) {
                        //         this.sessionService.branchId = branches[0].id;
                        //         this.router.navigate(['/dashboard']);
                        //     } else {
                        //         this.router.navigate(['/branch']);
                        //     }
                        // });
                        //this.sessionService.branchId = 1;
                        this.router.navigate(['/package']);
                    },
                    err => {
                        this.apiErrorCode = 'Nhập sai tên người dùng hoặc mật khẩu!';
                    }
                );
        }
    }

    ngOnInit() { }
}
