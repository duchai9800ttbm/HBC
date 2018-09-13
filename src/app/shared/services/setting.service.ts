import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { SessionService } from './session.service';
import { InstantSearchService } from './instant-search.service';
import { LocationListItem } from '../models/setting/location-list-item';
import { PagedResult } from '../models';
import { Observable } from '../../../../node_modules/rxjs';
import { SETTING_REASON } from '../configs/common.config';
import { OpportunityReasonListItem } from '../models/setting/opportunity-reason-list-item';
import { ConstructionTypeListItem } from '../models/setting/construction-type-list-item';
import { ConstructionCategoryListItem } from '../models/setting/construction-category-list-item';
import { BidStatusListItem } from '../models/setting/bid-status-list-item';
import Utils from '../helpers/utils.helper';
import { LevelListItem } from '../models/setting/level-list-item';

@Injectable()
export class SettingService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService,
        private instantSearchService: InstantSearchService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    // get danh sách khu vực
    readLocation(
        searchTerm: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<LocationListItem>> {
        // const that = this;
        const urlParam = Utils.createSearchParam(searchTerm);
        return this.apiService
            .get(`bidlocation/filter/${page}/${pageSize}`, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // tạo mới/sửa khu vực
    createOrUpdateLocation(data) {
        const url = data.id ? `bidlocation/edit` : `bidlocation/create`;
        const model = {
            id: data.id,
            bidLocationName: data.locationName,
            bidLocationDesc: data.locationDesc
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    // tạo mới/sửa loại công trình
    createOrUpdateConstruction(data) {
        const url = data.id ? `bidconstructiontype/edit` : `bidconstructiontype/create`;
        return this.apiService
            .post(url, data)
            .map(response => response.result);
    }

    // tạo mới/sửa hạng mục thi công công trình
    createOrUpdateConstructionCategory(data) {
        const url = data.id ? `bidconstructioncategory/edit` : `bidconstructioncategory/create`;
        return this.apiService
            .post(url, data)
            .map(response => response.result);
    }

    // tạo mới/sửa tình trạng gói thầu
    createOrUpdateBidStatus(data) {
        const url = data.id ? `bidstatus/edit` : `bidstatus/create`;
        return this.apiService
            .post(url, data)
            .map(response => response.result);
    }

    // xóa khu vực
    deleteLocation(id: number) {
        const url = `bidlocation/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => response.result);
    }

    // xóa hạng mục thi công công trình
    deleteConstructionCategory(id: number) {
        const url = `bidconstructioncategory/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => response.result);
    }

    // xóa loại công trình
    deleteConstruction(id: number) {
        const url = `bidconstructiontype/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => response.result);
    }

    // xóa tình trạng gói thầu
    deleteBidStatus(id: number) {
        const url = `bidstatus/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => response.result);
    }

    // xóa lý do theo loại
    deleteOpportunityReason(id: number, type: string) {
        let urlType;
        switch (type) {
            case SETTING_REASON.Cancel:
                urlType = 'bidopportunitycancelreason';
                break;
            case SETTING_REASON.Lose:
                urlType = 'bidopportunitylosereason';
                break;
            case SETTING_REASON.Win:
                urlType = 'bidopportunitywinreason';
                break;
        }
        const url = `${urlType}/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => response.result);
    }

    // tạo mới/sửa lý do theo loại
    createOrUpdateOpportunityReason(data, type) {
        let url;
        switch (type) {
            case SETTING_REASON.Win:
                url = data.id ? `bidopportunitywinreason/edit` : `bidopportunitywinreason/create`;
                break;
            case SETTING_REASON.Lose:
                url = data.id ? `bidopportunitylosereason/edit` : `bidopportunitylosereason/create`;
                break;
            case SETTING_REASON.Cancel:
                url = data.id ? `bidopportunitycancelreason/edit` : `bidopportunitycancelreason/create`;
                break;
        }
        return this.apiService
            .post(url, data)
            .map(response => response.result);
    }

    // get danh sách lý do theo loại
    readOpportunityReason(
        searchTerm: string,
        page: number | string,
        pageSize: number | string,
        type: string
    ): Observable<PagedResult<OpportunityReasonListItem>> {
        let typeUrl;
        switch (type) {
            case SETTING_REASON.Win:
                typeUrl = 'bidopportunitywinreason';
                break;
            case SETTING_REASON.Lose:
            typeUrl = 'bidopportunitylosereason';
                break;
            case SETTING_REASON.Cancel:
            typeUrl = 'bidopportunitycancelreason';
                break;
        }
        const urlParam = Utils.createSearchParam(searchTerm);
        const url = `${typeUrl}/filter/${page}/${pageSize}`;
        return this.apiService
            .get(url, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // get danh sách loại công trình
    readConstruction(
        searchTerm: string,
        page: number | string,
        pageSize: number | string,
    ): Observable<PagedResult<ConstructionTypeListItem>> {
        const urlParam = Utils.createSearchParam(searchTerm);
        return this.apiService
            .get(`bidconstructiontype/filter/${page}/${pageSize}`, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // get danh sách hạng mục thi công công trình
    readConstructionCategory(
        searchTerm: string,
        page: number | string,
        pageSize: number | string,
    ): Observable<PagedResult<ConstructionCategoryListItem>> {
        const urlParam = Utils.createSearchParam(searchTerm);
        return this.apiService
            .get(`bidconstructioncategory/filter/${page}/${pageSize}`, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // get danh sách tình trạng gói thầu
    readBidStatus(
        searchTerm: string,
        page: number | string,
        pageSize: number | string,
    ): Observable<PagedResult<BidStatusListItem>> {
        const urlParam = Utils.createSearchParam(searchTerm);
        return this.apiService
            .get(`bidstatus/filter/${page}/${pageSize}`, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // view chi tiết tình trạng gói thầu
    viewBidStatus(id: string): Observable<BidStatusListItem> {
        const url = `bidstatus/${id}/get`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // view chi tiết hạng mục thi công công trình
    viewConstructionCategory(id: string): Observable<ConstructionCategoryListItem> {
        const url = `bidconstructioncategory/${id}/get`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // view chi tiết loại công trình
    viewConstruction(id: string): Observable<ConstructionTypeListItem> {
        const url = `bidconstructiontype/${id}/get`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // view chi tiết khu vực
    viewLocation(id: string): Observable<LocationListItem> {
        const url = `bidlocation/${id}/get`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // view chi tiết lý do theo loại
    viewOpportunityReason(id: string, type: string): Observable<OpportunityReasonListItem> {
        let typeUrl;
        switch (type) {
            case SETTING_REASON.Win:
                typeUrl = 'bidopportunitywinreason';
                break;
            case SETTING_REASON.Lose:
            typeUrl = 'bidopportunitylosereason';
                break;
            case SETTING_REASON.Cancel:
            typeUrl = 'bidopportunitycancelreason';
                break;
        }
        const url = `${typeUrl}/${id}/get`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // Xóa nhiều Cấu hình khu vực
    deleteMultipleLocation(arrayId: any) {
        const url = `bidlocation/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel);
    }

    // Xóa nhiều cấu hình loại công trình
    deleteMultipleConstructionType(arrayId: any) {
        const url = `bidconstructiontype/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel);
    }

    // Xóa nhiều hạng mục thi công công trình
    deleteMultipleConstructionCategory(arrayId: any) {
        const url = `bidconstructioncategory/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel);
    }

    // Xóa nhiều tính trạng gói thầu
    deleteMultipleBidStatus(arrayId: any) {
        const url = `bidstatus/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel);
    }

    // Xóa nhiều lý do theo loại
    deleteMultipleOpportunityReason(arrayId: any, type: string) {
        let typeUrl;
        switch (type) {
            case SETTING_REASON.Win:
                typeUrl = 'bidopportunitywinreason';
                break;
            case SETTING_REASON.Lose:
            typeUrl = 'bidopportunitylosereason';
                break;
            case SETTING_REASON.Cancel:
            typeUrl = 'bidopportunitycancelreason';
                break;
        }
        const url = `${typeUrl}/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel)
            .map(data => data.result);
    }

    // Vị trí, chức vụ
    // Tạo mới vị trí, chức vụ
    createOrUpdateLevel(data) {
        const url = data.id ? `level/edit` : `level/create`;
        const model = {
            id: data.id,
            name: data.levelName,
            desc: data.levelDesc
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    // get danh sách vị trí, chức vụ
    readLevel(
        searchTerm: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<LevelListItem>> {
        // const that = this;
        const urlParam = Utils.createSearchParam(searchTerm);
        return this.apiService
            .get(`level/filter/${page}/${pageSize}`, urlParam)
            .map(response => {
                return {
                    currentPage: response.result.pageIndex,
                    pageSize: pageSize,
                    pageCount: response.result.totalPages,
                    total: response.result.totalCount,
                    items: response.result.items
                };
            })
            .share();
    }

    // xóa Vị trí, chức vụ
    deleteLevel(id: number) {
        const url = `level/${id}/delete`;
        return this.apiService
            .post(url)
            .map(response => response.result);
    }

    // view Vị trí, chức vụ
      viewLevel(id: string): Observable<LevelListItem> {
        const url = `level/${id}`;
        return this.apiService.get(url)
            .map(data => data.result);
    }

    // Xóa nhiều Vị trí, chức vụ
    deleteMultipleLevel(arrayId: any) {
        const url = `level/deletemultiple`;
        const requestModel = {
            ids: arrayId,
        };
        return this.apiService.post(url, requestModel);
    }
}
