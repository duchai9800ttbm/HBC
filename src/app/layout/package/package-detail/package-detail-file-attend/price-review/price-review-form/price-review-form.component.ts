import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { TenderPriceApproval } from '../../../../../../shared/models/price-review/price-review.model';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-price-review-form',
  templateUrl: './price-review-form.component.html',
  styleUrls: ['./price-review-form.component.scss']
})
export class PriceReviewFormComponent implements OnInit, AfterViewInit {
  number = 10;
  constructor(
    private fb: FormBuilder
  ) { }

  phanMong = false;
  @Input() model: TenderPriceApproval;
  @Input() type: string;
  ngOnInit() {
  }

  createForm() {

  }
  ngAfterViewInit() {
  }


}
