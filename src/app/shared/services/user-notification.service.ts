import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs/Rx";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import * as moment from "moment";
import { ApiService } from "./api.service";
import { SessionService } from "./session.service";
import { UserModel } from "../models/user/user.model";
import { NotificationItem, PagedResult } from "../models/index";

@Injectable()
export class UserNotificationService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) {}
    // get employeeId() {
    //     return this.sessionService.currentUser.employeeId;
    // }

    // count(): Observable<number> {
    //     const url = `/employee/${this.employeeId}/notification/count`;
    //     return this.apiService
    //         .get(url)
    //         .map(response => response.result)
    //         .share();
    // }

    // read(id: number): Observable<boolean> {
    //     const url = `/employee/${this.employeeId}/notification/read/${id}`;
    //     return this.apiService
    //         .post(url)
    //         .map(response => response.result)
    //         .share();
    // }

    // list(
    //     page: number | string,
    //     pageSize: number | string
    // ): Observable<PagedResult<NotificationItem>> {
    //     const url = `/employee/${
    //         this.employeeId
    //     }/notifications/${page}/${pageSize}`;

    //     return this.apiService
    //         .get(url)
    //         .map(response => {
    //             const result = response.result;
    //             return {
    //                 currentPage: result.page,
    //                 pageSize: pageSize,
    //                 pageCount: result.pageCount,
    //                 total: result.recordCount,
    //                 items: (result.data || []).map(
    //                     UserNotificationService.toNotificationItem
    //                 )
    //             };
    //         })
    //         .share();
    // }

    // listNoticationsReminder(
    //     page: number | string,
    //     pageSize: number | string
    // ): Observable<PagedResult<NotificationItem>> {
    //     const url = `/employee/${
    //         this.employeeId
    //     }/notifications/${moment().valueOf()}/${page}/${pageSize}`;

    //     return this.apiService
    //         .get(url)
    //         .map(response => {
    //             const result = response.result;
    //             return {
    //                 currentPage: result.page,
    //                 pageSize: pageSize,
    //                 pageCount: result.pageCount,
    //                 total: result.recordCount,
    //                 items: (result.data || []).map(
    //                     UserNotificationService.toNotificationItem
    //                 )
    //             };
    //         })
    //         .share();
    // }

    // tslint:disable-next-line:member-ordering
    // private static toNotificationItem(result: any): NotificationItem {
    //     return {
    //         id: result.id,
    //         moduleName: result.objectType,
    //         moduleItemId: result.objectId,
    //         moduleItemName: result.objectName,
    //         startDate: result.startDate,
    //         endDate: result.endDate,
    //         unread: !result.read
    //     };
    // }
}
