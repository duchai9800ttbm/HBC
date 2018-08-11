import { Injectable } from "@angular/core";
import { ApiService, SessionService, UserService } from "./index";
import { Observable } from "rxjs/Observable";
import { ActivityListItem } from "../models/activity/activity-list-item.model";
import { ActivityModel, AuditItem } from "../models/index";
import { PagedResult } from "../models";
import { InstantSearchService } from "./instant-search.service";
import DateTimeConvertHelper from "../helpers/datetime-convert-helper";

@Injectable()
export class AuditService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService,
        private userService: UserService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }
    private static toAuditItem(result: any): AuditItem {
        return {
            user: result.user,
            id: result.userId,
            date: result.date,
            moduleItemId: result.objectTypeId,
            moduleItemName: result.objectTypeName,
            actionCode: result.action,
            actionName: AuditService.translateAuditAction(result.action),
            valueChanges:
                result.auditValueDto &&
                result.auditValueDto.map(x => {
                    return {
                        field: x.field,
                        beforeValue: x.beforeValue,
                        afterValue: x.afterValue
                    };
                }),
            moduleName: result.objectType
        };
    }

    private static translateAuditAction(actionCode: number): string {
        switch (actionCode) {
            case 0:
                return "đã tạo";
            case 1:
                return "đã cập nhật";
            case 2:
                return "đã xóa";
            default:
                return "";
        }
    }

    getAuditsByModuleItemId(
        moduleName: string,
        moduleItemId: number,
        page: number,
        pageSize: number
    ): Observable<PagedResult<AuditItem>> {
        const url = `/employee/${
            this.employeeId
        }/audits/${moduleName}/${moduleItemId}/${page}/${pageSize}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(AuditService.toAuditItem)
                };
            })
            .share();
    }

    getAudits(
        page: number,
        pageSize: number
    ): Observable<PagedResult<AuditItem>> {
        const url = `/employee/${this.employeeId}/audits/${page}/${pageSize}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(AuditService.toAuditItem)
                };
            })
            .share();
    }
}
