import { Component, OnInit } from '@angular/core';
import { BidStatusListItem } from '../../../../shared/models/setting/bid-status-list-item';

@Component({
  selector: 'app-setting-bid-status-create',
  templateUrl: './setting-bid-status-create.component.html',
  styleUrls: ['./setting-bid-status-create.component.scss']
})
export class SettingBidStatusCreateComponent implements OnInit {

  bidStatus: BidStatusListItem = new BidStatusListItem();
  constructor() { }

  ngOnInit() {
  }

}
