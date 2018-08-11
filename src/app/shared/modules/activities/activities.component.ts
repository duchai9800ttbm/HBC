import { Component, OnInit, Input } from '@angular/core';
import { ActivityListItem } from '../../models/activity/activity-list-item.model';
import { ActivityService } from '../../services/index';
import { Observable } from "rxjs/Observable";
import { Router } from '@angular/router';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss']
})
export class ActivitiesComponent implements OnInit {
  @Input() moduleName: string;
  @Input() moduleItemId: number;
  @Input() moduleItemName: string;
  @Input() readOnly: boolean;
  activities: ActivityListItem[];
  constructor(
    private activityService: ActivityService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.activityService
      .getActivitiesByModuleItemId(this.moduleName, this.moduleItemId, 0, 5)
      .subscribe(pagedResult => this.activities = pagedResult.items);
  }


  gotoCreateTaskPage() {
    this.router.navigate(['/activity/task/create',
      {
        moduleName: this.moduleName,
        moduleItemId: this.moduleItemId,
        moduleItemName: this.moduleItemName,
      }]);
  }

  gotoCreateEventPage() {
    this.router.navigate(['/activity/event/create',
      {
        moduleName: this.moduleName,
        moduleItemId: this.moduleItemId,
        moduleItemName: this.moduleItemName,
      }]);
  }

}
