import { Injectable } from "@angular/core";
import { SessionService, ApiService, InstantSearchService } from "./index";
import { Observable } from "rxjs/Observable";
import { TranslateService } from "@ngx-translate/core";
import { CampaignListItem, CampaignModel } from "../models/index";
import DateTimeConvertHelper from "../helpers/datetime-convert-helper";
import { PagedResult } from "../models";
import { CampaignFilter } from "../models/campaign/campaign-filter.model";
import { URLSearchParams } from "@angular/http";
import Utils from "../helpers/utils.helper";

@Injectable()
export class CampaignService {
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private instantSearchService: InstantSearchService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CampaignListItem>> {
        const url = `employee/${this.employeeId}/campaigns/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                return {
                    currentPage: response.result.page,
                    pageSize: pageSize,
                    pageCount: response.result.pageCount,
                    total: response.result.recordCount,
                    items: response.result.data.map(this.toCampaignListItem)
                };
            })
            .share();
    }

    instantSearch(
        terms: Observable<string>,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CampaignListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/campaigns/search/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .search(searchUrl, terms)
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toCampaignListItem)
                };
            });
    }

    instantSearchWithFilter(
        terms: Observable<string>,
        filter: CampaignFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CampaignListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/campaigns/filter/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                CampaignService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toCampaignListItem)
                };
            });
    }
    filter(
        searchTerm: string,
        filter: CampaignFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CampaignListItem>> {
        const filterUrl = `/employee/${
            this.employeeId
        }/campaigns/filter/${page}/${pageSize}/`;

        const urlParams = CampaignService.createFilterParams(filter);
        urlParams.append("search", searchTerm);

        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toCampaignListItem)
            };
        });
    }

    // tslint:disable-next-line:member-ordering
    private static createFilterParams(filter: CampaignFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append("type", filter.type);
        urlFilterParams.append("campaignStatus", filter.campaignStatus);
        return urlFilterParams;
    }

    search(
        term: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CampaignListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/campaigns/search/${page}/${pageSize}/?search=${term}`;

        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toCampaignListItem)
            };
        });
    }

    delete(ids: number[]) {
        const url = `/employee/${this.employeeId}/campaigns/delete`;
        return this.apiService.post(url, ids).map(response => response.result);
    }

    view(campaignId: number | string): Observable<CampaignModel> {
        const url = `/employee/${this.employeeId}/campaign/${campaignId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    id: result.id,
                    name: result.name,
                    status: result.campaignStatus,
                    category: result.type,
                    marketingObject: result.campaignObject,
                    assignTo:
                        (result.employee && {
                            id: `employee_${result.employee.id}`,
                            name: result.employee.name
                        }) ||
                        (result.employeeGroup && {
                            id: `group_${result.employeeGroup.id}`,
                            name: result.employeeGroup.name
                        }),
                    campaignDateStart: result.startDate,
                    campaignDateStop: result.completionDate,
                    donors: result.donor,
                    target: result.goals,
                    numberOfParticipants: result.expectedNumber,
                    budget: result.budget,
                    actualCost: result.costs,
                    expectedRevenue: result.expectedRevenue,
                    actualRevenue: result.actualRevenue,
                    expectedInvestmentEfficiency: result.expectedResults,
                    actualInvestmentEfficiency: result.actualResults,
                    description: result.description,
                    createdDate: result.createdDate,
                    updatedDate: result.updatedDate
                };
            })
            .share();
    }

    createOrUpdate(formValue: any) {
        let url = `employee/${this.employeeId}/campaign`;
        url = formValue.id ? url + "/edit" : url;
        const assignTo = Utils.parseAssignTo(formValue.assignTo);
        const requestModel = {
            id: formValue.id,
            name: formValue.name.trim(),
            type: formValue.category,
            campaignStatus: formValue.status,
            startDate: DateTimeConvertHelper.fromDtObjectToTimestamp(
                formValue.campaignDateStart
            ),
            completionDate: DateTimeConvertHelper.fromDtObjectToTimestamp(
                formValue.campaignDateStop
            ),
            goals: formValue.target,
            expectedNumber: formValue.numberOfParticipants,
            donor: formValue.donors,
            campaignObject: formValue.marketingObject,
            budget: formValue.budget,
            costs: formValue.actualCost,
            expectedRevenue: formValue.expectedRevenue,
            actualRevenue: formValue.actualRevenue,
            expectedResults: formValue.expectedInvestmentEfficiency,
            actualResults: formValue.actualInvestmentEfficiency,
            description: formValue.description,
            branch: {
                id: this.sessionService.branchId
            },
            employee:
                assignTo.assignToType === "employee"
                    ? {
                          id: assignTo.assignToId
                      }
                    : null,
            employeeGroup:
                assignTo.assignToType === "group"
                    ? {
                          id: assignTo.assignToId
                      }
                    : null
        };
        return this.apiService
            .post(url, requestModel)
            .map(response => response.result);
    }

    toCampaignListItem(result: any): CampaignListItem {
        return {
            id: result.id,
            name: result.name,
            status: result.campaignStatus,
            category: result.type,
            marketingObject: result.campaignObject,
            assignTo:
                (result.employee && result.employee.name) ||
                (result.employeeGroup && result.employeeGroup.name),
            campaignDateStart: result.startDate,
            campaignDateStop: result.completionDate,
            donors: result.donor,
            target: result.goals,
            numberOfParticipants: result.expectedNumber,
            budget: result.budget,
            actualCost: result.costs,
            expectedRevenue: result.expectedRevenue,
            actualRevenue: result.actualRevenue,
            expectedInvestmentEfficiency: result.expectedResults,
            actualInvestmentEfficiency: result.actualResults,
            description: result.description,
            checkboxSelected: false
        };
    }
}
