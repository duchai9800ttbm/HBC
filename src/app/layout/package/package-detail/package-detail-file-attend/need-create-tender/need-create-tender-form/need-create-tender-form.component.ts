import { Component, OnInit } from '@angular/core';
import { ProposeTenderParticipateRequest } from '../../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../../shared/services/package.service';
import {
    AlertService,
    SessionService
} from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-need-create-tender-form',
    templateUrl: './need-create-tender-form.component.html',
    styleUrls: ['./need-create-tender-form.component.scss']
})
export class NeedCreateTenderFormComponent implements OnInit {
    static formModel: ProposeTenderParticipateRequest;
    bidOpportunityId;
    packageInfo: PackageInfoModel;
    constructor(
        private packageService: PackageService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private sessionService: SessionService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        this.bidOpportunityId = PackageDetailComponent.packageId;
        if (!NeedCreateTenderFormComponent.formModel) {
            this.router.navigate([
                `package/detail/${
                    PackageDetailComponent.packageId
                }/attend/create-request`
            ]);
        } else {
            this.spinner.show();
            this.packageService
                .getInforPackageID(this.bidOpportunityId)
                .subscribe(data => {
                    this.packageInfo = data;
                    this.spinner.hide();
                    console.log(this.packageInfo);
                });
        }
    }

    onSubmit() {
        NeedCreateTenderFormComponent.formModel.bidOpportunityId = this.bidOpportunityId;
        if (NeedCreateTenderFormComponent.formModel.createdEmployeeId) {
            NeedCreateTenderFormComponent.formModel.updatedEmployeeId = this.sessionService.currentUser.userId;
        } else {
            NeedCreateTenderFormComponent.formModel.createdEmployeeId = this.sessionService.currentUser.userId;
        }
        this.spinner.show();
        this.packageService
            .createOrUpdateProposedTenderParticipateReport(
                NeedCreateTenderFormComponent.formModel
            )
            .subscribe(
                data => {
                    this.spinner.hide();
                    this.router.navigate([
                        `package/detail/${
                            PackageDetailComponent.packageId
                        }/attend/create-request`
                    ]);
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
}
