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
      notificationName: result.notificationName,
      notificationMessage: result.notificationMessage,
      sendEmployee: {
        employeeId: result.employeeId,
        employeeNo: result.employeeNo,
        employeeName: result.employeeName,
        employeeAvatar: result.employeeAvatar,
        employeeEmail: result.employeeEmail,
      },
      notificationState: {
        key: result.id,
        value: result.text,
        displayText: result.displayText,
      },
      bidOpportunityId: result.bidOpportunityId,
      liveFormType: {
        key: result.id,
        value: result.text,
        displayText: result.displayText,
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

}
