
import { Component, OnInit } from '@angular/core';
import { CampaignModel } from '../../../shared/models/campaign/campaign.model';
import * as moment from 'moment';
import { routerTransition } from '../../../router.animations';
@Component({
  selector: 'app-campaign-create',
  templateUrl: './campaign-create.component.html',
  styleUrls: ['./campaign-create.component.scss'],
  animations: [routerTransition()]
})
export class CampaignCreateComponent implements OnInit {
  campaignModel: CampaignModel = new CampaignModel();
  constructor() { }

  ngOnInit() {
  }

}
