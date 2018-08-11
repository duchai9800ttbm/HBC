import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { BidPriceApprovalModel } from '../../../../../shared/models/document/bid-price-approval-document.model';
import { Router } from '@angular/router';
import { ConfirmationService, AlertService } from '../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../package-detail.component';
import { DocumentPriceReviewService } from '../../../../../shared/services/document-price-review.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-price-review',
    templateUrl: './price-review.component.html',
    styleUrls: ['./price-review.component.scss']
})
export class PriceReviewComponent implements OnInit, OnDestroy {
    dtTrigger: Subject<any> = new Subject();
    dtOptions: any = DATATABLE_CONFIG;
    bidPriceApprovalListItem: BidPriceApprovalModel[];
    bidPriceApprovalListItemSearchResult: BidPriceApprovalModel[];
    packageId;
    subscription: Subscription;
    constructor(
        private router: Router,
        private confirmationService: ConfirmationService,
        private spinner: NgxSpinnerService,
        private alertService: AlertService,
        private documentPriceReviewService: DocumentPriceReviewService
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.spinner.show();
        this.subscription = this.documentPriceReviewService.read(this.packageId).subscribe(result => {
            this.bidPriceApprovalListItem = result;
            this.bidPriceApprovalListItemSearchResult = result;
            this.spinner.hide();
        });
    }
    submited() {
        this.router.navigate(['../../price-report-create']);
        this.confirmationService.confirm(
            'Bạn có muốn chốt trình duyệt giá?',
            () => {
                this.spinner.show();
                this.router.navigate([`/package/detail/${this.packageId}/attend/price-report`]);
                this.spinner.hide();
                this.alertService.success('Chốt trình duyệt giá thành công!');
            }
        );
    }

    downloadFileItem(id: number | string) {
        this.documentPriceReviewService.download(id).subscribe();
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
