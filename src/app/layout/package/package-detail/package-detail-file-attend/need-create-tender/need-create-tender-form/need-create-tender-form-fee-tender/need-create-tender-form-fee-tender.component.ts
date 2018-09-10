import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-need-create-tender-form-fee-tender',
  templateUrl: './need-create-tender-form-fee-tender.component.html',
  styleUrls: ['./need-create-tender-form-fee-tender.component.scss']
})
export class NeedCreateTenderFormFeeTenderComponent implements OnInit {

  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  constructor() { }

  ngOnInit() {
  }

}
