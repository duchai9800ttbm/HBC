import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { Subject, Observable } from 'rxjs/Rx';
import { ActivityModel } from '../../../../shared/models/index';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { AlertService, ConfirmationService, ActivityService } from '../../../../shared/services/index';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss'],
    animations: [routerTransition()]
})
export class TaskDetailComponent implements OnInit {
    task$: Observable<ActivityModel>;
    isNotExist = false;
    task: any;
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private confirmationService: ConfirmationService,
        private activityService: ActivityService,
    ) { }

    ngOnInit(): void {
        this.task$ = this.route.paramMap.switchMap((params: ParamMap) =>
            this.activityService.view(params.get('id'), 'Work'));
        this.task$.subscribe(task => { },
            err => this.isNotExist = true);
    }

    delete(id) {
        const that = this;
        this.confirmationService.confirm('Bạn có chắc chắn muốn xóa công việc này?',
            () => {
                that.activityService.delete([{ id: id, activityType: 'work' }]).subscribe(_ => {
                    that.router.navigate(['/activity']);
                    that.alertService.success('Đã xóa công việc!', true);
                });
            });
    }

    refresh(id) {
        this.task$ = this.activityService.view(id, 'Work');
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    }
}
