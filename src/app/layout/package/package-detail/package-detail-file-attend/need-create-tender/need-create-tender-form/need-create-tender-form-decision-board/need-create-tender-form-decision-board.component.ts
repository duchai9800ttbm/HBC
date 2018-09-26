import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import * as moment from 'moment';
import { PackageService } from '../../../../../../../shared/services/package.service';
import {
    AlertService,
    SessionService
} from '../../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../../../shared/constants/bid-status';

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
    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private sessionService: SessionService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        this.getPackageInfo();
        this.routerAction = this.packageService.routerAction;
        this.packageService.routerAction$.subscribe(
            router => (this.routerAction = router)
        );
        this.createForm();
        this.decisionBoardForm.valueChanges.subscribe(data =>
            this.mappingToLiveFormData(data)
        );
    }

    createForm() {
        const formData =
            NeedCreateTenderFormComponent.formModel
                .decisionOfBoardOfGeneralDirector;
        const directorData =
            NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
        this.expectedTimeStr =
            directorData && directorData.expectedDate
                ? moment(directorData.expectedDate * 1000).format('DD/MM/YYYY')
                : '';
        this.decisionBoardForm = this.fb.group({
            isAgreed: formData ? formData.isAgreed : true,
            reason: formData ? formData.reason : '',
            isSigned: formData ? formData.isSigned : false,
            // tslint:disable-next-line:max-line-length
            expectedTime:
                directorData && directorData.expectedDate
                    ? DateTimeConvertHelper.fromTimestampToDtObject(
                          directorData.expectedDate * 1000
                      )
                    : null
        });
    }

    clickSigned() {
        this.decisionBoardForm.get('isSigned').patchValue(true);
        // khi view có thể ký
        if (this.routerAction === 'view') {
            this.onSubmit();
        }
    }

    mappingToLiveFormData(data) {
        NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector = data;
        const directorData =
            NeedCreateTenderFormComponent.formModel.tenderDirectorProposal;
        // tslint:disable-next-line:max-line-length
        NeedCreateTenderFormComponent.formModel.decisionOfBoardOfGeneralDirector.expectedTime =
            directorData && directorData.expectedDate
                ? directorData.expectedDate
                : 0;
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

    getPackageInfo() {
        this.packageService
          .getInforPackageID(this.bidOpportunityId)
          .subscribe(data => {
            this.packageInfo = data;
            console.log(this.packageInfo.stageStatus.id);
          });
      }
}
