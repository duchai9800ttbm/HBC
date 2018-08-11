import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { BidPriceApprovalModel } from '../../../../../shared/models/document/bid-price-approval-document.model';
import { UserService, ConfirmationService, AlertService } from '../../../../../shared/services';
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-price-report-create',
    templateUrl: './price-report-create.component.html',
    styleUrls: ['./price-report-create.component.scss']
})
export class PriceReportCreateComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    dtOption: any = DATATABLE_CONFIG;
    bidPriceApprovalListItem: BidPriceApprovalModel[];
    bidPriceApprovalListItemSearchResult: BidPriceApprovalModel[];
    userListItem: UserItemModel[];
    datePickerConfig = DATETIME_PICKER_CONFIG;
    packageId;

    constructor(
        private userService: UserService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService,

    ) { }

    ngOnInit() {
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
        });
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
            'Bạn có chắc chắn chốt đơn báo giá dự thầu?',
            () => {
                this.spinner.show();
                this.router.navigate([`/package/detail/${this.packageId}/attend/pending`]);
                this.spinner.hide();
                this.alertService.success("Chốt đơn báo giá dự thầu thành công!");
            }
        );
    }

}
