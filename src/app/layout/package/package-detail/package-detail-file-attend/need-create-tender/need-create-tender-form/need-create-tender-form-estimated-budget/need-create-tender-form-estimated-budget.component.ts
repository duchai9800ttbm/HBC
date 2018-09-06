import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-need-create-tender-form-estimated-budget',
  templateUrl: './need-create-tender-form-estimated-budget.component.html',
  styleUrls: ['./need-create-tender-form-estimated-budget.component.scss']
})
export class NeedCreateTenderFormEstimatedBudgetComponent implements OnInit {

  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  constructor() { }

  ngOnInit() {
  }

}
