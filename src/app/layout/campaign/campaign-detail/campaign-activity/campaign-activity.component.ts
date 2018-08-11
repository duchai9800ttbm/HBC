import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CampaignService } from '../../../../shared/services/index';

@Component({
  selector: 'app-campaign-activity',
  templateUrl: './campaign-activity.component.html',
  styleUrls: ['./campaign-activity.component.scss']
})
export class CampaignActivityComponent implements OnInit {

  id: string;
  name: string;
  constructor(
    private route: ActivatedRoute,
    private campaignService: CampaignService,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => {
      this.id = value.id;
      this.campaignService.view(this.id)
        .subscribe(result => this.name = result.name);
    });

  }

}
