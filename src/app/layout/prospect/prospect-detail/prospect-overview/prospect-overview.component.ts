import { routerTransition } from '../../../../router.animations';
import { Component, OnInit } from '@angular/core';
import { ProspectModel } from '../../../../shared/models';
import { ProspectService } from '../../../../shared/services';
import { Router, ActivatedRoute, Params, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-prospect-overview',
  templateUrl: './prospect-overview.component.html',
  styleUrls: ['./prospect-overview.component.scss'],
  animations: [routerTransition()]
})
export class ProspectOverviewComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  prospect$: Observable<ProspectModel>;

  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService,
  ) { }

  ngOnInit() {
    this.prospect$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.prospectService.view(params.get('id')));
  }
}
