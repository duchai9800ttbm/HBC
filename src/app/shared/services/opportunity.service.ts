import { Injectable } from "@angular/core";
import { SessionService } from "./session.service";
import { ApiService } from "./api.service";
import { Observable } from "rxjs/Observable";
import { OpportunityResponse } from "../models/api-response/opportunity/opportunity-response.model";
import { DictionaryItem } from "../models/dictionary-item.model";
import { OpportunityRequest } from "../models/api-request/opportunity/opportunity-request.model";
import { OpportunityListItem } from "../models/opportunity/opportunity-list-item.model";
import { InstantSearchService } from "./index";
import { TranslateService } from "@ngx-translate/core";
import { OpportunityModel } from "../models/index";
import DateTimeConvertHelper from "../helpers/datetime-convert-helper";
import { PagedResult } from "../models";
import { URLSearchParams } from "@angular/http";
import Utils from "../helpers/utils.helper";
import { OpportunityFilter } from "../models/opportunity/opportunity-filter.model";
@Injectable()
export class OpportunityService {
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private instantSearchService: InstantSearchService,
        private translateService: TranslateService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const url = `/employee/${
            this.employeeId
        }/opportunities/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                return {
                    currentPage: response.result.page,
                    pageSize: pageSize,
                    pageCount: response.result.pageCount,
                    total: response.result.recordCount,
                    items: response.result.data.map(this.toOpportunityListItem)
                };
            })
            .share();
    }

    instantSearch(
        terms: Observable<string>,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/opportunities/search/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .search(searchUrl, terms)
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toOpportunityListItem)
                };
            });
    }

    instantSearchWithFilter(
        terms: Observable<string>,
        filter: OpportunityFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/opportunities/filter/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                OpportunityService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toOpportunityListItem)
                };
            });
    }
    filter(
        searchTerm: string,
        filter: OpportunityFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const filterUrl = `/employee/${
            this.employeeId
        }/opportunities/filter/${page}/${pageSize}/`;

        const urlParams = OpportunityService.createFilterParams(filter);
        urlParams.append("search", searchTerm);

        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toOpportunityListItem)
            };
        });
    }

    // tslint:disable-next-line:member-ordering
    private static createFilterParams(
        filter: OpportunityFilter
    ): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append("classify", filter.classify);
        urlFilterParams.append("step", filter.step);
        return urlFilterParams;
    }

    search(
        term: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/opportunities/search/${page}/${pageSize}/?search=${term}`;

        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toOpportunityListItem)
            };
        });
    }

    delete(ids: number[]) {
        const url = `/employee/${this.employeeId}/opportunities/delete`;
        return this.apiService.post(url, ids).map(response => response.result);
    }

    view(opportunityId: number | string): Observable<OpportunityModel> {
        const url = `/employee/${this.employeeId}/opportunity/${opportunityId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    id: result.id,
                    name: result.name,
                    opportunityDateStop: result.completionDate,
                    customer: result.customer && {
                        id: result.customer.id,
                        name: result.customer.name
                    },
                    contact: result.customerContact && {
                        id: result.customerContact.id,
                        salutation: result.customerContact.title || "",
                        firstName: result.customerContact.firstName,
                        lastName: result.customerContact.lastName
                    },
                    contacts: result.opportunityContactGroups.map(x => ({
                        id: x.contact.id,
                        text: `${x.contact.lastName} ${x.contact.firstName}`
                    })),
                    category: result.classify,
                    prospectSource: result.potentialSources,
                    amount: result.amount,
                    phase: result.step,
                    probability: result.probability,
                    campaign: result.campaign && {
                        id: result.campaign.id,
                        name: result.campaign.name
                    },
                    assignTo:
                        (result.employee && {
                            id: `employee_${result.employee.id}`,
                            name: result.employee.name
                        }) ||
                        (result.employeeGroup && {
                            id: `group_${result.employeeGroup.id}`,
                            name: result.employeeGroup.name
                        }),
                    description: result.description,
                    expectedValue: result.expectedValue,
                    createdDate: result.createdDate,
                    updatedDate: result.updatedDate
                };
            })
            .share();
    }

    createOrUpdate(formValue: any) {
        let url = `employee/${this.employeeId}/opportunity`;
        url = formValue.id ? url + "/edit" : url;
        const assignTo = Utils.parseAssignTo(formValue.assignTo);

        const requestModel = {
            id: formValue.id,
            name: formValue.name,
            classify: formValue.category,
            potentialSources: formValue.prospectSource,
            amount: formValue.amount,
            completionDate: DateTimeConvertHelper.fromDtObjectToTimestamp(
                formValue.opportunityDateStop
            ),
            campaign: {
                id: formValue.campaign && formValue.campaign.id
            },
            step: formValue.phase,
            probability: formValue.probability,
            strategy: formValue.campaignName,
            expectedValue: formValue.expectedValue,
            description: formValue.description,
            branch: {
                id: this.sessionService.branchId
            },
            customer: {
                id: formValue.customer && formValue.customer.id
            },
            contacts:
                formValue.contact && formValue.contact.length > 0
                    ? formValue.contact.map(x => ({ id: x.id }))
                    : null,
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
        console.log(requestModel);
        return this.apiService
            .post(url, requestModel)
            .map(response => response.result);
    }

    toOpportunityListItem(result: any): OpportunityListItem {
        return {
            id: result.id,
            opportunityName: result.name,
            customerName: result.customer && result.customer.name,
            // tslint:disable-next-line:max-line-length
            contact: result.opportunityContactGroups.map(i => `${i.contact.lastName} ${i.contact.firstName}`).join(', '),
            category: result.classify,
            probability: result.probability,
            amount: result.amount,
            phase: result.step,
            assignTo:
                (result.employee && result.employee.name) ||
                (result.employeeGroup && result.employeeGroup.name),
            checkboxSelected: false,
            expectedValue: result.expectedValue
        };
    }

    getOpportunitiesByModuleItemId(
        moduleName: string,
        moduleItemId: number | string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<OpportunityListItem>> {
        const url = `employee/${
            this.employeeId
        }/opportunities/${moduleName}/${moduleItemId}/${page}/${pageSize}`;
        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toOpportunityListItem)
                };
            })
            .share();
    }
}
