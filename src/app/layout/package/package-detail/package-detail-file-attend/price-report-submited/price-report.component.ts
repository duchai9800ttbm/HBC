import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BidPriceApprovalModel } from '../../../../../shared/models/document/bid-price-approval-document.model';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'app-price-report',
    templateUrl: './price-report.component.html',
    styleUrls: ['./price-report.component.scss']
})
export class PriceReportSubmitedComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    bidPriceApprovalListItem: BidPriceApprovalModel[];
    bidPriceApprovalListItemSearchResult: BidPriceApprovalModel[];
    packageId;

    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService,

        private alertService: AlertService,

    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;

        this.bidPriceApprovalListItemSearchResult = [
            {
                id: 1,
                documentType: 'Bản vẽ',
                documentName: 'Bản vẽ nền móng & các tầng',
                version: '1.0',
                status: 'Chính thức',
                uploadedBy: {
                    employeeId: 1,
                    employeeNo: '',
                    employeeName: 'Khanhs',
                    employeeAvatar: ''
                },
                createdDate: 1504224000,
                fileGuid: '',
                description: '',
                interviewTimes: 3
            },
            {
                id: 1,
                documentType: 'Bản vẽ',
                documentName: 'Bản vẽ nền móng & các tầng 2',
                version: '1.0',
                status: 'Chính thức',
                uploadedBy: {
                    employeeId: 1,
                    employeeNo: '',
                    employeeName: 'Nghia',
                    employeeAvatar: ''
                },
                createdDate: 1504224000,
                fileGuid: '',
                description: '',
                interviewTimes: 3
            },
        ]
    }
    submited(){
        // this.router.navigate(['../../price-report-create']);
        this.confirmationService.confirm(
            'Bạn có muốn chốt đơn?',
            () => {
                this.spinner.show();
                this.router.navigate([`/package/detail/${this.packageId}/attend/price-report-create`]);
                this.spinner.hide();
                this.alertService.success("Chốt đơn thành công!");
            }
        );
    }
}
