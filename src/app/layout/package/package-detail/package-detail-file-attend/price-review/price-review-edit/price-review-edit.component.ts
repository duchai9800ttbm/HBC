import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../../router.animations';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-price-review-edit',
  templateUrl: './price-review-edit.component.html',
  styleUrls: ['./price-review-edit.component.scss'],
  // animations: [routerTransition()]

})
export class PriceReviewEditComponent implements OnInit {
  model: TenderPriceApproval;
  packageId;
  priceReview$: Observable<TenderPriceApproval>;

  constructor(
    private priceReviewService: PriceReviewService
  ) { }


  ngOnInit() {
    this.packageId = PackageDetailComponent.packageId;
    this.priceReview$ = this.priceReviewService.view(this.packageId);
  }

}
