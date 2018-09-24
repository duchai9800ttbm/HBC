import { Component, OnInit } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PriceReviewService } from '../../../../../../shared/services/price-review.service';
import { DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-price-review-summary',
  templateUrl: './price-review-summary.component.html',
  styleUrls: ['./price-review-summary.component.scss']
})
export class PriceReviewSummaryComponent implements OnInit {
  packageId;
  priceReview: TenderPriceApproval;
  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();
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

  delete() {

  }

  print() {

  }
}
