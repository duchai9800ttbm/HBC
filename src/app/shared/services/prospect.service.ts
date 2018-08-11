import { DictionaryItem } from "../models/dictionary-item.model";
import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { Observable } from 'rxjs/Observable';

import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";

import { API_URL } from "../configs";
import {
    ProspectListItem,
    ProspectModel,
    PagedResult,
    ProspectFilter
} from "../models";
import { ApiService, SessionService, InstantSearchService } from "../services";
import { ProspectListComponent } from "../../layout/prospect/prospect-list/prospect-list.component";
import Utils from "../helpers/utils.helper";
import { Response } from "@angular/http/src/static_response";

@Injectable()
export class ProspectService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService,
        private instantSearchService: InstantSearchService
    ) {}

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ProspectListItem>> {
        const that = this;
        return that.apiService
            .get(`/employee/${this.employeeId}/prospects/${page}/${pageSize}`)
            .map(response => {
                return {
                    currentPage: response.result.page,
                    pageSize: pageSize,
                    pageCount: response.result.pageCount,
                    total: response.result.recordCount,
                    items: response.result.data.map(this.toProspectListItem)
                };
            })
            .share();
    }

    createOrUpdate(prospectFromValue: any) {
        let url = `/employee/${this.employeeId}/prospect`;
        url = prospectFromValue.id ? url + "/edit" : url;

        const assignTo = Utils.parseAssignTo(prospectFromValue.assignTo);

        const model = {
            id: prospectFromValue.id,
            title: prospectFromValue.name,
            potentialStatus: prospectFromValue.statusSource,
            firstName: prospectFromValue.firstName,
            lastName: prospectFromValue.lastName,
            phone: prospectFromValue.phoneNumberCustomer,
            cellPhone: prospectFromValue.phoneNumberpersonal,
            email: prospectFromValue.email,
            website: prospectFromValue.website,
            company: prospectFromValue.companyName,
            potentialSource: prospectFromValue.source,
            address: prospectFromValue.address,
            rate: prospectFromValue.comment,
            description: prospectFromValue.description,
            business: prospectFromValue.fieldOfAction,
            branch: {
                id: this.sessionService.branchId
            },
            objectType: 'Campaign',
            objectId: prospectFromValue.campaign && prospectFromValue.campaign.id,
            district: prospectFromValue.district,
            city: prospectFromValue.city,
            country: prospectFromValue.country,
            revenue: prospectFromValue.revenue,
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
                    : null,
            gender: prospectFromValue.gender,
            lunarBirthday: prospectFromValue.lunarBirthday
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    view(prospectId: number | string): Observable<ProspectModel> {
        const url = `/employee/${this.employeeId}/prospect/${prospectId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                const prospectModel = new ProspectModel();

                prospectModel.id = result.id;
                prospectModel.name = result.title || "";
                prospectModel.statusSource = result.potentialStatus;
                prospectModel.firstName = result.firstName;
                prospectModel.lastName = result.lastName;
                prospectModel.phoneNumberCustomer = result.phone;
                prospectModel.phoneNumberpersonal = result.cellPhone;
                prospectModel.email = result.email;
                prospectModel.website = result.website;
                prospectModel.companyName = result.company;
                prospectModel.source = result.potentialSource;
                prospectModel.address = result.address;
                prospectModel.comment = result.rate;
                prospectModel.description = result.description;
                prospectModel.assignTo =
                    (result.employee && {
                        id: `employee_${result.employee.id}`,
                        name: result.employee.name
                    }) ||
                    (result.employeeGroup && {
                        id: `group_${result.employeeGroup.id}`,
                        name: result.employeeGroup.name
                    });
                prospectModel.fieldOfAction = result.business;
                prospectModel.district = result.district;
                prospectModel.city = result.city;
                prospectModel.country = result.country;
                prospectModel.revenue = result.revenue;
                prospectModel.createdDate = result.createdDate;
                prospectModel.updatedDate = result.updatedDate;
                prospectModel.objectId = result.objectId;
                prospectModel.gender = result.gender;
                prospectModel.lunarBirthday = result.lunarBirthday;
                return prospectModel;
            })
            .share();
    }

    viewHistory(prospectId: number | string): Observable<ProspectModel> {
        const url = `/employee/${
            this.employeeId
        }/deleted-prospect/${prospectId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                const prospectModel = new ProspectModel();

                prospectModel.id = result.id;
                prospectModel.name = result.title || "";
                prospectModel.statusSource = result.potentialStatus;
                prospectModel.firstName = result.firstName;
                prospectModel.lastName = result.lastName;
                prospectModel.phoneNumberCustomer = result.phone;
                prospectModel.phoneNumberpersonal = result.cellPhone;
                prospectModel.email = result.email;
                prospectModel.website = result.website;
                prospectModel.companyName = result.company;
                prospectModel.source = result.potentialSource;
                prospectModel.address = result.address;
                prospectModel.comment = result.rate;
                prospectModel.description = result.description;
                prospectModel.assignTo =
                    (result.employee && {
                        id: `employee_${result.employee.id}`,
                        name: result.employee.name
                    }) ||
                    (result.employeeGroup && {
                        id: `group_${result.employeeGroup.id}`,
                        name: result.employeeGroup.name
                    });
                prospectModel.fieldOfAction = result.business;
                prospectModel.district = result.district;
                prospectModel.city = result.city;
                prospectModel.country = result.country;
                prospectModel.revenue = result.revenue;
                prospectModel.createdDate = result.createdDate;
                prospectModel.updatedDate = result.updatedDate;

                return prospectModel;
            })
            .share();
    }

    delete(ids: number[]) {
        const url = `/employee/${this.employeeId}/prospects/delete`;

        return this.apiService.post(url, ids).map(response => response.result);
    }

    instantSearch(
        terms: Observable<string>,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ProspectListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/prospects/search/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .search(searchUrl, terms)
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toProspectListItem)
                };
            });
    }

    instantSearchWithFilter(
        terms: Observable<string>,
        filter: ProspectFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ProspectListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/prospects/filter/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                ProspectService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toProspectListItem)
                };
            });
    }

    search(
        term: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ProspectListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/prospects/search/${page}/${pageSize}/?search=${term}`;

        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toProspectListItem)
            };
        });
    }

    filter(
        searchTerm: string,
        filter: ProspectFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ProspectListItem>> {
        const filterUrl = `/employee/${
            this.employeeId
        }/prospects/filter/${page}/${pageSize}/`;

        const urlParams = ProspectService.createFilterParams(filter);
        urlParams.append("search", searchTerm);

        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toProspectListItem)
            };
        });
    }

    // tslint:disable-next-line:member-ordering
    private static createFilterParams(filter: ProspectFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append("rate", filter.rate);
        urlFilterParams.append("prospectSource", filter.prospectSource);
        urlFilterParams.append("business", filter.business);

        return urlFilterParams;
    }

    convertProspect(convertProspectFormValue: any) {
        const url = `/employee/${this.employeeId}/prospect/change`;
        const assignTo = Utils.parseAssignTo(convertProspectFormValue.assignTo);
        const model = {
            id: convertProspectFormValue.id,
            createCustomer: convertProspectFormValue.isNewCustomer ? 1 : 0,
            customerName: convertProspectFormValue.customerName,
            customerType: "Individual",
            createContact: convertProspectFormValue.isNewContact ? 1 : 0,
            business: convertProspectFormValue.customerBusiness,
            title: convertProspectFormValue.contactSalutation,
            firstName: convertProspectFormValue.contactFirstName,
            lastName: convertProspectFormValue.contactLastName,
            email: convertProspectFormValue.contactEmail,
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
            .post(url, model)
            .map(response => response.result);
    }

    toProspectListItem(result: any): ProspectListItem {
        return {
            id: result.id,
            salutation: result.title || "",
            firstName: result.firstName,
            lastName: result.lastName,
            evaluation: result.rate,
            companyPhone: result.phone,
            mobilePhone: result.cellPhone,
            email: result.email,
            companyName: result.company,
            source: result.potentialSource,
            business: result.business,
            assignTo:
                (result.employee && result.employee.name) ||
                (result.employeeGroup && result.employeeGroup.name),
            checkboxSelected: false
        };
    }

    importFile(file: File) {
        const url = `/employee/${this.employeeId}/prospects`;
        const formData = new FormData();
        formData.append("filePath", file, "file xlsx");
        return this.apiService
            .postFile(url, formData)
            .map(response => {
                return response;
            })
            .share();
    }

    checkCustomerName(customerName: string) {
        const url = `employee/${
            this.employeeId
        }/customers/check-name?name=${customerName}`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result;
            })
            .share();
    }

    checkContactName(contactName: string) {
        const url = `employee/${
            this.employeeId
        }/contacts/check-name?name=${contactName}`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result;
            })
            .share();
    }
}
