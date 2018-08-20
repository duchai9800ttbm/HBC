import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { Router } from '@angular/router';
import { PackageService } from '../../../../../shared/services/package.service';
import { DataService, UserService, AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsModalService } from 'ngx-bootstrap';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { DictionaryItemIdString } from '../../../../../shared/models';

@Component({
    selector: 'app-group-user-form',
    templateUrl: './group-user-form.component.html',
    styleUrls: ['./group-user-form.component.scss']
})
export class GroupUserFormComponent implements OnInit {
    @Output() closePopupGroupUser = new EventEmitter<boolean>();
    @Output() returnNewGroupId = new EventEmitter<number>();
    groupUserForm: FormGroup;
    isSubmitted: boolean;
    invalidMessages: string[];
    submittedCreateGroup: boolean;
    arayChangeprivilegesTempNot = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
    };
    formErrors = {
    };
    listPrivilegesData: DictionaryItemIdString[];
    arayChangeprivilegesTemp = {
        point: false,
        idGroupCurrent: null,
        arayChangeprivileges: [],
    };
    showPopupAddGroupUser = false;
    isError = false;
    groupCreate = {
        name: null,
        description: '',
        privileges: [],
        isActive: true,
        notPrivileges: [],
    };


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

    public close() {
        this.closePopupGroupUser.emit(false);
    }

    ngOnInit() {
        this.createForm();
    }
    createForm() {
        this.dataService.getListPrivileges().subscribe(response => {
            this.listPrivilegesData = response;
            this.groupCreate = {
                name: null,
                description: '',
                privileges: [],
                isActive: true,
                notPrivileges: this.listPrivilegesData,
            };
        });
    }

    submitForm() {
        this.submittedCreateGroup = true;
        if (this.groupCreate.name) {
            this.spinner.show();
            this.groupUserService.createGroupUser(this.groupCreate).subscribe(response => {
                this.closedPopup();
                const userNew = response;
                this.returnNewGroupId.emit(userNew.id);
                this.alertService.success('Thêm nhóm người dùng thành công!');
            },
                err => {
                    const error = err.json();
                    if (error.errorCode === 'BusinessException') {
                        this.isError = true;
                    } else {
                        this.alertService.error('Đã xảy ra lỗi. Thêm nhóm người dùng không thành công!');
                    }

                });
        }
    }


    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.groupUserForm,
            this.formErrors,
        );
        return this.invalidMessages.length === 0;
    }
    closedPopup() {
        this.close();
        this.submittedCreateGroup = false;
        this.arayChangeprivilegesTempNot = {
            point: false,
            idGroupCurrent: null,
            arayChangeprivileges: [],
        };
        this.groupCreate = {
            name: null,
            description: '',
            privileges: [],
            isActive: true,
            notPrivileges: [],
        };
    }

    selectAllPrivilegesEditUse() {
        this.groupCreate.notPrivileges = [];
        this.groupCreate.privileges = this.listPrivilegesData.filter(x => x);
    }

    selectAllPrivilegesEditNotUse() {
        this.groupCreate.privileges = [];
        this.groupCreate.notPrivileges = this.listPrivilegesData.filter(x => x);
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

    changePrivilegesEditNotUse() {
        if (this.arayChangeprivilegesTemp.point === true) {
            this.arayChangeprivilegesTemp.arayChangeprivileges.forEach(i => this.groupCreate.privileges.push(i));
            const toStringElement = this.groupCreate.privileges.map(i => JSON.stringify(i));
            const toStringListPrivilegesData = this.listPrivilegesData.map(i => JSON.stringify(i));
            const stringFilter = toStringListPrivilegesData.filter(i => !toStringElement.includes(i));
            this.groupCreate.notPrivileges = stringFilter.map(i => JSON.parse(i));
            this.arayChangeprivilegesTemp = {
                point: false,
                idGroupCurrent: null,
                arayChangeprivileges: [],
            };
        }
    }
}
