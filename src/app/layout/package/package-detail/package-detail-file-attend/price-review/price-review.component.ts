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
import { slideToLeft } from '../../../../../router.animations';

@Component({
    selector: 'app-price-review',
    templateUrl: './price-review.component.html',
    styleUrls: ['./price-review.component.scss'],
    animations: [slideToLeft()]
})
export class PriceReviewComponent implements OnInit, OnDestroy {
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
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
