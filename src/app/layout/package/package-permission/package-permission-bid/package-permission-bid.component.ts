import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { PackageService } from '../../../../shared/services/package.service';
import { DataService, AlertService } from '../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { BidGroupUserResponsive } from '../../../../shared/models/api-response/user/group-user/bid-group-user-responsive';
import { BidPermissionUserGroupResponsive } from '../../../../shared/models/api-response/user/group-user/bid-permission-user-group-responsive';
import { BidPermissionGroupResponsive } from '../../../../shared/models/api-response/setting/bid-permission-group-responsive';
import { PackagePermissionComponent } from '../package-permission.component';
import { SETTING_BID_STAGE } from '../../../../shared/configs/common.config';
import { DictionaryItem } from '../../../../shared/models';

@Component({
    selector: 'app-package-permission-bid',
    templateUrl: './package-permission-bid.component.html',
    styleUrls: ['./package-permission-bid.component.scss']
})
export class PackagePermissionBidComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    packagePermissionReviewForm: FormGroup;
    packageId: number;
    listBidGroupUser: BidGroupUserResponsive[];
    listBidPermissionUserGroup: {
        type: string;
        list: BidPermissionUserGroupResponsive[];
    }[] = [];
    listFormData: BidPermissionGroupResponsive[];
    listDocumentType: DictionaryItem[];
    listFormDocumentType: any[];

    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private dataService: DataService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.spinner.show();
        this.packageId = PackagePermissionComponent.packageId;
        this.dataService.getListBidUserGroup().subscribe(data => {
            this.listBidGroupUser = data;
        });
        this.dataService.getListTenderDocumentType().subscribe(data => {
            this.listDocumentType = data;
        });
        this.packageService
            .getBidPermissionGroupByStage(
                this.packageId,
                SETTING_BID_STAGE.Hsdt
            )
            .subscribe(data => {
                data.forEach(e => {
                    const listItem = {
                        type: e.bidPermissionGroupName,
                        list: []
                    };
                    e.bidPermissions.forEach(i => {
                        i.bidUserGroupPermissions.forEach(user => {
                            user.allDocumentTypes = [];
                            if (
                                !listItem.list.find(
                                    item =>
                                        item.userGroupDesc ===
                                        user.userGroupDesc
                                )
                            ) {
                                listItem.list.push(user);
                            }
                            user.documentTypes.forEach(doc => {
                                const userOfList = listItem.list.find(li => li.userGroupId === user.userGroupId);
                                if (!userOfList.allDocumentTypes.find(dt => dt.key === doc.key)) {
                                    userOfList.allDocumentTypes.push(doc);
                                }
                            });
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
            this.packagePermissionReviewForm.addControl(
                e.bidPermissionGroupName,
                this.addFormControl(e)
            );
            const listData = this.listBidPermissionUserGroup.find(
                i => i.type === e.bidPermissionGroupName
            );
            if (listData.list.length > 0) {
                listData.list.forEach(user => {
                    e.bidPermissionGroupName !== 'LapHoSoDuThau'
                        ? this.addFormArrayItem(e, user)
                        : this.addFormArrayBidItem(e, user);
                });
            } else {
                e.bidPermissionGroupName !== 'LapHoSoDuThau'
                    ? this.addFormArrayItem(e, {})
                    : this.addFormArrayBidItem(e, {});
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
        const formArrayControl = this.packagePermissionReviewForm
            .get(formData.bidPermissionGroupName)
            .get('permission') as FormArray;
        const formArrayItem = this.fb.group({});
        formArrayItem.addControl('userName', this.fb.control(user.userGroupId));
        formData.bidPermissions.forEach(p => {
            formArrayItem.addControl(
                p.bidPermissionName,
                this.addFormArrayUserItem(p, user)
            );
        });
        formArrayControl.push(formArrayItem);
    }

    addFormArrayUserItem(formData, user): FormControl {
        return this.fb.control(
            formData.bidUserGroupPermissions.find(
                item => item.userGroupName === user.userGroupName
            )
                ? true
                : false
        );
    }

    addFormArrayBidDocumentItem(formData, user, document): FormControl {
        return this.fb.control(
            formData.bidUserGroupPermissions.find(
                item => item.userGroupName === user.userGroupName && item.documentTypes.find(t => t.key == document.key)
            )
                ? true
                : false
        );
    }

    addFormArrayBidItem(formData, user) {
        const formArrayControl = this.packagePermissionReviewForm
            .get(formData.bidPermissionGroupName)
            .get('permission') as FormArray;
        const arrayItem = [];
        if (user.documentTypes && user.documentTypes.length > 0) {
            user.allDocumentTypes.forEach(document => {
                const item = this.createFormArrayDocumentTypeItem(formData, user, document);
                arrayItem.push(item);
            });
        } else {
            const item = this.createFormArrayDocumentTypeItem(formData, {}, {});
                arrayItem.push(item);
        }
        const formArrayItem = this.fb.group({});
        formArrayItem.addControl('userName', this.fb.control(user.userGroupId));
        formArrayItem.addControl('documentTypes', this.fb.array(arrayItem));
        formArrayControl.push(formArrayItem);
    }

    createFormArrayDocumentTypeItem(formData, user, document): FormGroup {
        const formArrayItem = this.fb.group({});
        formArrayItem.addControl('documentId', this.fb.control(document.key));
        formArrayItem.addControl('userName', this.fb.control(user.userGroupId));
        formData.bidPermissions.forEach(p => {
            formArrayItem.addControl(
                p.bidPermissionName,
                this.addFormArrayBidDocumentItem(p, user, document)
            );
        });
        return formArrayItem;
    }

    addFormArrayDocumentTypeItem(formData, index) {
        const formArrayControl = this.packagePermissionReviewForm
            .get(formData.bidPermissionGroupName)
            .get('permission') as FormArray;
        const documentArrayControl = formArrayControl.controls[index].get('documentTypes') as FormArray;
        const formArrayItem = this.createFormArrayDocumentTypeItem(formData, {}, {});
        documentArrayControl.push(formArrayItem);
    }

    removeFormItem(formData, idx: number) {
        const formArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        formArrayControl.removeAt(idx);
        setTimeout(() => {
          this.dtTrigger.next();
        });
    }

    removeFormBidItem(formData, parentIndex: number, childIndex: number) {
        const parentArrayControl = this.packagePermissionReviewForm.get(formData.bidPermissionGroupName).get('permission') as FormArray;
        const childArrayControl = parentArrayControl.controls[parentIndex].get('documentTypes') as FormArray;
        childArrayControl.removeAt(childIndex);
        setTimeout(() => {
            this.dtTrigger.next();
          });
    }

    onSubmit() {
        this.spinner.show();
        const formValue = this.customUpdateFormValue(this.packagePermissionReviewForm.value);
        const result = [];
        this.listFormData.forEach(pData => {
            pData.bidPermissions.forEach(permission => {
                const item = {
                    bidPermissionId: permission.bidPermissionId,
                    userGroupIdentitys: []
                };
                formValue[pData.bidPermissionGroupName]['permission'].forEach(
                    user => {
                        if (pData.bidPermissionGroupName === 'LapHoSoDuThau') {
                            const dataItem = {
                                bidUserGroupId: user.userName,
                                documentTypeIds: []
                            };
                            user.documentTypes.forEach(t => {
                                if (t[permission.bidPermissionName]) {
                                    if (t.userName) {
                                        dataItem.bidUserGroupId = Number(t.userName);
                                    }
                                    dataItem.documentTypeIds.push(Number(t.documentId));
                                }
                            });
                            if (dataItem.documentTypeIds.length > 0) {
                                item.userGroupIdentitys.push(dataItem);
                            }
                        } else {
                            if (
                                user[permission.bidPermissionName] &&
                                user['userName']
                            ) {
                                item.userGroupIdentitys.push({
                                    bidUserGroupId: user['userName']
                                });
                            }
                        }
                    }
                );
                result.push(item);
            });
        });
        this.packageService
            .updateBidPermissionGroupByStage(this.packageId, result)
            .subscribe(
                data => {
                    this.spinner.hide();
                    this.alertService.success(
                        'Phân quyền quản lý hồ sơ dự thầu thành công!'
                    );
                },
                err => {
                    this.spinner.hide();
                    this.alertService.error(
                        'Phân quyền quản lý hồ sơ dự thầu thất bại!'
                    );
                }
            );
    }

    customUpdateFormValue(formData) {
        formData.LapHoSoDuThau.permission.forEach(f => {
            f.documentTypes.forEach(t => {
                if (t.userName) {
                    f.userName = Number(t.userName);
                }
            });
        });
        return formData;
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

    checkAllBidItem(checked: boolean, parentIdx: number, childIdx: number) {
        const parentArrayControl = this.packagePermissionReviewForm.get('LapHoSoDuThau').get('permission') as FormArray;
        const childArrayControl = parentArrayControl.controls[parentIdx].get('documentTypes') as FormArray;
        const childGroupControl = childArrayControl.controls[childIdx] as FormGroup;
        for (const fControl in childGroupControl.controls) {
            if (fControl !== 'userName' && fControl !== 'documentId') {
                childGroupControl.get(fControl).patchValue(checked);
            }
        }
    }
}
