import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { PackageService } from '../../../../../../../shared/services/package.service';
import {
    AlertService,
    SessionService
} from '../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../../../shared/constants/bid-status';
import { StatusObservableHsdtService } from '../../../../../../../shared/services/status-observable-hsdt.service';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

@Component({
    selector: 'app-need-create-tender-form-decision-board',
    templateUrl: './need-create-tender-form-decision-board.component.html',
    styleUrls: ['./need-create-tender-form-decision-board.component.scss']
})
export class NeedCreateTenderFormDecisionBoardComponent implements OnInit {
    routerAction: string;
    decisionBoardForm: FormGroup;
    expectedTimeStr;
    bidOpportunityId = PackageDetailComponent.packageId;
    packageInfo: PackageInfoModel;
    bidStatus = BidStatus;
    isDirector = false;
    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private sessionService: SessionService,
        private alertService: AlertService,
        private statusObservableHsdtService: StatusObservableHsdtService,
        private router: Router
    ) { }

    ngOnInit() {
        this.getPackageInfo();
        // this.packageService
        //     .getInforPackageID(this.bidOpportunityId)
        //     .switchMap(data => {
        //         this.packageInfo = data;
        //         return
        //     });
        this.isDirector = (this.sessionService.currentUserInfo && this.sessionService.currentUserInfo.department
            && this.sessionService.currentUserInfo.department.text === 'BAN TỔNG GIÁM ĐỐC');
        this.routerAction = this.packageService.routerAction;
        this.packageService.routerAction$.subscribe(router => {
            this.routerAction = router;
            this.createForm();
            // if (this.decisionBoardForm && (!this.isDirector
            //     || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
            //     || this.decisionBoardForm.get('isSigned').value)) {
            //     this.decisionBoardForm.disable();
            // }
            if (this.decisionBoardForm) {
                this.decisionBoardForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
            }
        });
        this.packageService.dataProposals$.subscribe(value => {
            this.createForm();
            // if (this.decisionBoardForm && (!this.isDirector
            //     || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
            //     || this.decisionBoardForm.get('isSigned').value)) {
            //     this.decisionBoardForm.disable();
            // }
            if (this.decisionBoardForm) {
                this.decisionBoardForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
            }
        });
    }

    createForm() {
        if (NeedCreateTenderFormComponent.formModel) {
            const formData =
                NeedCreateTenderFormComponent.formModel ?
                    NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector : null;
            const directorData =
                NeedCreateTenderFormComponent.formModel ? NeedCreateTenderFormComponent.formModel.tenderDirectorProposal : null;
            this.expectedTimeStr = (directorData && directorData.expectedDate) ? directorData.expectedDate : null;
            this.decisionBoardForm = this.fb.group({
                isAgreed: {
                    value: formData ? formData.isAgreed : true,
                    disabled: this.decisionBoardForm && (!this.isDirector
                        || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
                        || this.decisionBoardForm.get('isSigned').value)
                },
                reason: {
                    value: formData ? formData.reason : '',
                    disabled: this.decisionBoardForm && (!this.isDirector
                        || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
                        || this.decisionBoardForm.get('isSigned').value)
                },
                isSigned: {
                    value: formData ? formData.isSigned : false,
                    disabled: this.decisionBoardForm && (!this.isDirector
                        || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
                        || this.decisionBoardForm.get('isSigned').value)
                },
                // tslint:disable-next-line:max-line-length
                expectedTime: {
                    value: directorData && directorData.expectedDate
                        ? DateTimeConvertHelper.fromTimestampToDtObject(
                            directorData.expectedDate * 1000
                        )
                        : null,
                    disabled: this.decisionBoardForm && (!this.isDirector
                        || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
                        || this.decisionBoardForm.get('isSigned').value)
                }
            });
        }
    }

    clickSigned() {
        this.decisionBoardForm.get('isSigned').patchValue(true);
        this.decisionBoardForm.disable();
        // khi view có thể ký
        if (this.routerAction === 'view') {
            if (this.decisionBoardForm.get('isAgreed').value) {
                if (NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isAgreed) {
                    this.approveBidProposal('Xác nhận tham gia dự thầu thành công!', 'Xác nhận tham gia dự thầu không thành công!');
                } else {
                    this.approveBidProposal('Từ chối tham gia dự thầu thành công!', 'Từ chối tham gia dự thầu không thành công!');
                }
            } else {
                if (NeedCreateTenderFormComponent.formModel.tenderDirectorProposal.isAgreed) {
                    this.notApproveBidProposal('Từ chối tham gia dự thầu thành công!', 'Từ chối tham gia dự thầu không thành công!');
                } else {
                    this.notApproveBidProposal('Xác nhận tham gia dự thầu thành công!', 'Xác nhận tham gia dự thầu không thành công!');
                }
            }
        }
    }

    approveBidProposal(message: string, messageErr: string) {
        this.packageService.approveBidProposal(this.bidOpportunityId, this.decisionBoardForm.get('reason').value)
            .subscribe(data => {
                this.statusObservableHsdtService.change();
                this.alertService.success(message);
                this.getPackageInfo();
            }, err => {
                this.alertService.error(messageErr);

            });
    }

    notApproveBidProposal(message: string, messageErr: string) {
        this.packageService.notApproveBidProposal(this.bidOpportunityId, this.decisionBoardForm.get('reason').value)
            .subscribe(data => {
                this.statusObservableHsdtService.change();
                this.alertService.success(message);
                this.getPackageInfo();
            }, err => {
                this.alertService.error(messageErr);
            });
    }

    mappingToLiveFormData(data) {
        if (NeedCreateTenderFormComponent.formModel) {
            NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector = data;
            const directorData =
                NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
            // tslint:disable-next-line:max-line-length
            NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector.expectedTime =
                directorData && directorData.expectedDate
                    ? directorData.expectedDate
                    : 0;
        }
    }

    onSubmit() {
        if (NeedCreateTenderFormComponent.formModel.createdEmployeeId) {
            NeedCreateTenderFormComponent.formModel.updatedEmployeeId = this.sessionService.currentUser.employeeId;
        } else {
            NeedCreateTenderFormComponent.formModel.createdEmployeeId = this.sessionService.currentUser.employeeId;
        }
        this.packageService
            .createOrUpdateProposedTenderParticipateReport(
                NeedCreateTenderFormComponent.formModel
            )
            .subscribe(
                data => {
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
                }
            );
    }

    getPackageInfo() {
        this.packageService
            .getInforPackageID(this.bidOpportunityId)
            .subscribe(data => {
                this.packageInfo = data;
                if (this.decisionBoardForm && (!this.isDirector
                    || !(this.packageInfo && this.packageInfo.stageStatus.id === this.bidStatus.ChoDuyetDeNghiDuThau)
                    || this.decisionBoardForm.get('isSigned').value)) {
                    this.decisionBoardForm.disable();
                }
            });
    }

    routerLink(event, link) {
        if (event.key === 'Enter') {
            this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
        }
    }
}
