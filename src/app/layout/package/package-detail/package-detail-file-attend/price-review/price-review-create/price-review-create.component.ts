import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../../router.animations';

@Component({
  selector: 'app-price-review-create',
  templateUrl: './price-review-create.component.html',
  styleUrls: ['./price-review-create.component.scss'],
  animations: [routerTransition()]
})
export class PriceReviewCreateComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
