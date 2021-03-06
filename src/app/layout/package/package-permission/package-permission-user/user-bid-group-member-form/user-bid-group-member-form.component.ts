import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { DictionaryItem } from '../../../../../shared/models';
import { BidUserGroupMemberResponsive } from '../../../../../shared/models/api-response/setting/bid-user-group-member-responsive';
import {
    UserService,
    DataService,
    AlertService
} from '../../../../../shared/services';
import { PackageService } from '../../../../../shared/services/package.service';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { Observable } from 'rxjs';
import { PackagePermissionComponent } from '../../package-permission.component';
import { SETTING_BID_USER } from '../../../../../shared/configs/common.config';
import { NgxSpinnerService } from 'ngx-spinner';
import { slideToTop } from '../../../../../router.animations';
import { Router } from '@angular/router';

@Component({
    selector: 'app-user-bid-group-member-form',
    templateUrl: './user-bid-group-member-form.component.html',
    styleUrls: ['./user-bid-group-member-form.component.scss'],
    animations: [slideToTop()]
})
export class UserBidGroupMemberFormComponent implements OnInit {
    packagePermissionBidUserGroupForm: FormGroup;
    @Output() loadingMenber: EventEmitter<any> = new EventEmitter();
    @Input()
    listUser: UserItemModel[];
    @Input()
    type: string;
    listBidUserGroupMember: BidUserGroupMemberResponsive[];
    packageId: number;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private packageService: PackageService,
        private alertService: AlertService,
        private router: Router,
        private spinner: NgxSpinnerService
    ) { }

    ngOnInit() {
        this.packageId = PackagePermissionComponent.packageId;
        this.spinner.show();
        this.userService.getAllUser('').subscribe(data => {
            this.listUser = data;
        });
        this.packageService
            .getBidGroupMembers(this.packageId, this.type)
            .subscribe(data => {
                this.listBidUserGroupMember = data;
                this.createForm(data);
                this.spinner.hide();
                this.loadingMenber.emit(false);
            });
    }

    getDepartmentName(name: string, index: number, value: number) {
        const formArray = this.packagePermissionBidUserGroupForm.get(name).get('users') as FormArray;
        const formGroup = formArray.controls[index] as FormGroup;
        if (!isNaN(value)) {
            // tslint:disable-next-line:triple-equals
            const user = this.listUser.find(i => i.id == value);
            const department = user.department;
            if (department) {
                formGroup.get('department').patchValue(this.listUser.find(i => i.id == value).department.value);
            } else {
                formGroup.get('department').patchValue(null);

            }
        } else {
            formGroup.get('department').patchValue(null);
        }
    }

    onSubmit() {
        this.spinner.show();
        const data = this.getFormValue(
            this.packagePermissionBidUserGroupForm.value
        );
        this.packageService
            .updateBidGroupMembers(this.packageId, data)
            .subscribe(
                response => {
                    if (this.type === SETTING_BID_USER.GroupMember) {
                        this.alertService.success(
                            'Phân công người đảm nhận thành công'
                        );
                    } else {
                        this.alertService.success(
                            'Phân công các bên liên quan thành công'
                        );
                    }
                    this.spinner.hide();
                },
                err => {
                    this.spinner.hide();
                }
            );
    }

    getFormValue(formData) {
        const result = [];
        for (const control in formData) {
            if (formData[control].users.some(i => i.name)) {
                const data = formData[control];
                const resultItem = {
                    userGroupId: data.id,
                    userIds: []
                };
                data.users.forEach(i => {
                    if (i.name) {
                        resultItem.userIds.push(i.name);
                    }
                });
                result.push(resultItem);
            } else {
                const data = formData[control];
                const resultItem = {
                    userGroupId: data.id,
                    userIds: []
                };
                result.push(resultItem);
            }
        }
        return result;
    }

    createForm(data: BidUserGroupMemberResponsive[]) {
        this.packagePermissionBidUserGroupForm = this.fb.group({});
        data.forEach(e => {
            this.packagePermissionBidUserGroupForm.addControl(
                e.groupName,
                this.addFormControl(e)
            );
            if (e.users.length === 0) {
                this.addFormItem(e.groupName);
            } else {
                e.users.forEach(item => {
                    if (item.department) {
                        this.addFormItem(
                            e.groupName,
                            item.id,
                            item.department.value
                        );
                    } else {
                        this.addFormItemNoDepartment(e.groupName, item.id);
                    }

                });
            }
        });
    }

    addFormControl(data: BidUserGroupMemberResponsive) {
        const result = this.fb.group({
            id: data.id,
            name: data.groupName,
            users: this.fb.array([])
        });
        return result;
    }

    addFormItem(controlName: string, userName?, departmentName?): void {
        const formGroup = this.packagePermissionBidUserGroupForm.get(
            controlName
        ) as FormGroup;
        const formArray = formGroup.get('users') as FormArray;
        const item = this.fb.group({
            name: userName,
            department: departmentName
        });
        formArray.push(item);
    }

    addFormItemNoDepartment(controlName: string, userName?): void {
        const formGroup = this.packagePermissionBidUserGroupForm.get(
            controlName
        ) as FormGroup;
        const formArray = formGroup.get('users') as FormArray;
        const item = this.fb.group({
            name: userName,
            department: ''
        });
        formArray.push(item);
    }

    removeFormItem(name: string, idx: number) {
        const attachedArray = this.packagePermissionBidUserGroupForm
            .get(name)
            .get('users') as FormArray;
        attachedArray.removeAt(idx);
    }
    routeToPackageInfo() {
        return this.router.navigate([`/package/detail/${this.packageId}/`]);
    }
}
