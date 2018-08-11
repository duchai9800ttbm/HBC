import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ProspectModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProspectService } from '../../../../shared/services/index';
import { routerTransition } from '../../../../router.animations';

@Component({
  selector: 'app-prospect-spec-history',
  templateUrl: './prospect-spec-history.component.html',
  styleUrls: ['./prospect-spec-history.component.scss'],
  animations: [routerTransition()]

})
export class ProspectSpecHistoryComponent implements OnInit {
  prospect$:  Observable<ProspectModel>;
  public isCollapsedMain = false;
  public isCollapsedAddress = false;
  public isCollapsedDesc = false;
  constructor(
    private route: ActivatedRoute,
    private prospectService: ProspectService,
  ) { }

  ngOnInit() {
    this.prospect$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
    this.prospectService.viewHistory(params.get('id')));
  }

}
