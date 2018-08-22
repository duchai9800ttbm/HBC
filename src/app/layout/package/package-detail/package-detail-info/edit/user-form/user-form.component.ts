import { Component, OnInit, EventEmitter, Output, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserModel } from '../../../../../../shared/models/user/user.model';
import { DictionaryItem, DictionaryItemIdString } from '../../../../../../shared/models';
// tslint:disable-next-line:import-blacklist
import { Observable } from 'rxjs';
import { DepartmentsFormBranches } from '../../../../../../shared/models/user/departments-from-branches';
import { Levels } from '../../../../../../shared/models/user/levels';
import { GroupUserModel } from '../../../../../../shared/models/user/group-user.model';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { GroupUserService } from '../../../../../../shared/services/group-user.service';
import { Router } from '@angular/router';
import { PackageService } from '../../../../../../shared/services/package.service';
import { DataService, UserService, AlertService } from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';

@Component({
    selector: 'app-user-form',
    templateUrl: './user-form.component.html',
    styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent implements OnInit {
    @Output() closed = new EventEmitter<boolean>();
    @Output() returnNewUserId = new EventEmitter<number>();
    userForm: FormGroup;
    formErrors = {
        userName: '',
        email: '',
        firstName: '',
        lastName: '',
        userGroupId: '',
        departmentId: '',
        password: '',
        rePassword: '',
        phoneNumber: ''
    };
    invalidMessages: string[];
    isError;
    hidePopup = false;
    user = new UserModel();
    submitted = false;
    isCollapsedUser = false;
    isCollapsedUserInfo = false;
    dataGroupUser: DictionaryItem[];
    departments: Observable<DepartmentsFormBranches[]>;
    positions: Observable<Levels[]>;
    public selectPosition: number = null;
    public selectedGroup: number = null;
    public selectedDepartmaent: number = null;
    groupUserModel: GroupUserModel;
    userId: number;
    password: string;
    confirmPass: string;
    isValid = false;
    apiError: string;
    modalRef: BsModalRef;
    GroupCreate;
    submittedCreateGroup: boolean;
    listPrivilegesData: DictionaryItemIdString[];
    arayChangeprivilegesTemp = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
    };
    arayChangeprivilegesTempNot = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
    };
    showPopupAddGroupUser = false;
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
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private modalService: BsModalService,
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
        this.dataService.getListPrivileges().subscribe(response => {
            this.listPrivilegesData = response;
        });
        this.groupUserModel = {
            id: null,
            userName: '',
            email: '',
            lastName: '',
            firstName: '',
            rePassword: '',
            password: '',
            departmentId: '',
            levelId: '',
            userGroupId: '',
            isActive: null,
            phoneNumber: null,
            address: '',
        };

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
    get addUser() { return this.userForm.controls; }
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
                userName: this.userForm.value.userName,
                email: this.userForm.value.email,
                lastName: this.userForm.value.lastName,
                firstName: this.userForm.value.firstName,
                password: this.userForm.value.password,
                departmentId: this.userForm.value.departmentId ? this.userForm.value.departmentId : 0,
                levelId: this.userForm.value.levelId ? this.userForm.value.levelId : 0,
                userGroupId: this.userForm.value.userGroupId ? this.userForm.value.userGroupId : 0,
                isActive: this.userForm.value.isActive,
                phoneNumber: this.userForm.value.phoneNumber,
                address: this.userForm.value.address,
            };
            this.groupUserService.createOrUpdateUser(dataUser).subscribe(data => {
                const newUser = data;
                this.returnNewUserId.emit(newUser.employeeId);
                this.closedPopup();
            },
                err => {
                    if (JSON.parse(err._body).errorMessage === 'Tên đăng nhập của bạn trùng với tên đăng nhập của nhân viên khác!') {
                        this.formErrors.userName = 'Tên đăng nhập trùng với tên đăng nhập của nhân viên khác!';
                    }
                });
        }
    }
    closedPopup() {
        this.close();
        this.hidePopup = true;
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.userForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }
    matchPassword() {
        const newPassword = this.userForm.get('password').value;
        const confirmPassword = this.userForm.get('rePassword').value;
        return newPassword === confirmPassword;
    }
    openModalCreateGroupUser(template: TemplateRef<any>) {
        this.isError = false;
        this.GroupCreate = {
            name: null,
            description: '',
            privileges: [],
            isActive: true,
            notPrivileges: this.listPrivilegesData,
        };
        this.modalRef = this.modalService.show(template, {
            class: 'gray modal-lg'
        });

    }
    selectAllPrivilegesEditUse() {
        this.GroupCreate.notPrivileges = [];
        this.GroupCreate.privileges = this.listPrivilegesData.filter(x => x);
    }

    selectAllPrivilegesEditNotUse() {
        this.GroupCreate.privileges = [];
        this.GroupCreate.notPrivileges = this.listPrivilegesData.filter(x => x);
    }
    changePrivilegesEditNotUse() {
        if (this.arayChangeprivilegesTemp.point === true) {
            this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => this.GroupCreate.privileges.push(i));
            const toStringElement = this.GroupCreate.privileges.map(i => JSON.stringify(i));
            const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
            const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
            this.GroupCreate.notPrivileges = stringFilter.map(i => JSON.parse(i));
            this.arayChangeprivilegesTemp = {
                point: false,
                idGroupCurrent: null,
                arayChangeprivileges: [],
            };
        }
    }
    selectEachFieldEditNotUser(event) {
        this.arayChangeprivilegesTemp.arayChangeprivileges = [];
        for (let i = 1; i <= event.target.length; i++) {
            if (event.target[i - 1].selected === true) {
                const object = {
                    id: event.target[i - 1].value,
                    text: event.target[i - 1].text,
                };
                this.arayChangeprivilegesTemp.arayChangeprivileges.push(object);
            }
        }
        this.arayChangeprivilegesTemp.point = true;
        this.arayChangeprivilegesTempNot.point = false;
    }

    selectEachFieldEditUser(event) {
        this.arayChangeprivilegesTempNot.arayChangeprivileges = [];
        for (let i = 1; i <= event.target.length; i++) {
            if (event.target[i - 1].selected === true) {
                const object = {
                    id: event.target[i - 1].value,
                    text: event.target[i - 1].text,
                };
                this.arayChangeprivilegesTempNot.arayChangeprivileges.push(object);
            }
        }
        this.arayChangeprivilegesTempNot.point = true;
        this.arayChangeprivilegesTemp.point = false;
    }

    changePrivilegesEditUse() {
        if (this.arayChangeprivilegesTempNot.point === true) {
            this.arayChangeprivilegesTempNot.arayChangeprivileges.forEach(i => this.GroupCreate.notPrivileges.push(i));
            const toStringElement = this.GroupCreate.notPrivileges.map(i => JSON.stringify(i));
            const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
            const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
            this.GroupCreate.privileges = stringFilter.map(i => JSON.parse(i));
            this.arayChangeprivilegesTempNot = {
                point: false,
                idGroupCurrent: null,
                arayChangeprivileges: [],
            };
        }
    }
    closedPopupGroupUser() {
        this.submittedCreateGroup = false;
        this.modalRef.hide();
        this.hidePopup = true;
    }

    addGroupUser() {
        this.submittedCreateGroup = true;
        if (this.GroupCreate.name) {
            this.GroupCreate.userGroupName = this.GroupCreate.name;
            this.spinner.show();
            this.groupUserService.createGroupUser(this.GroupCreate).subscribe(response => {
                // this.groupUserService.listGroupUser(this.pagedResult.currentPage, this.pagedResult.pageSize)
                //   .subscribe(responsepageResultUserGroup => {
                //     this.pagedResult = responsepageResultUserGroup;
                //     this.listGroupUser = this.pagedResult.items.map(i => i);
                //     this.modalRef.hide();
                //     this.alertService.success('Thêm nhóm người dùng thành công!');
                //   });
                this.modalRef.hide();
                this.alertService.success('Thêm nhóm người dùng thành công!');
                this.groupUserService.getListAllGroupUser().subscribe(element => {
                    this.dataGroupUser = element.map(i => {
                        return {
                            id: i.id,
                            text: i.name,
                        };
                    });
                });
                this.groupUserService.getListAllGroupUser().subscribe(e => {
                    const groupnew = e.filter(k => k.name === this.GroupCreate.name)[0];
                    this.userForm.get('userGroupId').patchValue(groupnew.id);
                    this.spinner.hide();
                });
            },
                err => {
                    const error = err.json();
                    if (error.errorCode === 'BusinessException') {
                        this.isError = true;
                    } else {
                        this.modalRef.hide();
                        this.alertService.error('Đã xảy ra lỗi. Thêm nhóm người dùng không thành công!');
                    }

                });
            this.submitted = false;
        }
    }

    createGroupUser() {
        this.showPopupAddGroupUser = true;
        this.hidePopup = true;
        console.log(this.hidePopup);
    }

    closePopupGroupUser(agreed: boolean) {
        this.showPopupAddGroupUser = false;
        this.hidePopup = false;
        // if (agreed) {
        //     const message = 'Nhóm người dùng đã được tạo.';
        //     this.alertService.success(message);

        // }
    }
    mapNewGroup(id) {
        this.groupUserService.getListAllGroupUser().subscribe(element => {
            this.dataGroupUser = element.map(i => {
                return {
                    id: i.id,
                    text: i.name,
                };
            });
            this.userForm.get('userGroupId').patchValue(id);
        });
    }
}
