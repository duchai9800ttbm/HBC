import { Component, OnInit, Input } from '@angular/core';
import { DATATABLE_CONFIG } from '../../configs/index';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem, PagedResult } from '../../models/index';
import { ActivityListItem } from '../../models/activity/activity-list-item.model';
// tslint:disable-next-line:import-blacklist
import { Subject, Subscription, BehaviorSubject } from 'rxjs';
import { ActivityService, AlertService, DataService, ConfirmationService } from '../../services/index';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-activity-table',
  templateUrl: './activity-table.component.html',
  styleUrls: ['./activity-table.component.scss']
})
export class ActivityTableComponent implements OnInit {

  @Input() moduleName: string;
  @Input() moduleItemId: string;
  @Input() moduleItemName: string;
  @Input() readOnly: boolean;
  activityStatusList: Observable<DictionaryItem[]>;

  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  pagedResult: PagedResult<ActivityListItem> = new PagedResult<ActivityListItem>();

  constructor(
    private activityService: ActivityService,
    private alertService: AlertService,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    this.dtOptions = DATATABLE_CONFIG;

    this.activityStatusList = this.dataService.getActivityStatus();

    this.spinner.show();
    this.activityService
      .getActivitiesByModuleItemId(this.moduleName, this.moduleItemId, 0, 10)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());


  }

  pagedResultChange(pagedResult: any) {
    this.refresh();
  }

  delete(ids: any | any[], activityType?: string) {
    const that = this;
    let deleteIds = [];
    if (!(ids instanceof Array)) {
      deleteIds = [{ id: ids, activityType: activityType }];
    } else {
      deleteIds = ids;
    }

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa hoạt động này?',
      () => {
        that.activityService.delete(deleteIds).subscribe(_ => {
          if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
            this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
          }
          that.alertService.success('Đã xóa hoạt động!');
          that.refresh();
        });
      });
  }

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.activityService
      .getActivitiesByModuleItemId(this.moduleName, this.moduleItemId, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất');
        }
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
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
