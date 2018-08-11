import { DictionaryItem } from "../models/dictionary-item.model";
import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import Utils from "../helpers/utils.helper";
import { API_URL } from "../configs";
import { ContactListItem, ContactModel, PagedResult } from "../models";
import { ApiService, SessionService, InstantSearchService } from "../services";
import DateTimeConvertHelper from "../helpers/datetime-convert-helper";
import { ContactFilter } from "../models/contact/contact-filter.model";

@Injectable()
export class ContactService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService,
        private instantSearchService: InstantSearchService
    ) { }

    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ContactListItem>> {
        return this.apiService
            .get(`/employee/${this.employeeId}/contacts/${page}/${pageSize}`)
            .map(response => {
                return {
                    currentPage: response.result.page,
                    pageSize: pageSize,
                    pageCount: response.result.pageCount,
                    total: response.result.recordCount,
                    items: response.result.data.map(this.toContactListItem)
                };
            })
            .share();
    }

    createOrUpdate(contactFormValue: any, avatar: string) {
        let url = `/employee/${this.employeeId}/contact`;
        url = contactFormValue.id ? url + "/edit" : url;
        const assignTo = Utils.parseAssignTo(contactFormValue.assignTo);
        const requestModel = {
            id: contactFormValue.id,
            title: contactFormValue.salutation,
            birthday: DateTimeConvertHelper.fromDtObjectToTimestamp(
                contactFormValue.dateOfBirth
            ),
            firstName: contactFormValue.firstName,
            lastName: contactFormValue.lastName,
            customers:
                contactFormValue.customer &&
                    contactFormValue.customer.length > 0
                    ? contactFormValue.customer.map(x => ({ id: x.id }))
                    : null,
            email: contactFormValue.email,
            potentialSource: contactFormValue.prospectSource,
            jobTitle: contactFormValue.jobTitle,
            department: contactFormValue.department,
            phone: contactFormValue.companyPhone,
            cellularPhone: contactFormValue.mobilePhone,
            homePhone: contactFormValue.homePhone,
            secondaryPhone: contactFormValue.extraPhone,
            assistant: contactFormValue.assistant,
            assistantPhone: contactFormValue.assistantPhone,
            information: contactFormValue.description,
            address: contactFormValue.address,
            district: contactFormValue.district,
            city: contactFormValue.city,
            country: contactFormValue.country,
            address2: contactFormValue.otherAddress,
            district2: contactFormValue.otherDistrict,
            city2: contactFormValue.otherCity,
            country2: contactFormValue.otherCountry,
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
            image: avatar,
            gender: contactFormValue.gender,
            lunarBirthday: contactFormValue.lunarBirthday
        };
        return this.apiService
            .post(url, requestModel)
            .map(response => response.result);
    }

    view(contactId: number | string): Observable<ContactModel> {
        const url = `/employee/${this.employeeId}/contact/${contactId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    id: result.id,
                    salutation: result.title || "",
                    firstName: result.firstName,
                    lastName: result.lastName,
                    dateOfBirth: result.birthday,
                    customer: result.customerContactGroups.map(x => ({
                        id: x.customer.id,
                        text: x.customer.name
                    })),
                    prospectSource: result.potentialSource,
                    jobTitle: result.jobTitle,
                    department: result.department,
                    companyPhone: result.phone,
                    mobilePhone: result.cellularPhone,
                    homePhone: result.homePhone,
                    extraPhone: result.secondaryPhone,
                    email: result.email,
                    assistant: result.assistant,
                    assistantPhone: result.assistantPhone,
                    assignTo:
                        (result.employee && {
                            id: `employee_${result.employee.id}`,
                            name: result.employee.name
                        }) ||
                        (result.employeeGroup && {
                            id: `group_${result.employeeGroup.id}`,
                            name: result.employeeGroup.name
                        }),
                    address: result.address,
                    district: result.district,
                    city: result.city,
                    country: result.country,
                    otherAddress: result.address2,
                    otherDistrict: result.district2,
                    otherCity: result.city2,
                    otherCountry: result.country2,
                    description: result.information,
                    contactImageSrc: result.id,
                    createdDate: result.createdDate,
                    updatedDate: result.updatedDate,
                    prospect: result.prospect && {
                        id: result.prospect.id,
                        fullName: `${result.prospect.lastName} ${
                            result.prospect.firstName
                            }`
                    },
                    image: result.image
                        ? `data:image/jpeg;base64\,${result.image}`
                        : "",
                    gender: result.gender,
                    lunarBirthday: result.lunarBirthday
                };
            })
            .share();
    }

    delete(ids: number[]) {
        const url = `/employee/${this.employeeId}/contacts/delete`;
        return this.apiService.post(url, ids).map(response => response.result);
    }

    instantSearch(
        terms: Observable<string>,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ContactListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
            }/contacts/search/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .search(searchUrl, terms)
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toContactListItem)
                };
            });
    }
    instantSearchWithFilter(
        terms: Observable<string>,
        filter: ContactFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ContactListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
            }/contacts/filter/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                ContactService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toContactListItem)
                };
            });
    }
    filter(
        searchTerm: string,
        filter: ContactFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ContactListItem>> {
        const filterUrl = `/employee/${
            this.employeeId
            }/contacts/filter/${page}/${pageSize}/`;

        const urlParams = ContactService.createFilterParams(filter);
        urlParams.append("search", searchTerm);

        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toContactListItem)
            };
        });
    }

    // tslint:disable-next-line:member-ordering
    private static createFilterParams(filter: ContactFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append("prospectSource", filter.prospectSource);
        urlFilterParams.append("jobTitle", filter.jobTitle);
        return urlFilterParams;
    }
    search(
        term: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<ContactListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
            }/contacts/search/${page}/${pageSize}/?search=${term}`;

        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toContactListItem)
            };
        });
    }

    toContactListItem(result: any): ContactListItem {
        return {
            id: result.id,
            salutation: result.title || "",
            firstName: result.firstName,
            lastName: result.lastName,
            companyPhone: result.phone,
            mobilePhone: result.cellularPhone,
            email: result.email,
            companyName: result.customerContactGroups && result.customerContactGroups.length > 0 ?
                result.customerContactGroups.map(i => i.customer.name).join(', ') : null,
            source: result.potentialSource,
            jobTitle: result.jobTitle,
            assignTo:
                (result.employee && result.employee.name) ||
                (result.employeeGroup && result.employeeGroup.name),
            checkboxSelected: false
        };
    }

    importFile(file: File) {
        const url = `/employee/${this.employeeId}/contacts`;
        const formData = new FormData();
        formData.append("filePath", file);
        return this.apiService
            .postFile(url, formData)
            .map(response => {
                return response;
            })
            .share();
    }

    getCustomerListByContact(contactId: number) {
        const url = `employee/${
            this.employeeId
            }/customers/contact/${contactId}`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.id,
                        text: `${x.name}`
                    };
                })
            )
            .share();
    }
}
