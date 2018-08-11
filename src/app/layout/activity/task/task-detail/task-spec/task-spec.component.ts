import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import { Observable } from "rxjs/Observable";
import { ActivityModel } from '../../../../../shared/models/index';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ActivityService } from '../../../../../shared/services/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-spec',
  templateUrl: './task-spec.component.html',
  styleUrls: ['./task-spec.component.scss'],
  animations: [routerTransition()]
})
export class TaskSpecComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  task$: Observable<ActivityModel>;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router) { }

  ngOnInit(): void {
    this.task$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.activityService.view(params.get('id'), 'Work'));
  }

  onClick(moduleName, moduleItemId) {
    this.router.navigate([`/${moduleName.toLowerCase()}/detail/${moduleItemId}`]);

  }

}
