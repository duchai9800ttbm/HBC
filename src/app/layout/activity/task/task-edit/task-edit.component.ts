import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { ActivityModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityService } from '../../../../shared/services/index';
import { routerTransition } from '../../../../router.animations';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
  animations: [routerTransition()],
})
export class TaskEditComponent implements OnInit {

  task$: Observable<ActivityModel>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private activityService: ActivityService,
  ) { }

  ngOnInit() {
    this.task$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.activityService.view(params.get('id'), 'Work'));
  }

}
