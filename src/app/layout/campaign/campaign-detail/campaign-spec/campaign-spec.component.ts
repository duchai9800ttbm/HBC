import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Observable } from "rxjs/Observable";
import { CampaignModel } from '../../../../shared/models/index';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AlertService, CampaignService } from '../../../../shared/services/index';

@Component({
  selector: 'app-campaign-spec',
  templateUrl: './campaign-spec.component.html',
  styleUrls: ['./campaign-spec.component.scss'],
  animations: [routerTransition()]
})
export class CampaignSpecComponent implements OnInit {
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;
  campaign$: Observable<CampaignModel>;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private campaignService: CampaignService) { }

    ngOnInit(): void {
        this.campaign$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
            this.campaignService.view(params.get('id')));
    }

}
