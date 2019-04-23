
import { PagedResult } from '../models';
import { Injectable } from '@angular/core';


@Injectable()
export class ApiConvertHelper {
    static toPagedResult(apiResult: any, convert: (items: any[]) => any[]): PagedResult<any> {
        return {
            currentPage: apiResult.page,
            pageSize: apiResult.pageSize,
            pageCount: apiResult.pageCount,
            total: apiResult.recordCount,
            items: (apiResult.data || []).map(convert),
        };
    }
}
