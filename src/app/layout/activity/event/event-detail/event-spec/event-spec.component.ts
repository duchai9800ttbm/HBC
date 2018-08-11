import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../../router.animations';
import { Observable } from 'rxjs/Observable';
import { ActivityModel } from '../../../../../shared/models/index';
import { ParamMap, ActivatedRoute, Router } from '@angular/router';
import { ActivityService } from '../../../../../shared/services/index';

@Component({
  selector: 'app-event-spec',
  templateUrl: './event-spec.component.html',
  styleUrls: ['./event-spec.component.scss'],
  animations: [routerTransition()]
})
export class EventSpecComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  event$: Observable<ActivityModel>;

  constructor(
    private route: ActivatedRoute,
    private activityService: ActivityService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.event$ = this.route.parent.paramMap.switchMap((params: ParamMap) =>
      this.activityService.view(params.get('id'), 'Event'));
  }
  onClick(moduleName, moduleItemId) {
    this.router.navigate([`/${moduleName.toLowerCase()}/detail/${moduleItemId}`]);

  }
}
