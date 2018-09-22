import { Component, OnInit } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss']
})
export class PriceReviewSummaryComponent implements OnInit {
  packageId;
  priceReview: TenderPriceApproval;
  constructor(
    private priceReviewService: PriceReviewService
  ) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.priceReviewService.view(this.packageId).subscribe(data => {
      this.priceReview = data;
    });
  }

  guiDuyet() {

  }

  taiTemplate() {

  }
}
