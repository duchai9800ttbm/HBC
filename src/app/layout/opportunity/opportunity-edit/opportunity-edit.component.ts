import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { OpportunityModel } from '../../../shared/models/index';
import { OpportunityService } from '../../../shared/services/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-opportunity-edit',
  templateUrl: './opportunity-edit.component.html',
  styleUrls: ['./opportunity-edit.component.scss'],
  animations: [routerTransition()]
})
export class OpportunityEditComponent implements OnInit {

  opportunity$: Observable<OpportunityModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private opportunityService: OpportunityService
  ) { }

  ngOnInit() {
    this.opportunity$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.opportunityService.view(params.get('id')));
  }

}
