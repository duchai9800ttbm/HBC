import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Observable } from "rxjs/Observable";
import { OpportunityModel } from '../../../../shared/models/index';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AlertService, OpportunityService } from '../../../../shared/services/index';

@Component({
  selector: 'app-opportunity-spec',
  templateUrl: './opportunity-spec.component.html',
  styleUrls: ['./opportunity-spec.component.scss'],
  animations: [routerTransition()]
})
export class OpportunitySpecComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  opportunity$: Observable<OpportunityModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private opportunityService: OpportunityService) { }

  ngOnInit(): void {
    this.opportunity$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.opportunityService.view(params.get('id')));
  }
  goToDeitalContact(contactId) {
    this.router.navigate([`/contact/detail/${contactId}`]);
  }

}
