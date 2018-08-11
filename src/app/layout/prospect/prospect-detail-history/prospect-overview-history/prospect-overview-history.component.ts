import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ProspectModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProspectService } from '../../../../shared/services/index';
import { routerTransition } from '../../../../router.animations';

@Component({
  selector: 'app-prospect-overview-history',
  templateUrl: './prospect-overview-history.component.html',
  styleUrls: ['./prospect-overview-history.component.scss'],
  animations: [routerTransition()]

})
export class ProspectOverviewHistoryComponent implements OnInit {
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;
  public prospect$: Observable<ProspectModel>;

  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService, ) { }

  ngOnInit() {
    this.prospect$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
    this.prospectService.viewHistory(params.get('id')));
  }

}
