import { Component, OnInit } from '@angular/core';
import { Contract } from '../../../../shared/models/setting/contract';

@Component({
  selector: 'app-setting-contract-create',
  templateUrl: './setting-contract-create.component.html',
  styleUrls: ['./setting-contract-create.component.scss']
})
export class SettingContractCreateComponent implements OnInit {
  contract: Contract = new Contract();
  constructor() { }

  ngOnInit() {
  }

}
