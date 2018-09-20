import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { NotificationItem } from '../models/notification/notification-item.model';
import { Observable } from '../../../../node_modules/rxjs';

@Injectable()
export class NotificationService {

  constructor(
    private apiService: ApiService,
  ) { }

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
        employeeAvatar: result.sendEmployee.employeeAvatar,
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
    };
  }

  // Danh sách các thông báo của người dùng
  getListNotification(): Observable<NotificationItem[]> {
    const url = `/bidusernotification`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(NotificationService.toNotificationList);
    });
  }

  // Đọc thông báo
  readNotification(bidUserNotificationId: number) {
    const url = `bidusernotification/${bidUserNotificationId}/readnotification`;
    return this.apiService.get(url).map(response =>  {
      return response;
    });
  }
}
