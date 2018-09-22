import { Component, OnInit } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-price-review-detail',
  templateUrl: './price-review-detail.component.html',
  styleUrls: ['./price-review-detail.component.scss']
})
export class PriceReviewDetailComponent implements OnInit {
  model: TenderPriceApproval;
  priceReview$: Observable<TenderPriceApproval>;
  packageId;
  constructor(
    private route: ActivatedRoute,
    private priceReviewService: PriceReviewService
  ) { }

  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.priceReview$ = this.priceReviewService.view(this.packageId);
  }


}
