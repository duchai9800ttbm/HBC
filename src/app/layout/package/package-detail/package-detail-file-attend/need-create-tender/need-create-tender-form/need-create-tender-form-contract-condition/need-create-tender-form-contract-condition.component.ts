import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-need-create-tender-form-contract-condition',
  templateUrl: './need-create-tender-form-contract-condition.component.html',
  styleUrls: ['./need-create-tender-form-contract-condition.component.scss']
})
export class NeedCreateTenderFormContractConditionComponent implements OnInit {

  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  listTime: Array<string> = ['Tháng', 'Năm'];
  time = 'Tháng';
  constructor() { }

  ngOnInit() {
  }

}
