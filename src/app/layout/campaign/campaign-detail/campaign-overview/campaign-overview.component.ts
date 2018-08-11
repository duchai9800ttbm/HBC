import {routerTransition} from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-campaign-overview',
  templateUrl: './campaign-overview.component.html',
  styleUrls: ['./campaign-overview.component.scss'],
  animations: [routerTransition()]
})
export class CampaignOverviewComponent implements OnInit {
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;
  constructor() { }

  ngOnInit() {
  }

}
