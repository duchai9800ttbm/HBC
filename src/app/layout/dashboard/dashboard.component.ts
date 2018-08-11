import { Component, OnInit, group } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { ActivityService } from '../../shared/services/index';
import { DictionaryItem, TimelineOfDay } from '../../shared/models/index';
import { ActivityListItem } from '../../shared/models/activity/activity-list-item.model';
import * as Rx from 'rxjs/Rx';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs/Rx';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    animations: [routerTransition()]
})
export class DashboardComponent implements OnInit {

    eventTimeline: TimelineOfDay[];
    taskTimeline: TimelineOfDay[];

    constructor(
        private activityService: ActivityService
    ) { }

    ngOnInit() {
        this.activityService
            .getDashboardItems('Event', 0, 5)
            .subscribe(result => {
                this.eventTimeline = this.createTimeline(result);
            });

        this.activityService
            .getDashboardItems('Work', 0, 5)
            .subscribe(result => {
                this.taskTimeline = this.createTimeline(result);
            });
    }

    createTimeline(activities: ActivityListItem[]): TimelineOfDay[] {
        if (!activities || !activities.length) {
            return [];
        }

        const groups = activities.reduce(function (accumulator, item) {
            const timelineDate = moment(item.startDate).format('DD/MM/YYYY');
            accumulator[timelineDate] = accumulator[timelineDate] || [];
            accumulator[timelineDate].push(item);
            return accumulator;
        }, {});

        return Object
            .keys(groups)
            .map(function (key) {
                return {
                    timelineDate: key,
                    items: groups[key]
                };
            })
            .sort(function (a, b) {
                return (a.items[0].startDate) - (b.items[0].startDate);
            });
    }

}
