import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProspectModel } from '../../../shared/models';
import { ProspectService } from '../../../shared/services/index';
import { routerTransition } from '../../../router.animations';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-prospect-edit',
  templateUrl: './prospect-edit.component.html',
  styleUrls: ['./prospect-edit.component.scss'],
  animations: [routerTransition()]
})
export class ProspectEditComponent implements OnInit {

  prospect$: Observable<ProspectModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private prospectService: ProspectService
  ) { }

  ngOnInit() {
    this.prospect$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.prospectService.view(params.get('id')));
  }

}
