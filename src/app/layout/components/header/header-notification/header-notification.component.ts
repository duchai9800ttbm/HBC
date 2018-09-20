import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { NotificationItem, PagedResult } from '../../../../shared/models/index';
import { UserNotificationService, AlertService } from '../../../../shared/services/index';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';

@Component({
  selector: 'app-header-notification',
  templateUrl: './header-notification.component.html',
  styleUrls: ['./header-notification.component.scss'],
  providers: [NotificationService],
})
export class HeaderNotificationComponent implements OnInit {
  notificationCount$: Observable<number>;
  notificationItems: NotificationItem[];
  pagedResult: PagedResult<NotificationItem>;
  notificationList: NotificationItem[];
  @ViewChild('DropTool2') DropTool2: ElementRef;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private alertService: AlertService,
  ) { }
  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    console.log('document');
    if (!this.containsDropTool(event.target)) {
      this.getListNotification();
      // this.DropTool2.close();
    }
  }
  containsDropTool(target: any): boolean {
    return this.DropTool2.nativeElement.contains(target) ||
      (this.DropTool2 ? this.DropTool2.nativeElement.contains(target) : false);
  }
  ngOnInit() {
    this.getListNotification();
    // this.notificationCount$ = this.userNotificationService.count();
    // this.userNotificationService.list(0, 5)
    // .subscribe(pagedResult => this.notificationItems = pagedResult.items);
  }

  read(item: NotificationItem) {
    this.notificationService
      .readNotification(item.id)
      .subscribe(result => {
        this.getListNotification();
        console.log('Đã đọc thành công');
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }


  // gotoDetailPage(item: NotificationItem) {
  //   const moduleUrl = item.moduleName === 'Event'
  //     ? 'activity/event'
  //     : item.moduleName === 'Work'
  //       ? 'activity/task'
  //       : item.moduleName.toLowerCase();

  //   const detailUrl = `${moduleUrl}/detail`;

  //   this.router.navigate([detailUrl, item.moduleItemId]);
  // }

  getListNotification() {
    this.notificationService.getListNotification().subscribe(response => {
      this.notificationList = response;
      console.log('this.notificationList', response);
    });
  }

}
