import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { NotificationItem, PagedResult } from '../../shared/models/index';
import { UserNotificationService } from '../../shared/services/user-notification.service';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { NotificationService } from '../../shared/services/notification.service';
import { NotificationStatus } from '../../shared/constants/notification-status';
import { AlertService, ConfirmationService } from '../../shared/services';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  animations: [routerTransition()],
  providers: [NotificationService],
})
export class NotificationListComponent implements OnInit {
  notificationCount$: Observable<number>;
  notificationItems$: Observable<NotificationItem[]>;
  notificationItems: NotificationItem[];
  pagedResult: PagedResult<NotificationItem>;
  showButton = true;
  notificationList: NotificationItem[];
  constructor(
    private router: Router,
    private userNotificationService: UserNotificationService,
    private notificationService: NotificationService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {
    this.getListNotification();
    // this.userNotificationService.list(0, 5)
    //   .subscribe(pagedResult => {
    //     this.pagedResult = pagedResult;
    //     this.notificationItems = pagedResult.items;
    //     this.showButton = pagedResult.pageCount !== 1;
    //   });
  }

  getListNotification() {
    this.notificationService.getListNotification().subscribe(response => {
      this.notificationList = response;
      console.log(this.notificationList);
      // this.notificationList.forEach( item => {
      //   this.amountNotificationNotRead = item
      // });
    });
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

  tickReaded(item: NotificationItem) {
    this.notificationService
      .readNotification(item.id)
      .subscribe(result => {
        this.notificationService.change();
        this.getListNotification();
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  deleteOneNotification(item: NotificationItem) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa thông báo này?',
      () => {
        this.notificationService
          .deleteOneNotification(item.id)
          .subscribe(result => {
            this.notificationService.change();
            this.getListNotification();
            this.alertService.success('Đã xóa thông báo thành công!');
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi, chưa xóa được thông báo!');
            });
      });
  }

  read(item: NotificationItem) {
    switch (item.notificationType) {
      case NotificationStatus.GuiDuyetDeNghiDuThau: {
        console.log('GuiDuyetDeNghiDuThau');
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/create-request`]);
        break;
      }
      case NotificationStatus.NhacDuyetDeNghiDuThauTruoc3Ngay: {
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/create-request`]);
        break;
      }
      case NotificationStatus.GuiPhanCongTienDo: {
        console.log('GuiPhanCongTienDo', item.bidOpportunityId);
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/infomation-deployment`]);
        break;
      }
      case NotificationStatus.GuiDuyetTrinhDuyetGia: {
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/price-review`]);
        break;
      }
      case NotificationStatus.GuiLaiTrinhDuyetGia: {
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/price-review`]);
        break;
      }
      case NotificationStatus.ChuyenGiaoTaiLieu: {
        // this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/price-review`]);
        break;
      }
    }
    this.notificationService
      .readNotification(item.id)
      .subscribe(result => {
        this.notificationService.change();
        this.getListNotification();
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  readAllNotification() {
    this.notificationService.readAllNotification().subscribe(response => {
      this.notificationService.change();
      this.getListNotification();
      this.alertService.success('Đã xóa thông báo thành công!');
    },
      err => {
        this.alertService.error('Đã xảy ra lỗi!');
      });
  }

  deleteAllNotification() {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tất cả thông báo?',
      () => {
        this.notificationService.deleteAllNotification().subscribe(response => {
          this.notificationService.change();
          this.getListNotification();
        },
          err => {
            this.alertService.error('Đã xảy ra lỗi!');
          });
      });
  }
}
