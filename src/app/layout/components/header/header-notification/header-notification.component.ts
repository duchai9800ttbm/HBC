import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NotificationItem, PagedResult } from '../../../../shared/models/index';
import { UserNotificationService, AlertService, ConfirmationService, SessionService } from '../../../../shared/services/index';
import { Router } from '@angular/router';
import { NotificationService } from '../../../../shared/services/notification.service';
import { NotificationStatus } from '../../../../shared/constants/notification-status';
import { NgbDropdownConfig } from '../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-header-notification',
  templateUrl: './header-notification.component.html',
  styleUrls: ['./header-notification.component.scss'],
  providers: [NgbDropdownConfig],
})
export class HeaderNotificationComponent implements OnInit {
  notificationCount$: Observable<number>;
  notificationItems: NotificationItem[];
  pagedResult: PagedResult<NotificationItem>;
  notificationList: NotificationItem[];
  amountNotificationNotRead;
  @ViewChild('DropTool2') DropTool2: ElementRef;
  @ViewChild('DropTooldiv') DropTooldiv: ElementRef;
  @ViewChild('DropToolThongBao') DropToolThongBao: ElementRef;
  @ViewChild('DropToolThongBao222222') DropToolThongBao222222: ElementRef;
  @ViewChild('myDrop') myDrop: ElementRef;
  isShow = true;
  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private sessionService: SessionService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    config: NgbDropdownConfig,
  ) {
    config.autoClose = false;
  }
  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {

    if (this.containsDropToolThongBao2222(event.target) || this.containsDropTool(event.target)) {
      this.isShow = false;
    } else {
      this.isShow = true;
    }
  }

  ngOnInit() {
    this.notificationService.watchNotificationAmontSubject().subscribe(value => {
      this.getListNotification();
    });
    this.getListNotification();

    this.notificationService.count().subscribe(x => this.amountNotificationNotRead = x);

    this.getInterval();
  }

  getInterval() {
    var self = this;

    setInterval(function () {

        if (!self.sessionService.currentUser) {
            return;
        }
        self.notificationService.count().subscribe(x => self.amountNotificationNotRead = x);
    }, 1 * 60 * 1000);
}


  containsDropToolThongBao2222(target: any): boolean {
    if (this.DropToolThongBao222222) {
      return this.DropToolThongBao222222.nativeElement.contains(target) ||
        (this.DropToolThongBao222222 ? this.DropToolThongBao222222.nativeElement.contains(target) : false);
    } else {
      return false;
    }

  }

  containsDropTool(target: any): boolean {
    if (this.DropTool2) {
      return this.DropTool2.nativeElement.contains(target) ||
        (this.DropTool2 ? this.DropTool2.nativeElement.contains(target) : false);
    } else {
      return false;
    }
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
        this.router.navigate([`/package/detail/${item.bidOpportunityId}/result/package-success/package-list`]);
        break;
      }
    }
    this.notificationService
      .readNotification(item.id)
      .subscribe(result => {
        this.notificationService.change();
        // this.getListNotification();
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  getListNotification() {
    this.notificationService.getListNotifications(0,10).subscribe(response => {
      this.notificationList = response.items;
    });

    this.notificationService.count().subscribe(x => this.amountNotificationNotRead = x);
  }

  readAllNotification() {
    this.notificationService.readAllNotification().subscribe(response => {
      this.notificationService.change();
      // this.getListNotification();
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
          // this.getListNotification();
        },
          err => {
            this.alertService.error('Đã xảy ra lỗi!');
          });
      });
  }

  // cancel(myDrop) {
  //   myDrop.close();
  // }
  noClosePopup() {
    this.isShow = false;
    console.log('noClosePopup');
  }
}

