import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../../router.animations';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';

@Component({
  selector: 'app-price-review-create',
  templateUrl: './price-review-create.component.html',
  styleUrls: ['./price-review-create.component.scss'],
  // animations: [routerTransition()]
})
export class PriceReviewCreateComponent implements OnInit {
  model: TenderPriceApproval;
  constructor() { }

  ngOnInit() {
    this.model = new TenderPriceApproval();
    this.model.interviewTimes = 1;
  }

}
