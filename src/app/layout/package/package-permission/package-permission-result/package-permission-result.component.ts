import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { DataService, AlertService } from '../../../../shared/services';
import { PackageService } from '../../../../shared/services/package.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackagePermissionComponent } from '../package-permission.component';
import { SETTING_BID_STAGE } from '../../../../shared/configs/common.config';
import { BidGroupUserResponsive } from '../../../../shared/models/api-response/user/group-user/bid-group-user-responsive';
import { BidPermissionGroupResponsive } from '../../../../shared/models/api-response/setting/bid-permission-group-responsive';
import { BidPermissionUserGroupResponsive } from '../../../../shared/models/api-response/user/group-user/bid-permission-user-group-responsive';
import { Router } from '@angular/router';

@Component({
    selector: 'app-package-permission-result',
    templateUrl: './package-permission-result.component.html',
    styleUrls: ['./package-permission-result.component.scss']
})
export class PackagePermissionResultComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;
    packageId: number;
    listBidGroupUser: BidGroupUserResponsive[];
    listBidPermissionUserGroup: {
        type: string,
        list: BidPermissionUserGroupResponsive[]
    }[] = [];
    listFormData: BidPermissionGroupResponsive[];
    userNameKQDT = [];
    userNameHopDongKyKet = [];
    userNameHopKickOff = [];
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
        this.dataService.getListBidUserGroup().subscribe(data => {
            this.listBidGroupUser = data;
        });
        this.packageService.getBidPermissionGroupByStage(this.packageId, SETTING_BID_STAGE.Kqdt).subscribe(data => {
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
            this.hiddenUserNameKQDT();
            this.hiddenUserNameHopDongKyKet();
            this.hiddenUserNameHopKickOff();
            setTimeout(() => {
                this.dtTrigger.next();
            });
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

    addFormArrayUserItem(formData, user): FormControl {
        return this.fb.control(formData.bidUserGroupPermissions
            .find(item => item.userGroupName === user.userGroupName) ? true : false);
    }

    removeFormItem(formData, idx: number) {
        console.log('this.formData.bidPermissionGroupName', formData.bidPermissionGroupName);
        const formArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        formArrayControl.removeAt(idx);
        switch (formData.bidPermissionGroupName) {
            case 'KetQuaDuThau': {
                this.hiddenUserNameKQDT();
                break;
            }
            case 'HopDongKiKet': {
                this.hiddenUserNameHopDongKyKet();
                break;
            }
            case 'HopKickOff': {
                this.hiddenUserNameHopKickOff();
                break;
            }
        }
        setTimeout(() => {
            this.dtTrigger.next();
        });
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
            this.alertService.success('Phân quyền đánh giá kết quả dự thầu thành công!');
        }, err => {
            this.spinner.hide();
            this.alertService.error('Phân quyền đánh giá kết quả dự thầu thất bại!');
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
    routeToPackageInfo() {
        return this.router.navigate([`/package/detail/${this.packageId}/`]);
    }
    hiddenUserNameKQDT() {
        this.userNameKQDT = [];
        const formArrayControl = this.packagePermissionReviewForm.get('KetQuaDuThau').get('permission') as FormArray;
        formArrayControl.controls.forEach(itemControl => {
            this.userNameKQDT.push(+itemControl.get('userName').value);
        });
    }
    hiddenUserNameHopDongKyKet() {
        this.userNameHopDongKyKet = [];
        const formArrayControl = this.packagePermissionReviewForm.get('HopDongKiKet').get('permission') as FormArray;
        formArrayControl.controls.forEach(itemControl => {
            this.userNameHopDongKyKet.push(+itemControl.get('userName').value);
        });
    }
    hiddenUserNameHopKickOff() {
        this.userNameHopKickOff = [];
        const formArrayControl = this.packagePermissionReviewForm.get('HopKickOff').get('permission') as FormArray;
        formArrayControl.controls.forEach(itemControl => {
            this.userNameHopKickOff.push(+itemControl.get('userName').value);
        });
    }
}
