import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../../router.animations';

@Component({
  selector: 'app-price-review-edit',
  templateUrl: './price-review-edit.component.html',
  styleUrls: ['./price-review-edit.component.scss'],
  animations: [routerTransition()]

})
export class PriceReviewEditComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
