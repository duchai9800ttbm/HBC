import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { SessionService, AlertService } from '../../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '../../../../../../../../../node_modules/@angular/router';
import { PermissionService } from '../../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../../shared/models/permission/permission.model';
import { Subscription } from '../../../../../../../../../node_modules/rxjs';

@Component({
    selector: 'app-need-create-tender-form-director-proposal',
    templateUrl: './need-create-tender-form-director-proposal.component.html',
    styleUrls: ['./need-create-tender-form-director-proposal.component.scss']
})
export class NeedCreateTenderFormDirectorProposalComponent implements OnInit, OnDestroy {
    routerAction: string;
    directorProposalForm: FormGroup;
    listPermission: Array<PermissionModel>;
    XacNhanKy = false;
    subscription: Subscription;
    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private sessionService: SessionService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService,
        private router: Router,
        private permissionService: PermissionService
    ) { }

    ngOnInit() {
        this.routerAction = this.packageService.routerAction;
        // phân quyền
        this.subscription = this.permissionService.get().subscribe(data => {
            this.listPermission = data;
            const hsdt = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
            if (hsdt) {
                const screen = hsdt.userPermissionDetails.length
                    && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'PhieuDeNghiDuThau')[0];
                if (screen) {
                    const listPermissionScreen = screen.permissions.map(z => z.value);
                    this.XacNhanKy = listPermissionScreen.includes('XacNhanKy');
                }
            }
        });
        this.packageService.routerAction$.subscribe(router => {
            this.routerAction = router;
            this.createForm();
            if (this.routerAction === 'view') {
                this.directorProposalForm.disable();
            }
            this.directorProposalForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
        });
        this.packageService.dataProposals$.subscribe(value => {
            this.createForm();
            this.directorProposalForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    createForm() {
        const formData = NeedCreateTenderFormComponent.formModel ?
            NeedCreateTenderFormComponent.formModel.tenderDirectorProposal : null;
        this.directorProposalForm = this.fb.group({
            isAgreedParticipating: NeedCreateTenderFormComponent.formModel ?
                NeedCreateTenderFormComponent.formModel.isAgreedParticipating : true,
            isAgreed: (formData && formData.isAgreed !== null) ? formData.isAgreed : true,
            reason: formData ? formData.reason : '',
            date: formData
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                    formData.date * 1000
                )
                : new Date(),
            expectedDate: formData
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                    formData.expectedDate * 1000
                )
                : new Date(),
            isSigned: formData ? formData.isSigned : false
        });
    }

    clickSigned() {
        this.directorProposalForm.get('isSigned').patchValue(true);
        // khi view có thể ký
        if (this.routerAction === 'view') {
            this.onSubmit();
        }
    }

    mappingToLiveFormData(data) {
        NeedCreateTenderFormComponent.formModel.tenderDirectorProposal = data;
        NeedCreateTenderFormComponent.formModel.isAgreedParticipating =
            data.isAgreedParticipating;
        // tslint:disable-next-line:max-line-length
        NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.date = DateTimeConvertHelper.fromDtObjectToSecon(
            data.date
        );
        NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.expectedDate = DateTimeConvertHelper.fromDtObjectToSecon(
            data.expectedDate
        );
        NeedCreateTenderFormComponent.formModel.isAgreedParticipating = data.isAgreed;
    }

    onSubmit() {
        // NeedCreateTenderFormComponent.formModel.isDraftVersion = isDraf;
        // NeedCreateTenderFormComponent.formModel.bidOpportunityId = this.bidOpportunityId;
        if (NeedCreateTenderFormComponent.formModel.createdEmployeeId) {
            NeedCreateTenderFormComponent.formModel.updatedEmployeeId = this.sessionService.currentUser.employeeId;
        } else {
            NeedCreateTenderFormComponent.formModel.createdEmployeeId = this.sessionService.currentUser.employeeId;
        }
        this.spinner.show();
        this.packageService
            .createOrUpdateProposedTenderParticipateReport(
                NeedCreateTenderFormComponent.formModel
            )
            .subscribe(
                data => {
                    this.spinner.hide();
                    if (NeedCreateTenderFormComponent.formModel.id) {
                        this.alertService.success(
                            'Cập nhật phiếu đề nghị dự thầu thành công!'
                        );
                    } else {
                        this.alertService.success(
                            'Tạo phiếu đề nghị dự thầu thành công!'
                        );
                    }
                },
                err => {
                    if (NeedCreateTenderFormComponent.formModel.id) {
                        this.alertService.error(
                            'Cập nhật phiếu đề nghị dự thầu thất bại!'
                        );
                    } else {
                        this.alertService.error(
                            'Tạo phiếu đề nghị dự thầu thất bại!'
                        );
                    }
                    this.spinner.hide();
                }
            );
    }

    routerLink(event, link) {
        if (event.key === 'Enter') {
            this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
        }
    }
}
