import { DictionaryItem } from "../models/dictionary-item.model";
import { Injectable } from "@angular/core";
import { URLSearchParams } from "@angular/http";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import Utils from "../helpers/utils.helper";
import { API_URL } from "../configs";
import { CustomerListItem, CustomerModel, PagedResult } from "../models";
import { ApiService, SessionService, InstantSearchService } from "../services";
import { CustomerFilter } from "../models/customer/customer-filter.model";
import { ResourceLoader } from '@angular/compiler';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import { InvoiceInfo } from '../models/invoice/invoice-info';

@Injectable()
export class CustomerService {
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
    ): Observable<PagedResult<CustomerListItem>> {
        return this.apiService
            .get(`/employee/${this.employeeId}/customers/${page}/${pageSize}`)
            .map(response => {
                return {
                    currentPage: response.result.page,
                    pageSize: pageSize,
                    pageCount: response.result.pageCount,
                    total: response.result.recordCount,
                    items: response.result.data.map(this.toCustomerListItem)
                };
            })
            .share();
    }

    createOrUpdate(customer: any) {
        let url = `/employee/${this.employeeId}/customer`;
        url = customer.id ? url + '/edit' : url;
        const assignTo = Utils.parseAssignTo(customer.assignTo);

        const model = {
            id: customer.id,
            name: customer.name,
            website: customer.website,
            fax: customer.fax,
            tel1: customer.phoneNumberOfficial,
            tel2: customer.phoneNumberExtra,
            stockCode: customer.stockCode,
            taxNumber: customer.taxCode,
            email: customer.emailOfficial,
            email2: customer.emailExtra,
            business: customer.career,
            evaluate: customer.rating,
            classify: customer.type,
            group: customer.group,
            revenueDueYear: customer.revenue,
            address: customer.address,
            information: customer.description,
            district: customer.district,
            city: customer.city,
            country: customer.country,
            contacts:
                customer.contact && customer.contact.length > 0
                    ? customer.contact.map(x => ({ id: x.id }))
                    : null,
            customerType: customer.customerType,
            dob: DateTimeConvertHelper.fromDtObjectToTimestamp(customer.dob),
            companyEstablishmentDay: DateTimeConvertHelper.fromDtObjectToTimestamp(
                customer.companyEstablishmentDay
            ),
            gender: customer.gender,
            lunarBirthday: customer.lunarBirthday,
            employee:
                assignTo.assignToType === 'employee'
                    ? {
                          id: assignTo.assignToId
                      }
                    : null,
            employeeGroup:
                assignTo.assignToType === 'group'
                    ? {
                          id: assignTo.assignToId
                      }
                    : null
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    view(customerId: number | string): Observable<CustomerModel> {
        const url = `/employee/${this.employeeId}/customer/${customerId}`;

        return this.apiService
            .get(url)
            .map(response => {
                const result = response.result;
                return {
                    id: result.id,
                    name: result.name,
                    emailOfficial: result.email,
                    website: result.website,
                    emailExtra: result.email2,
                    fax: result.fax,
                    career: result.business,
                    phoneNumberOfficial: result.tel1,
                    group: result.group,
                    stockCode: result.stockCode,
                    rating: result.evaluate ? result.evaluate : 0,
                    taxCode: result.taxNumber,
                    type: result.classify,
                    phoneNumberExtra: result.tel2,
                    revenue: result.revenueDueYear,
                    companyEstablishmentDay: result.companyEstablishmentDay,
                    dob: result.dob,
                    customerType: result.customerType,
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
                    city: result.city,
                    country: result.country,
                    district: result.district,
                    description: result.information,
                    createdDate: result.createdDate,
                    updatedDate: result.updatedDate,
                    prospect: result.prospect && {
                        id: result.prospect.id,
                        fullName: `${result.prospect.lastName} ${
                            result.prospect.firstName
                        }`
                    },
                    contact: result.customerContactGroups.map(x => ({
                        id: x.contact.id,
                        text: `${x.contact.lastName} ${x.contact.firstName}`
                    })),
                    number: result.customerNumber,
                    creditLimit: result.creditLimit,
                    owing: result.owing,
                    customerGroup: result.customerGroup,
                    check: result.check,
                    desc: result.desc,
                    lunarBirthday: result.lunarBirthday,
                    gender: result.gender
                };
            })
            .share();
    }

    delete(ids: number[]) {
        const url = `/employee/${this.employeeId}/customers/delete`;
        return this.apiService.post(url, ids).map(response => response.result);
    }

    instantSearch(
        terms: Observable<string>,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CustomerListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/customers/search/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .search(searchUrl, terms)
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toCustomerListItem)
                };
            });
    }

    instantSearchWithFilter(
        terms: Observable<string>,
        filter: CustomerFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CustomerListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/customers/filter/${page}/${pageSize}/?search=`;

        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                CustomerService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.page,
                    pageSize: pageSize,
                    pageCount: result.pageCount,
                    total: result.recordCount,
                    items: (result.data || []).map(this.toCustomerListItem)
                };
            });
    }
    filter(
        searchTerm: string,
        filter: CustomerFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CustomerListItem>> {
        const filterUrl = `/employee/${
            this.employeeId
        }/customers/filter/${page}/${pageSize}/`;

        const urlParams = CustomerService.createFilterParams(filter);
        urlParams.append('search', searchTerm);

        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toCustomerListItem)
            };
        });
    }

    // tslint:disable-next-line:member-ordering
    private static createFilterParams(filter: CustomerFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append('business', filter.business);
        urlFilterParams.append('group', filter.group);
        urlFilterParams.append('evaluate', filter.evaluate);
        return urlFilterParams;
    }

    search(
        searchString: string,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<CustomerListItem>> {
        const searchUrl = `/employee/${
            this.employeeId
        }/customers/search/${page}/${pageSize}/?search=${searchString}`;

        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                currentPage: result.page,
                pageSize: pageSize,
                pageCount: result.pageCount,
                total: result.recordCount,
                items: (result.data || []).map(this.toCustomerListItem)
            };
        });
    }

    toCustomerListItem(result: any): CustomerListItem {
        return {
            id: result.id,
            customerName: result.name,
            website: result.website,
            fax: result.fax,
            customerPhone: result.tel1,
            taxNo: result.taxNumber,
            email: result.email,
            business: result.business,
            group: result.group,
            rating: result.evaluate ? +result.evaluate : 0,
            revenue: result.revenueDueYear,
            assignTo:
                (result.employee && result.employee.name) ||
                (result.employeeGroup && result.employeeGroup.name),
            checkboxSelected: false
        };
    }

    importFile(file: File) {
        const url = `/employee/${this.employeeId}/customers`;
        const formData = new FormData();
        formData.append('filePath', file);
        return this.apiService
            .postFile(url, formData)
            .map(response => {
                return response;
            })
            .share();
    }

    getContactList(customerId: number) {
        const url = `employee/${
            this.employeeId
        }/contacts/customer/${customerId}`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.id,
                        name: `${x.lastName} ${x.firstName}`,
                        image: x.image
                            ? `data:image/jpeg;base64\,${x.image}`
                            : null,
                        cellularPhone: x.cellularPhone,
                        email: x.email
                    };
                })
            )
            .share();
    }

    getContactListByCustomer(customerId: number) {
        const url = `employee/${
            this.employeeId
        }/contacts/customer/${customerId}`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.id,
                        text: `${x.lastName} ${x.firstName}`
                    };
                })
            )
            .share();
    }

    getProductPriceListByCustomer(customerId: number): Observable<InvoiceInfo> {
        const url = `employee/${this.employeeId}/customerInfor/${customerId}`;
        return this.apiService.get(url).map(data => data.result);
    }
}
