import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Observable";
import { NotificationItem, PagedResult } from '../../shared/models/index';
import { UserNotificationService } from '../../shared/services/user-notification.service';
import { Router } from '@angular/router';
import { routerTransition } from '../../router.animations';
import { NotificationService } from '../../shared/services/notification.service';
import { NotificationStatus } from '../../shared/constants/notification-status';
import { AlertService, ConfirmationService } from '../../shared/services';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-notification-list',
  templateUrl: './notification-list.component.html',
  styleUrls: ['./notification-list.component.scss'],
  // animations: [routerTransition()],
  providers: [NotificationService],
})
export class NotificationListComponent implements OnInit {
  loading =false;
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
    // this.notificationService.watchNotificationAmontSubject().subscribe(value => {
    //   this.getListNotification();
    // });

    this.getListNotification();
  }
  onLoadMore() {
    this.loading = true;
    this.notificationService.getListNotifications(+this.pagedResult.currentPage + 1, +this.pagedResult.pageSize)
    .pipe(debounceTime(1000))
      .subscribe(pagedResult => {
        this.showButton = (pagedResult.items.length > 0) && (+pagedResult.currentPage + 1 < pagedResult.pageCount);
        this.pagedResult = pagedResult;
        this.notificationList = this.notificationList.concat(pagedResult.items);
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  

  getListNotification() {
    this.loading = true;
    this.notificationService.getListNotifications(0, 10).subscribe(response => {
      this.pagedResult = response;
      this.notificationList = response.items;
      this.loading = false;
    });
  }

  tickReaded(item: NotificationItem) {
    this.notificationService
      .readNotification(item.id)
      .subscribe(result => {
        this.notificationService.change();
        item.notificationState.id = "Read";
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
            this.notificationList = this.notificationList.filter(x=>x.id != item.id);
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
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/create-request`]);
        break;
      }
      case NotificationStatus.NhacDuyetDeNghiDuThauTruoc3Ngay: {
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/attend/create-request`]);
        break;
      }
      case NotificationStatus.GuiPhanCongTienDo: {
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
        item.notificationState.id = "Read";
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  readAllNotification() {
    this.notificationService.readAllNotification().subscribe(response => {
      this.notificationService.change();
      this.alertService.success('Tất cả các thông báo đã được đọc!');
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
          this.notificationList = [];
        },
          err => {
            this.alertService.error('Đã xảy ra lỗi!');
          });
      });
  }
}
