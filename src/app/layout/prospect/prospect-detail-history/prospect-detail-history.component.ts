import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ProspectModel } from '../../../shared/models/index';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ProspectService } from '../../../shared/services/index';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-prospect-detail-history',
  templateUrl: './prospect-detail-history.component.html',
  styleUrls: ['./prospect-detail-history.component.scss'],
  animations: [routerTransition()]
})
export class ProspectDetailHistoryComponent implements OnInit {

  prospect$: Observable<ProspectModel>;
  customerId: number | string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService,
    private router: Router,
  ) { }
  ngOnInit() {
    this.prospect$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.prospectService.viewHistory(params.get('id')));
    this.activatedRoute.queryParams.subscribe(data => this.customerId = data.customerId);
  }
  backDetail() {
    this.router.navigate([`/customer/detail/${this.customerId}/spec`]);
  }
}
