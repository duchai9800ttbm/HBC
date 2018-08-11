import { Component, OnInit } from '@angular/core';
import { CampaignModel } from '../../../shared/models/index';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { CampaignService } from '../../../shared/services/index';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-campaign-edit',
  templateUrl: './campaign-edit.component.html',
  styleUrls: ['./campaign-edit.component.scss'],
  animations: [routerTransition()]
})
export class CampaignEditComponent implements OnInit {

  campaign$: Observable<CampaignModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.campaign$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.campaignService.view(params.get('id')));
  }

}
