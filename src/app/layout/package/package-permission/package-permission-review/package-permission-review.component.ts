import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import {
    FormGroup,
    FormBuilder,
    FormArray,
    FormControl
} from '../../../../../../node_modules/@angular/forms';
import { PackageService } from '../../../../shared/services/package.service';
import { PackagePermissionComponent } from '../package-permission.component';
import { SETTING_BID_STAGE } from '../../../../shared/configs/common.config';
import { BidPermissionUserGroupResponsive } from '../../../../shared/models/api-response/user/group-user/bid-permission-user-group-responsive';
import { DataService, AlertService } from '../../../../shared/services';
import { BidGroupUserResponsive } from '../../../../shared/models/api-response/user/group-user/bid-group-user-responsive';
import { BidPermissionGroupResponsive } from '../../../../shared/models/api-response/setting/bid-permission-group-responsive';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { forkJoin } from '../../../../../../node_modules/rxjs/observable/forkJoin';
import { BidUserGroupMemberResponsive } from '../../../../shared/models/api-response/setting/bid-user-group-member-responsive';

@Component({
    selector: 'app-package-permission-review',
    templateUrl: './package-permission-review.component.html',
    styleUrls: ['./package-permission-review.component.scss']
})
export class PackagePermissionReviewComponent implements OnInit {
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;
    packageId: number;
    listBidPermissionUserGroup: {
        type: string,
        list: BidPermissionUserGroupResponsive[]
    }[] = [];
    listFormData: BidPermissionGroupResponsive[];
    listBidGroupUser: BidGroupUserResponsive[];
    listBidUserGroupMember: BidUserGroupMemberResponsive[];
    checkAllHSMT = true;
    userNameChoosed = [];
    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private dataService: DataService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.packageId = PackagePermissionComponent.packageId;
        forkJoin(
            this.packageService.getBidGroupMembers(this.packageId, 'bidusergroupmembers'),
            this.dataService.getListBidUserGroup(),
            this.packageService.getBidPermissionGroupByStage(this.packageId, SETTING_BID_STAGE.Hsmt),
        )
            .subscribe(([listBidUserGroupMember, listBidGroupUser, data]) => {
                this.listBidUserGroupMember = listBidUserGroupMember;
                this.listBidGroupUser = listBidGroupUser;
                // data
                data.forEach(e => {
                    const listItem = {
                        type: e.bidPermissionGroupName,
                        list: []
                    };
                    e.bidPermissions.forEach(i => {
                        i.bidUserGroupPermissions.forEach(user => {
                            if (!listItem.list.find(item => item.userGroupDesc === user.userGroupDesc)) {
                                listItem.list.push(user);
                            }
                        });
                    });
                    this.listBidPermissionUserGroup.push(listItem);
                });
                this.listFormData = data;
                this.createForms(data);
                this.hiddenUserName();
                this.spinner.hide();
            });
    }

    createForms(formData: any[]) {
        this.packagePermissionReviewForm = this.fb.group({});
        formData.forEach(e => {
            this.packagePermissionReviewForm.addControl(e.bidPermissionGroupName, this.addFormControl(e));
            const listData = this.listBidPermissionUserGroup.find(i => i.type === e.bidPermissionGroupName);
            if (listData.list.length > 0) {
                listData.list.forEach(user => {
                    this.addFormArrayItem(e, user);
                });
            } else {
                this.addFormArrayItem(e, {});
            }
        });
        setTimeout(_ => {
            this.runOnceThenDie();
        });
    }

    addFormControl(formData): FormGroup {
        return this.fb.group({
            id: formData.bidPermissionGroupId,
            name: formData.bidPermissionGroupDesc,
            permission: this.fb.array([])
        });
    }

    addFormArrayItem(formData, user) {
        const formArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        if (formArrayControl.value.length < this.listBidGroupUser.length) {
            const formArrayItem = this.fb.group({});
            formArrayItem.addControl('userName', this.fb.control(user.userGroupId));
            formData.bidPermissions.forEach(p => {
                formArrayItem
                    .addControl(
                        p.bidPermissionName,
                        this.addFormArrayUserItem(p, user));
            });

            formArrayItem.
                addControl('all',
                    this.fb.control(Object.values(formArrayItem.value).filter(x => x === true).length
                        === Object.values(formArrayItem.value).length - 1));

            formArrayControl.push(formArrayItem);
        }

    }

    addFormArrayUserItem(formData, user): FormControl {
        return this.fb.control(formData.bidUserGroupPermissions
            .find(item => item.userGroupName === user.userGroupName) ? true : false);
    }

    removeFormItem(formData, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        formArrayControl.removeAt(idx);
        this.hiddenUserName();
        // setTimeout(() => {
        //     this.dtTrigger.next();
        // });
    }

    onSubmit() {
        this.spinner.show();
        const formValue = this.packagePermissionReviewForm.value;
        const result = [];
        this.listFormData.forEach(pData => {
            pData.bidPermissions.forEach(permission => {
                const item = {
                    bidPermissionId: permission.bidPermissionId,
                    userGroupIdentitys: []
                };
                formValue[pData.bidPermissionGroupName]['permission'].forEach(user => {
                    if (user[permission.bidPermissionName] && user['userName']) {
                        item.userGroupIdentitys.push({ bidUserGroupId: user['userName'] });
                    }
                });
                // if (item.userGroupIdentitys.length > 0) {
                result.push(item);
                // }
            });
        });
        this.packageService.updateBidPermissionGroupByStage(this.packageId, result).subscribe(data => {
            this.spinner.hide();
            this.alertService.success('Phân quyền đánh giá hồ sơ mời thầu thành công!');
        }, err => {
            this.spinner.hide();
            this.alertService.error('Phân quyền đánh giá hồ sơ mời thầu thất bại!');
        });
    }

    checkAll(checked: boolean, name: string, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(name).get('permission') as FormArray;
        const formItemControl = formArrayControl.controls[idx] as FormGroup;
        // tslint:disable-next-line:forin
        for (const fControl in formItemControl.controls) {
            if (fControl !== 'userName') {
                formItemControl.get(fControl).patchValue(checked);
            }
        }
    }

    removeCheckAll(checked: boolean, name: string, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(name).get('permission') as FormArray;
        const formItemControl = formArrayControl.controls[idx] as FormGroup;
        if (!checked) { formItemControl.get('all').patchValue(checked); }
    }
    autoCheckAll(name: string, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(name).get('permission') as FormArray;
        const formItemControl = formArrayControl.controls[idx] as FormGroup;
        let arr = new Array();
        setTimeout(() => {
            for (const fControl in formItemControl.controls) {
                if (fControl !== 'userName' && fControl !== 'all') {
                    arr.push(formItemControl.get(fControl).value);
                }
            }
            if (arr.every(value => value === true)) {
                formItemControl.get('all').patchValue(true);
            }
        });
    }


    routeToPackageInfo() {
        return this.router.navigate([`/package/detail/${this.packageId}/`]);
    }
    hiddenUserName() {
        this.userNameChoosed = [];
        const formArrayControl = this.packagePermissionReviewForm.get('HSMT').get('permission') as FormArray;
        formArrayControl.controls.forEach(itemControl => {
            this.userNameChoosed.push(+itemControl.get('userName').value);
        });
    }

    checkAssignment(groupCheckId, i) {
        if (groupCheckId) {
            const isNotAssignment = (this.listBidUserGroupMember
                .find(item => item.groupName == this.listBidGroupUser
                    .find(group => group.id == groupCheckId).name) && this.listBidUserGroupMember
                        .find(item => item.groupName == this.listBidGroupUser
                            .find(group => group.id == groupCheckId).name).users.length === 0);

            const element = document.getElementById(`isCheckAssignment${i}`);
            if (isNotAssignment && element) {
                element.classList.add('d-show');
            }
            if (!isNotAssignment && element) {
                element.classList.remove('d-show');
            }
        }
    }
    runOnceThenDie() {
        const formArrayControl = this.packagePermissionReviewForm.get('HSMT').get('permission') as FormArray;
        formArrayControl.controls.forEach(itemControl => {
            for (let i = 0; i <= this.listBidGroupUser.length; i++) {
                this.checkAssignment(itemControl.get('userName').value, i);
            }
        });
    }
}
