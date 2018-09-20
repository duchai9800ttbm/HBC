import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { NotificationItem, PagedResult } from '../../shared/models/index';
import { UserNotificationService } from '../../shared/services/user-notification.service';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [routerTransition()]
})
export class NotificationListComponent implements OnInit {
  notificationCount$: Observable<number>;
  notificationItems$: Observable<NotificationItem[]>;
  notificationItems: NotificationItem[];
  pagedResult: PagedResult<NotificationItem>;
  showButton = true;
  constructor(
    private router: Router,
    private userNotificationService: UserNotificationService,
  ) { }

  ngOnInit() {
    // this.userNotificationService.list(0, 5)
    //   .subscribe(pagedResult => {
    //     this.pagedResult = pagedResult;
    //     this.notificationItems = pagedResult.items;
    //     this.showButton = pagedResult.pageCount !== 1;
    //   });
  }

  // read(item: NotificationItem) {
  //   this.userNotificationService
  //     .read(item.id)
  //     .subscribe(result => {
  //       this.notificationCount$ = this.userNotificationService.count();
  //       this.userNotificationService.list(0, 5)
  //         .subscribe(pagedResult => this.notificationItems = pagedResult.items);
  //       this.gotoDetailPage(item);
  //     });
  // }

  // onLoadMore() {
  //   this.userNotificationService.list(+this.pagedResult.currentPage + 1, +this.pagedResult.pageSize)
  //     .subscribe(pagedResult => {
  //       this.showButton = (pagedResult.items.length > 0) && (+pagedResult.currentPage + 1 < pagedResult.pageCount);
  //       this.pagedResult = pagedResult;
  //       this.notificationItems = this.notificationItems.concat(pagedResult.items);
  //     });
  // }


  // gotoDetailPage(item: NotificationItem) {
  //   const moduleUrl = item.moduleName === 'Event'
  //     ? 'activity/event'
  //     : item.moduleName === 'Work'
  //       ? 'activity/task'
  //       : item.moduleName.toLowerCase();

  //   const detailUrl = `${moduleUrl}/detail`;

  //   this.router.navigate([detailUrl, item.moduleItemId]);
  // }

}
