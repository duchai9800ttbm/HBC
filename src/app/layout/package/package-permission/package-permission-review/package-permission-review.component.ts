import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { Subject, Observable } from '../../../../../../node_modules/rxjs';
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
import { BidPermissionResponsive } from '../../../../shared/models/api-response/setting/bid-permission-responsive';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-package-permission-review',
    templateUrl: './package-permission-review.component.html',
    styleUrls: ['./package-permission-review.component.scss']
})
export class PackagePermissionReviewComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;
    packageId: number;
    listBidPermissionUserGroup: {
        type: string,
        list: BidPermissionUserGroupResponsive[]
    }[] = [];
    listFormData: BidPermissionGroupResponsive[];
    listBidGroupUser: BidGroupUserResponsive[];

    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private dataService: DataService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        this.spinner.show();
        this.packageId = PackagePermissionComponent.packageId;
        this.dataService.getListBidUserGroup().subscribe(data => {
            this.listBidGroupUser = data;
        });
        this.packageService.getBidPermissionGroupByStage(this.packageId, SETTING_BID_STAGE.Hsmt).subscribe(data => {
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
        console.log(this.packagePermissionReviewForm.value);
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
        formArrayControl.push(formArrayItem);
    }

    addFormArrayUserItem(formData, user): FormControl {
        return this.fb.control(formData.bidUserGroupPermissions
            .find(item => item.userGroupName === user.userGroupName) ? true : false);
    }

    removeFormItem(formData, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        formArrayControl.removeAt(idx);
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
                        item.userGroupIdentitys.push({bidUserGroupId: user['userName']});
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
}
