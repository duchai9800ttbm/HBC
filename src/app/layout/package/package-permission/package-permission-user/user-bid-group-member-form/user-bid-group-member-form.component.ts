import { Component, OnInit, Input, Output } from '@angular/core';
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

@Component({
    selector: 'app-user-bid-group-member-form',
    templateUrl: './user-bid-group-member-form.component.html',
    styleUrls: ['./user-bid-group-member-form.component.scss']
})
export class UserBidGroupMemberFormComponent implements OnInit {
    packagePermissionBidUserGroupForm: FormGroup;
    @Input()
    listUser: UserItemModel[];
    @Input()
    type: string;
    listBidUserGroupMember: BidUserGroupMemberResponsive[];
    packageId: number;
    constructor(
        private fb: FormBuilder,
        private userService: UserService,
        private dataService: DataService,
        private packageService: PackageService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService
    ) {}

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
            });
    }

    getDepartmentName(name: string, index: number, value: number) {
        const formArray = this.packagePermissionBidUserGroupForm.get(name).get('users') as FormArray;
        const formGroup = formArray.controls[index] as FormGroup;
        // tslint:disable-next-line:triple-equals
        formGroup.get('department').patchValue(this.listUser.find(i => i.id == value).department.value);
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
                    this.addFormItem(
                        e.groupName,
                        item.id,
                        item.department.value
                    );
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

    removeFormItem(name: string, idx: number) {
        const attachedArray = this.packagePermissionBidUserGroupForm
            .get(name)
            .get('users') as FormArray;
        attachedArray.removeAt(idx);
    }
}
