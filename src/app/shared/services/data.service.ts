import { API_URL } from '../configs/api-url.config';
import { DictionaryItem, DictionaryItemIdString } from '../models/dictionary-item.model';
import { Injectable } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { ApiService } from './api.service';
import { SessionService } from './index';
import { SelectItemWithType } from '../models/select-item-with-type';
import { DepartmentsFormBranches } from '../models/user/departments-from-branches';
import { Levels } from '../models/user/levels';
import { BidGroupUserResponsive } from '../models/api-response/user/group-user/bid-group-user-responsive';

const MODULE_NAMES = {
    prospect: 'prospect',
    customer: 'customer',
    contact: 'contact',
    opportunity: 'opportunity',
    campaign: 'campaign'
};

@Injectable()
export class DataService {
    constructor(
        private apiService: ApiService,
        private sessionService: SessionService
    ) { }

    getBranches(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_BRANCHES)
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

    getSalutations(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_SALUTATIONS)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getProspectSources(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_PROSPECT_SOURCES)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getBusiness(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_BUSINESS)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getProspectEvaluations(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_PROSPECT_EVALUATIONS)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getProspectStatus(): Observable<DictionaryItem[]> {
        return this.apiService
            .get(API_URL.GET_PROSPECT_STATUS)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getCustomers(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/customers`;
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

    getlunarBirthday(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/lunar-years`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x,
                        text: `${x}`
                    };
                })
            )
            .share();
    }

    searchCustomers(query: string): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/customers/?customerName=${query}`;
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

    searchContacts(query: string): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/contacts/?contactName=${query}`;
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

    searchProspects(query: string): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/prospects/?prospectName=${query}`;
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

    searchCampaigns(query: string): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/campaigns/?campaignName=${query}`;
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

    searchOpportunities(query: string): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/opportunities/?opportunityName=${query}`;
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

    getContacts(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/contacts`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.id,
                        text: `${x.firstName} ${x.lastName}`
                    };
                })
            )
            .share();
    }

    getProspects(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/prospects`;
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

    getOpportunities(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/opportunities`;
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

    getCampaigns(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/campaigns`;
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

    getEmployees(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/employees`;
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

    getAssignToItems(): Observable<DictionaryItem[]> {
        const employees$ = this.getEmployees().map(employees =>
            employees.map(employee => {
                return {
                    id: `employee_${employee.id}`,
                    text: employee.text
                };
            })
        );

        const groups$ = this.getEmployeeGroups().map(groups =>
            groups.map(group => {
                return {
                    id: `group_${group.id}`,
                    text: group.text
                };
            })
        );

        return Observable.forkJoin(employees$, groups$).map(items =>
            [].concat.apply([], items)
        );
    }

    getEmployeeGroups(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/groups`;
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

    getCustomerGroups(): Observable<DictionaryItem[]> {
        const url = `/list/customer-groups`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getCustomerClassifies(): Observable<DictionaryItem[]> {
        const url = `/list/customer-classifies`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getOpportunitySteps(): Observable<DictionaryItem[]> {
        const url = `/list/opportunity-steps`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getOpportunityClassifies(): Observable<DictionaryItem[]> {
        const url = `/list/opportunity-classifies`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getCampaignStatus(): Observable<DictionaryItem[]> {
        const url = `/list/campaign-status`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getActivityStatus(): Observable<DictionaryItem[]> {
        const url = `/list/task-status`;
        return this.apiService
            .get(url)
            .map(data =>
                data.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getActivityTypes(): Observable<DictionaryItem[]> {
        const url = `/list/activity-types`;
        return this.apiService
            .get(url)
            .map(data =>
                data.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getEventTypes(): Observable<DictionaryItem[]> {
        const url = `/list/event-types`;
        return this.apiService
            .get(url)
            .map(data =>
                data.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getCampaignTypes(): Observable<DictionaryItem[]> {
        const url = `/list/campaign-types`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getAllByModuleName(moduleName: string): Observable<DictionaryItem[]> {
        switch ((moduleName || '').toLowerCase()) {
            case MODULE_NAMES.customer:
                return this.getCustomers();

            case MODULE_NAMES.contact:
                return this.getContacts();

            case MODULE_NAMES.prospect:
                return this.getProspects();

            case MODULE_NAMES.opportunity:
                return this.getOpportunities();

            case MODULE_NAMES.campaign:
                return this.getCampaigns();
            default:
                break;
        }
    }

    searchAllByModuleName(
        moduleName: string,
        searchTerm: string
    ): Observable<DictionaryItem[]> {
        switch ((moduleName || '').toLowerCase()) {
            case MODULE_NAMES.customer:
                return this.searchCustomers(searchTerm);

            case MODULE_NAMES.contact:
                return this.searchContacts(searchTerm);

            case MODULE_NAMES.prospect:
                return this.searchProspects(searchTerm);

            case MODULE_NAMES.opportunity:
                return this.searchOpportunities(searchTerm);

            case MODULE_NAMES.campaign:
                return this.searchCampaigns(searchTerm);
            default:
                break;
        }
    }

    downloadFile() {
        const url = `/downloadFile`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getListProduct(): Observable<DictionaryItem[]> {
        const url = `/employee/${
            this.sessionService.currentUser.employeeId
            }/products`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.productNo,
                        text: `${x.productName}`
                    };
                })
            )
            .share();
    }

    getListInvoiceStatus(): Observable<DictionaryItem[]> {
        const url = `list/invoice-status`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    getListCoordinatorStatus(): Observable<DictionaryItem[]> {
        const url = `list/coordinator-status`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.value,
                        text: `${x.text}`
                    };
                })
            )
            .share();
    }

    //////////////////////////////

    // Danh sách quý
    getListQuatersOfYear(): Observable<DictionaryItem[]> {
        const url = `data/quartersofyear`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách phân loại khách hàng - màn hình danh sách gói thầu
    getListOpportunityClassifies(): Observable<DictionaryItem[]> {
        const url = `data/opportunityclassifies`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách loại tài liệu hồ sơ mời thầu
    getListBiddocumentTypes(): Observable<DictionaryItem[]> {
        const url = `list/biddocumenttypes`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách khu vực
    getListRegionTypes(): Observable<DictionaryItem[]> {
        const url = `bidlocation/locations`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách vai trò HBC
    getListHBCRoles(): Observable<DictionaryItem[]> {
        const url = `data/hbcroles`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách loại công trình
    getListConstructonTypes(): Observable<DictionaryItem[]> {
        const url = `bidconstructiontype/constructiontypes`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách hạng mục thi công chính
    getListMainConstructionComponents(): Observable<DictionaryItem[]> {
        const url = `bidconstructioncategory/constructionCategories`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách vai trò nhà thầu
    getListBidderRoles(): Observable<DictionaryItem[]> {
        const url = `list/bidderroles`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách ngành nghề
    getListProspectCustomerBusinesses(): Observable<DictionaryItem[]> {
        const url = `data/prospectcustomerbusinesses`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách nhóm khách hàng
    getListCustomerGroup(): Observable<DictionaryItem[]> {
        const url = `data/customergroups`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách phân loại khách hàng - Màn hình tạo mới khách hàng
    getListCustomerTypes(): Observable<DictionaryItem[]> {
        const url = `data/customertypes`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách trạng thái của hồ sơ mời thầu
    getListBidOpportunityStageHSMTStatus(): Observable<DictionaryItem[]> {
        const url = `list/bidopportunitystagehsmtstatus`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách giai đoạn gói thầu
    getListBidOpportunityStages(): Observable<DictionaryItem[]> {
        const url = `data/bidoppportunitystages`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách trạng thái giai đoạn kết quả dự thầu
    getListBidOpportunityStageKQDTStatus(): Observable<DictionaryItem[]> {
        const url = `list/bidopportunitystagekqdtstatus`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách trạng thái giai đoạn hồ sơ dự thầu
    getListBidOpportunityStageHSDTStatus(): Observable<DictionaryItem[]> {
        const url = `list/bidopportunitystagehsdtstatus`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách tình trạng gói thầu
    getListBidOpportunityStatuses(): Observable<DictionaryItem[]> {
        const url = `bidstatus/statuses`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }

    // Danh sách tên dự án
    getListBidOpportunityProjectNames(): Observable<DictionaryItem[]> {
        const url = `list/bidopportunityprojectnames`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`
                    };
                })
            )
            .share();
    }
    // Danh sách quyền(user-group)
    getListPrivileges(): Observable<DictionaryItemIdString[]> {
        const url = `data/privileges`;
        return this.apiService
            .get(url)
            .map(response =>
                response.result.map(x => {
                    return {
                        id: x.key,
                        text: `${x.value}`,
                    };
                }));
    }
    // Danh sách phòng ban theo chi nhánh
    getListDepartmentsFromBranches(): Observable<DepartmentsFormBranches[]> {
        const url = `data/branches/1/departments`;
        return this.apiService.get(url)
            .map( response => {
                const result = response.result;
                return result.map( item => {
                    return {
                        id: item.id,
                        departmentNo: item.departmentNo,
                        departmentName: item.departmentName
                    };
                });
            });
    }
    // Danh sách chức vụ
    getListLevels(): Observable<Levels[]> {
        const url = `data/levels`;
        return this.apiService.get(url)
            .map( response => {
                const result = response.result;
                return result.map( item => {
                    return {
                        id: item.id,
                        levelNo: item.levelNo,
                        levelName: item.levelName
                    };
                });
            });
    }
    // Danh sách nhóm người dùng phân quyền
    getListBidUserGroup(): Observable<BidGroupUserResponsive[]> {
        const url = `bidusergroup/getall`;
        return this.apiService.get(url).map(response => response.result);
    }
    // Danh sách loại tài liệu hồ sơ dự thầu
    getListTenderDocumentType(): Observable<DictionaryItem[]> {
        const url = `tenderdocumenttype/getall`;
        return this.apiService.get(url)
            .map( response => {
                const result = response.result;
                return result.map( item => {
                    return {
                        id: item.key,
                        text: item.value
                    };
                });
            });
    }
}
