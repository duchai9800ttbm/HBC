import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { ActivityModel } from '../../../../shared/models/index';
import { ActivityService } from '../../../../shared/services/index';
import { Observable } from "rxjs/Observable";
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.scss'],
  animations: [routerTransition()],
})
export class EventEditComponent implements OnInit {

  event$: Observable<ActivityModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
  ) { }

  ngOnInit() {
    this.event$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.activityService.view(params.get('id'), 'Event'));
  }

}
