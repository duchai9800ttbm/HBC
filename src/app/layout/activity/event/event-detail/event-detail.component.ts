import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Subject, Observable } from 'rxjs/Rx';
import { ActivityModel } from '../../../../shared/models/index';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AlertService, ConfirmationService, ActivityService } from '../../../../shared/services/index';

@Component({
    selector: 'app-event-detail',
    templateUrl: './event-detail.component.html',
    styleUrls: ['./event-detail.component.scss'],
    animations: [routerTransition()]
})
export class EventDetailComponent implements OnInit {
    event$: Observable<ActivityModel>;
    isNotExist = false;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private activityService: ActivityService) { }

    ngOnInit(): void {
        this.event$ = this.route.paramMap.switchMap((params: ParamMap) =>
            this.activityService.view(params.get('id'), 'Event'));
        this.event$.subscribe(event => { },
            err => this.isNotExist = true
        );
    }

    delete(id) {
        const that = this;
        this.confirmationService.confirm('Bạn có chắc chắn muốn xóa sự kiện này?',
            () => {
                that.activityService.delete([{ id: id, activityType: 'event' }]).subscribe(_ => {
                    that.router.navigate(['/activity']);
                    that.alertService.success('Đã xóa sự kiện!', true);
                });
            });
    }

    refresh(id) {
        this.event$ = this.activityService.view(id, 'Event');
    }
}
