import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnInit {
  number = 10;
  constructor() { }

  ngOnInit() {
  }

}
