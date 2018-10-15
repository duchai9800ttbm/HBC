import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NotificationItem } from '../models/notification/notification-item.model';
import { Observable, Subject, BehaviorSubject } from '../../../../node_modules/rxjs';

@Injectable()
export class NotificationService {
  static notificationAmont = new Subject<any>();
  private static toNotificationList(result: any): NotificationItem {
    return {
      id: result.id,
      notificationType: result.notificationType,
      notificationName: result.notificationName,
      notificationMessage: result.notificationMessage,
      sendEmployee: {
        employeeId: result.sendEmployee.employeeId,
        employeeNo: result.sendEmployee.employeeNo,
        employeeName: result.sendEmployee.employeeName,
        employeeAvatar: result.sendEmployee.employeeAvatar ? {
          guid: result.sendEmployee.employeeAvatar.guid,
          thumbSizeUrl: result.sendEmployee.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.sendEmployee.employeeAvatar.largeSizeUrl,
        } : null,
        employeeEmail: result.sendEmployee.employeeEmail,
      },
      notificationState: {
        id: result.notificationState.key,
        text: result.notificationState.value,
        displayText: result.notificationState.displayText,
      },
      bidOpportunityId: result.bidOpportunityId,
      bidOpportunityName: result.bidOpportunityName,
      liveFormType: {
        key: result.liveFormType.id,
        value: result.liveFormType.text,
        displayText: result.liveFormType.displayText,
      },
      sendDate: result.sendDate,
      data: result.data,
    };
  }
  constructor(
    private apiService: ApiService,
  ) {
  }

  // Danh sách các thông báo của người dùng
  getListNotification(): Observable<NotificationItem[]> {
    const url = `bidusernotification`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(NotificationService.toNotificationList);
    });
  }

  // Đọc thông báo
  readNotification(bidUserNotificationId: number) {
    const url = `bidusernotification/${bidUserNotificationId}/readnotification`;
    return this.apiService.get(url).map(response => {
      return response;
    });
  }

  // Đánh dấu tất cả đã đọc
  readAllNotification() {
    const url = `bidusernotification/readall`;
    return this.apiService.get(url).map(response => {
      return response;
    });
  }

  // Xóa tất cả thông báo
  deleteAllNotification() {
    const url = `bidusernotification/deleteall`;
    return this.apiService.get(url).map(response => {
      return response;
    });
  }

  // Xóa 1 thông báo
  deleteOneNotification(bidUserNotificationId: number) {
    const url = `bidusernotification/${bidUserNotificationId}/delete`;
    return this.apiService.get(url).map(response => {
      return response;
    });
  }

  change() {
    NotificationService.notificationAmont.next();
  }

  watchNotificationAmontSubject(): Observable<boolean> {
    return NotificationService.notificationAmont;
  }
}
