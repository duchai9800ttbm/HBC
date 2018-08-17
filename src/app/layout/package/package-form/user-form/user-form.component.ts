import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../../../../shared/models/user/user.model';
import { PackageService } from '../../../../shared/services/package.service';
import { DataService, UserService, AlertService } from '../../../../shared/services';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { DictionaryItem, DictionaryItemIdString } from '../../../../shared/models';
import { GroupUserService } from '../../../../shared/services/group-user.service';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { DepartmentsFormBranches } from '../../../../shared/models/user/departments-from-branches';
import { Levels } from '../../../../shared/models/user/levels';
import { GroupUserModel } from '../../../../shared/models/user/group-user.model';
import { BsModalRef } from 'ngx-bootstrap';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    @Output() closed = new EventEmitter<boolean>();
    userForm: FormGroup;
    formErrors = {
        userName: '',
        password: '',
        rePassword: '',
        lastName: '',
        firstName: '',
        email: '',
    };
    user = new UserModel();
    submitted = false;
    invalidMessages: string[];
    isCollapsedUser = false;
    isCollapsedUserInfo = false;
    dataGroupUser: DictionaryItem[];
    departments: Observable<DepartmentsFormBranches[]>;
    positions: Observable<Levels[]>;
    public selectPosition: number = null;
    public selectedGroup: number = null;
    public selectedDepartmaent: number = null;
    groupUserModel: GroupUserModel;
    formAddUser: FormGroup;
    userId: number;
    password: string;
    confirmPass: string;
    isValid = false;
    apiError: string;
    isCheckbox = true;
    modalRef: BsModalRef;
    GroupCreate;
    submittedCreateGroup: boolean;
    listPrivilegesData: DictionaryItemIdString[];
    public close() {
        this.closed.emit(false);
    }
    constructor(
        private groupUserService: GroupUserService,
        private fb: FormBuilder,
        private router: Router,
        private packageService: PackageService,
        private dataService: DataService,
        private userService: UserService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.createForm();
        this.positions = this.dataService.getListLevels();
        this.departments = this.dataService.getListDepartmentsFromBranches();
        this.groupUserService.getListAllGroupUser().subscribe(element => {
            this.dataGroupUser = element.map(i => {
                return {
                    id: i.id,
                    text: i.name,
                };
            });
        });
    }

    createForm() {
        this.userForm = this.fb.group({
            userName: ['', [Validators.required, CustomValidator.loginName]],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, CustomValidator.password]],
            rePassword: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            levelId: null,
            userGroupId: null,
            departmentId: [null, Validators.required],
            isActive: [false],
            phoneNumber: ['', [CustomValidator.phoneNumber]],
            address: '',
        });
        this.userForm.valueChanges.subscribe(data =>
            this.onFormValueChanged(data)
        );
    }
    onFormValueChanged(data?: any) {
        if (this.submitted) {
            this.validateForm();
        }
    }
    onSubmit() {
        this.submitted = true;
        if (this.validateForm()) {
            if (!this.matchPassword()) {
                this.formErrors.rePassword = 'Mật khẩu không khớp';
                return;
            }
            const dataUser = {
                userName: this.formAddUser.value.userName,
                email: this.formAddUser.value.email,
                lastName: this.formAddUser.value.lastName,
                firstName: this.formAddUser.value.firstName,
                password: this.formAddUser.value.password,
                departmentId: this.formAddUser.value.departmentId ? this.formAddUser.value.departmentId : 0,
                levelId: this.formAddUser.value.levelId ? this.formAddUser.value.levelId : 0,
                userGroupId: this.formAddUser.value.userGroupId ? this.formAddUser.value.userGroupId : 0,
                isActive: this.formAddUser.value.isActive,
                phoneNumber: this.formAddUser.value.phoneNumber,
                address: this.formAddUser.value.address,
            };
            console.log('AddUser', dataUser);
            this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
                const message = 'Thêm người dùng thành công';
                this.router.navigate([`/management-user/group-user/manage-user-list/manage-user`]);
                this.alertService.success(message);
            },
                err => {
                    console.log('massage-massage-massage', JSON.parse(err._body).errorMessage);
                    if (JSON.parse(err._body).errorMessage === 'Tên đăng nhập của bạn trùng với tên đăng nhập của nhân viên khác!') {
                        this.formErrors.userName = 'Tên đăng nhập trùng với tên đăng nhập của nhân viên khác!';
                    }
                });
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.userForm,
            this.formErrors,
        );
        return this.invalidMessages.length === 0;
    }
    matchPassword() {
        const newPassword = this.formAddUser.get('password').value;
        const confirmPassword = this.formAddUser.get('rePassword').value;
        return newPassword === confirmPassword;
    }

}
