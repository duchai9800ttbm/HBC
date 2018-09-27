import { Injectable } from '@angular/core';
import { FilterPipe } from '../../../../node_modules/ngx-filter-pipe';
import * as moment from 'moment';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import { Observable } from '../../../../node_modules/rxjs';
import { ActivityFilter } from '../models/activity/activity-filter.model';
import { PackageListItem } from '../models/package/package-list-item';
import { PackageFilter } from '../models/package/package-filter.model';
import { URLSearchParams } from '@angular/http';
import { InstantSearchService } from './instant-search.service';
import { PagedResult } from '../models/paging-result.model';
import { ApiService } from './api.service';
import { PackageModel } from '../models/package/package.model';
import { FieldModel } from '../models/package/field.model';
import { PackageInfoModel } from '../models/package/package-info.model';
import { Subject } from '../../../../node_modules/rxjs';
import { BidUserGroupMemberResponsive } from '../models/api-response/setting/bid-user-group-member-responsive';
import { SETTING_BID_USER, SETTING_BID_STAGE } from '../configs/common.config';
import { BidPermissionGroupResponsive } from '../models/api-response/setting/bid-permission-group-responsive';
import * as FileSaver from 'file-saver';
import { TenderPreparationPlanningRequest } from '../models/api-request/package/tender-preparation-planning-request';

@Injectable()
export class PackageService {
    private isSummaryConditionForm = new Subject<boolean>();
    public isSummaryConditionForm$ = this.isSummaryConditionForm.asObservable();
    private userIdSub = new Subject<any>();
    public kickOff = new Subject<any>();
    public routerAction = '';
    private routerActionSub = new Subject<string>();
    routerAction$ = this.routerActionSub.asObservable();
    userId$ = this.userIdSub.asObservable();
    kickOff$ = this.kickOff.asObservable();
    routerBeforeEmail: string;
    private static createFilterParams(filter: PackageFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append('projectName', filter.projectName);
        urlFilterParams.append(
            'opportunityClassify',
            filter.opportunityClassify
        );
        urlFilterParams.append('stage', filter.stage);
        urlFilterParams.append('chairEmployeeId', filter.chairEmployeeId);
        urlFilterParams.append(
            'minCost',
            filter.minCost.toString()
        );
        urlFilterParams.append(
            'maxCost',
            filter.maxCost.toString()
        );
        urlFilterParams.append('sorting', filter.sorting);
        console.log('urlFilterParams', urlFilterParams);
        return urlFilterParams;
    }

    private static toPackageListItem(result: any): PackageListItem {
        return {
            bidOpportunityId: result.bidOpportunityId,
            classify: result.classify ?  result.classify.value : '',
            amount: result.amount,
            opportunityName: result.opportunityName,
            projectName: result.projectName,
            projectType: result.projectType && {
                key: result.projectType.key,
                value: result.projectType.value,
                displayText: result.projectType.displayText
            },
            hbcRole: result.hbcRole && {
                type: result.hbcRole.type,
                name: result.hbcRole.name
            },
            chairEmployee: result.chairEmployee && {
                id: result.chairEmployee.id,
                employeeId: result.chairEmployee.employeeId,
                employeeNo: result.chairEmployee.employeeNo,
                employeeName: result.chairEmployee.employeeName,
                employeeAddress: result.chairEmployee.employeeAddress,
                employeeDob: result.chairEmployee.employeeDob,
                employeeTel: result.chairEmployee.employeeTel,
                employeeTel1: result.chairEmployee.employeeTel1,
                departmentName: result.chairEmployee.departmentName,
                levelName: result.chairEmployee.levelName,
                employeeAvatar: result.chairEmployee.employeeAvatar,
                departmentRoomName: result.chairEmployee.departmentRoomName,
                branchName: result.chairEmployee.branchName,
                employeeBirthPlace: result.chairEmployee.employeeBirthPlace,
                employeeIDNumber: result.chairEmployee.employeeIDNumber,
                employeeGender: result.chairEmployee.employeeIDNumber,
                employeeTaxNumber: result.chairEmployee.employeeTaxNumber,
                employeeBankAccount: result.chairEmployee.employeeBankAccount
            },
            quarter: result.quarter && {
                type: result.quarter.type,
                name: result.quarter.name
            },
            magnitude: result.magnitude,
            stage: result.stage && {
                key: result.stage.key,
                value: result.stage.value,
                displayText: result.stage.displayText
            },
            stageStatus: result.stageStatus && {
                key: result.stageStatus.key,
                value: result.stageStatus.value,
                displayText: result.stageStatus.displayText
            },
            location: result.location && {
                key: result.location.key,
                value: result.location.value,
                displayText: result.location.displayText
            },
            projectNo: result.projectNo,
            job: result.job,
            place: result.place,
            region: result.region,
            customer: result.customer && {
                id: result.customer.id,
                customerId: result.customer.customerId,
                customerName: result.customer.customerName,
                customerNo: result.customer.customerNo,
                customerDesc: result.customer.customerDesc,
                customerClassify: result.customer.customerClassify,
                customerNewOldType: result.customer.customerNewOldType,
                customerPhone: result.customer.customerPhone,
                customerAddress: result.customer.customerAddress
            },
            customerContact: result.customerContact && {
                id: result.customerContact.id,
                name: result.customerContact.name
            },
            consultantUnitCustomer: result.consultantUnitCustomer && {
                id: result.consultantUnitCustomer.id,
                customerId: result.consultantUnitCustomer.customerId,
                customerName: result.consultantUnitCustomer.customerName,
                customerNo: result.consultantUnitCustomer.customerNo,
                customerDesc: result.consultantUnitCustomer.customerDesc,
                customerClassify:
                    result.consultantUnitCustomer.customerClassify,
                customerNewOldType:
                    result.consultantUnitCustomer.customerNewOldType,
                customerPhone: result.consultantUnitCustomer.customerPhone,
                customerAddress: result.consultantUnitCustomer.customerAddress
            },
            consultantAddress: result.consultantAddress,
            consultantPhone: result.consultantPhone,
            floorArea: result.floorArea,
            mainBuildingCategory: result.mainBuildingCategory && {
                key: result.mainBuildingCategory.key,
                value: result.mainBuildingCategory.value,
                displayText: result.mainBuildingCategory.displayText
            },
            documentLink: result.documentLink,
            status: result.status && {
                key: result.status.key,
                value: result.status.value,
                displayText: result.status.displayText
            },
            progress: result.progress,
            acceptanceReason: result.acceptanceReason,
            unacceptanceReason: result.unacceptanceReason,
            cancelReason: result.cancelReason,
            evaluation: result.evaluation,
            startTrackingDate: result.startTrackingDate,
            submissionDate: result.submissionDate,
            resultEstimatedDate: result.resultEstimatedDate,
            projectEstimatedStartDate: result.projectEstimatedStartDate,
            projectEstimatedEndDate: result.projectEstimatedEndDate,
            totalTime: result.totalTime,
            description: result.description
        };
    }

    constructor(
        private filterService: FilterPipe,
        private instantSearchService: InstantSearchService,
        private apiService: ApiService
    ) { }

    setRouterAction(data: string) {
        this.routerAction = data;
        this.routerActionSub.next(data);
    }

    // active step
    setUserId(data: boolean) {
        this.userIdSub.next(data);
    }
    setActiveKickoff(data: boolean) {
        this.kickOff.next(data);
    }

    setSummaryConditionForm(data: boolean) {
        this.isSummaryConditionForm.next(data);
    }

    filter(
        terms: string,
        status: string,
        uploader: string,
        uploadDate: number,
        source: any[]
    ): any[] {
        const list = this.convertNestedJson(source);
        const listSource = this.sortAndSearchFileName(
            terms,
            status,
            uploader,
            uploadDate,
            list
        );
        return this.group(listSource);
    }

    filterList(
        searchTerm: string,
        filter: PackageFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<PackageListItem>> {
        const filterUrl = `bidopportunity/filter/${page}/${pageSize}?searchTerm=${searchTerm}`;
        const urlParams = PackageService.createFilterParams(filter);
        // urlParams.append('search', searchTerm);
        return this.apiService.get(filterUrl, urlParams).map(response => {
            const result = response.result;
            return {
                currentPage: result.pageIndex,
                pageSize: result.pageSize,
                pageCount: result.totalPages,
                total: result.totalCount,
                items: (result.items || []).map(
                    PackageService.toPackageListItem
                )
            };
        });
    }

    filterNoGroup(
        terms: string,
        status: string,
        uploader: string,
        uploadDate: number,
        source: any[]
    ) {
        const list = this.convertJson(source);
        const listSource = this.sortAndSearchFileName(
            terms,
            status,
            uploader,
            uploadDate,
            list
        );
        const listFormat = this.formatJson(listSource);
        return listFormat;
    }

    convertNestedJson(source: any[]) {
        const arr = source
            .map(x => {
                return x.item.map(y => {
                    const day = moment.utc(y.uploadDate * 1000).get('date');
                    const month = moment.utc(y.uploadDate * 1000).get('month');
                    const year = moment.utc(y.uploadDate * 1000).get('year');
                    return {
                        typeOfDocument: x.typeOfDocument,
                        id: y.id,
                        fileName: y.fileName,
                        version: y.version,
                        status: y.status,
                        uploadPeople: y.uploadPeople,
                        uploadDate: y.uploadDate,
                        day: day,
                        month: month + 1,
                        year: year
                    };
                });
            })
            .concat();
        return [].concat(...arr);
    }

    convertJson(source: any[]) {
        source.forEach(element => {
            element.day = moment.utc(element.uploadDate * 1000).get('date');
            element.month =
                moment.utc(element.uploadDate * 1000).get('month') + 1;
            element.year = moment.utc(element.uploadDate * 1000).get('year');
        });
        return source;
    }

    formatJson(source: any[]) {
        source.forEach(element => {
            delete element.day;
            delete element.month;
            delete element.year;
        });
        return source;
    }

    sortAndSearchFileName(
        fileName,
        status,
        uploader,
        uploadDate,
        source: any[]
    ) {
        let day = null,
            month = null,
            year = null;
        if (uploadDate) {
            const today = new Date(moment(uploadDate).unix());
            day = moment(uploadDate).get('date');
            month = moment(uploadDate).get('month') + 1;
            year = moment(uploadDate).get('year');
        }
        return this.filterService.transform(source, {
            fileName: `${fileName ? fileName : ''}`,
            status: `${status ? status : ''}`,
            uploadPeople: `${uploader ? uploader : ''}`,
            day: `${day ? day : ''}`,
            month: `${month ? month : ''}`,
            year: `${year ? year : ''}`
        });
    }

    group(source: any[]) {
        const groupedObj = source.reduce((prev, cur) => {
            if (!prev[cur['typeOfDocument']]) {
                prev[cur['typeOfDocument']] = [cur];
            } else {
                prev[cur['typeOfDocument']].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(typeOfDocument => ({
            typeOfDocument,
            item: groupedObj[typeOfDocument]
        }));
    }

    instantSearchWithFilter(
        terms: Observable<string>,
        filter: PackageFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<PagedResult<PackageListItem>> {
        const searchUrl = `bidopportunity/filter/${page}/${pageSize}?searchTerm=`;
        return this.instantSearchService
            .searchWithFilter(
                searchUrl,
                terms,
                PackageService.createFilterParams(filter)
            )
            .map(result => {
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: (result.items || []).map(
                        PackageService.toPackageListItem
                    )
                };
            });
    }
    // get chi tiết gói thầu
    getInforPackageID(
        bidOpportunityId: number | string
    ): Observable<PackageInfoModel> {
        const searchUrl = `bidopportunity/${bidOpportunityId}`;
        return this.apiService.get(searchUrl).map(response => {
            const result = response.result;
            return {
                id: result.bidOpportunityId,
                classify: result.classify,
                amount: result.amount,
                opportunityName: result.opportunityName,
                projectName: result.projectName,
                projectType: result.projectType && {
                    id: result.projectType.key,
                    text: result.projectType.value
                },
                hbcRole: result.hbcRole && {
                    id: result.hbcRole.type,
                    text: result.hbcRole.name
                },
                chairEmployee: result.chairEmployee && {
                    id: result.chairEmployee.employeeId,
                    text: result.chairEmployee.employeeName
                },
                quarter: result.quarter && {
                    id: result.quarter.type,
                    text: result.quarter.name
                },
                magnitude: result.magnitude,
                stage: result.stage && {
                    id: result.stage.key,
                    text: result.stage.value
                },
                stageStatus: result.stageStatus && {
                    id: result.stageStatus.key,
                    text: result.stageStatus.value
                },
                hsmtStatus: {
                    id: result.hsmtStatus.key,
                    text: result.hsmtStatus.value
                },
                location: result.location && {
                    id: result.location.key,
                    text: result.location.value
                },
                projectNo: result.projectNo,
                job: result.job,
                place: result.place,
                region: result.region,
                customer: result.customer && {
                    id: result.customer.customerId,
                    text: result.customer.customerName,
                    customerNewOldType: result.customer.customerNewOldType
                },
                customerContact: result.customerContact && {
                    id: result.customerContact.id,
                    text: result.customerContact.name
                },
                consultantUnitCustomer: result.consultantUnitCustomer && {
                    id: result.consultantUnitCustomer.customerId,
                    text: result.consultantUnitCustomer.customerName,
                    classify: result.consultantUnitCustomer.customerClassify
                },
                consultantAddress: result.consultantAddress,
                consultantPhone: result.consultantPhone,
                floorArea: result.floorArea,
                mainBuildingCategory: result.mainBuildingCategory && {
                    id: result.mainBuildingCategory.key,
                    text: result.mainBuildingCategory.value
                },
                documentLink: result.documentLink,
                status: result.status && {
                    id: result.status.key,
                    text: result.status.value
                },
                progress: result.progress,
                acceptanceReason: result.acceptanceReason,
                unacceptanceReason: result.unacceptanceReason,
                cancelReason: result.cancelReason,
                evaluation: result.evaluation,
                startTrackingDate: result.startTrackingDate,
                submissionDate: result.submissionDate,
                resultEstimatedDate: result.resultEstimatedDate,
                projectEstimatedStartDate: result.projectEstimatedStartDate,
                projectEstimatedEndDate: result.projectEstimatedEndDate,
                totalTime: result.totalTime,
                description: result.description
            };
        });
    }



    getRegiontypesPackage(): Observable<any> {
        const url = `data/regiontypes`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getQuartersofyear(): Observable<any> {
        const url = `data/quartersofyear`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getOpportunityclassifies(): Observable<any> {
        const url = `data/opportunityclassifies`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getConstructiontypes(): Observable<any> {
        const url = `data/constructiontypes`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getMainconstructioncomponents(): Observable<any> {
        const url = `data/mainconstructioncomponents`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getBidderroles(): Observable<any> {
        const url = `data/bidderroles`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getBidopportunitystatuses(): Observable<any> {
        const url = `data/bidopportunitystatuses`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getBidoppportunitystages(): Observable<any> {
        const url = `data/bidoppportunitystages`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getProspectcustomerbusinesses(): Observable<any> {
        const url = `data/prospectcustomerbusinesses`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }

    getCustomergroups(): Observable<any> {
        const url = `data/customergroups`;
        return this.apiService.get(url).map(response => {
            const result = response.result;
            return result.map(i => {
                return {
                    id: i.key,
                    text: i.value
                };
            });
        });
    }
    ////////////////////
    // Tạo mới gói thầu
    createOpportunity(formValue: any): Observable<any> {
        const url = `bidopportunity/create`;
        console.log('formValue.projectEstimatedStartDate', formValue.projectEstimatedStartDate);
        const inforPackage = {
            projectName: formValue.projectName,
            projectNo: formValue.projectNo,
            opportunityName: formValue.opportunityName,
            job: formValue.job,
            place: formValue.place,
            locationId: formValue.locationId,
            quarter: formValue.quarter,
            customerId: formValue.customerId ? formValue.customerId.id : null,
            // classify: formValue.classify,
            customerContactId: formValue.customerContactId
                ? formValue.customerContactId.id
                : null,
            consultantUnitCustomerId: formValue.consultantUnitCustomerId
                ? formValue.consultantUnitCustomerId.id
                : 0,
            consultantAddress: formValue.consultantAddress,
            consultantPhone: formValue.consultantPhone,
            floorArea: formValue.floorArea,
            magnitude: formValue.magnitude,
            constructionTypeId: formValue.constructionTypeId,
            constructionCategoryId: formValue.constructionCategoryId,
            hbcRole: formValue.hbcRole,
            documentLink: formValue.documentLink,
            chairEmployeeId: formValue.chairEmployeeId
                ? +formValue.chairEmployeeId
                : 0,
            bidStatusId: formValue.bidStatusId,
            amount: formValue.amount ? formValue.amount : 0,
            evaluation: formValue.evaluation,
            startTrackingDate: moment(formValue.startTrackingDate).unix(),
            submissionDate: moment(formValue.submissionDate).unix(),
            resultEstimatedDate: moment(formValue.resultEstimatedDate).unix(),
            projectEstimatedStartDate: moment(
                formValue.projectEstimatedStartDate
            ).unix(),
            projectEstimatedEndDate: moment(
                formValue.projectEstimatedEndDate
            ).unix(),
            totalTime: formValue.totalTime,
            description: formValue.description
        };
        return this.apiService
            .post(url, inforPackage)
            .map(response => response)
            .share();
    }
    // Edit goi thau
    EditOpportunity(formValue: any): Observable<any> {
        const url = `bidopportunity/edit`;
        const inforPackage = {
            id: formValue.id,
            projectName: formValue.projectName,
            projectNo: formValue.projectNo,
            opportunityName: formValue.opportunityName,
            job: formValue.job,
            place: formValue.place,
            locationId: formValue.locationId,
            quarter: formValue.quarter,
            customerId: formValue.customerId ? formValue.customerId.id : null,
            // classify: formValue.classify,
            customerContactId: formValue.customerContactId
                ? formValue.customerContactId.id
                : null,
            consultantUnitCustomerId: formValue.consultantUnitCustomerId
                ? formValue.consultantUnitCustomerId.id
                : 0,
            consultantAddress: formValue.consultantAddress,
            consultantPhone: formValue.consultantPhone,
            floorArea: formValue.floorArea,
            magnitude: formValue.magnitude,
            constructionTypeId: formValue.constructionTypeId,
            constructionCategoryId: formValue.constructionCategoryId,
            hbcRole: formValue.hbcRole,
            documentLink: formValue.documentLink,
            chairEmployeeId: formValue.chairEmployeeId
                ? +formValue.chairEmployeeId
                : 0,
            bidStatusId: formValue.bidStatusId,
            amount: formValue.amount ? formValue.amount : 0,
            evaluation: formValue.evaluation,
            startTrackingDate: moment(formValue.startTrackingDate).unix(),
            submissionDate: moment(formValue.submissionDate).unix(),
            resultEstimatedDate: moment(formValue.resultEstimatedDate).unix(),
            projectEstimatedStartDate: moment(
                formValue.projectEstimatedStartDate
            ).unix(),
            projectEstimatedEndDate: moment(
                formValue.projectEstimatedEndDate
            ).unix(),
            totalTime: formValue.totalTime,
            description: formValue.description,
            cancelReason: formValue.cancelReason,
            acceptanceReason: formValue.acceptanceReason,
            unacceptanceReason: formValue.unacceptanceReason,
            progress: formValue.progress
        };
        return this.apiService
            .post(url, inforPackage)
            .map(response => {
                return response;
            })
            .share();
    }
    // Xóa gói thầu
    deleteOpportunity(id: any): Observable<any> {
        const url = `bidopportunity/delete`;
        return this.apiService
            .post(url, {
                id: id
            })
            .map(response => {
                return response;
            })
            .share();
    }
    // Liên hệ khách hàng - Màn hình tạo mới gói thầu
    getListCustomercontact(searchTerm: string): Observable<any> {
        const url = `customercontact/0/10/?searchTerm=${searchTerm}`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result.items.map(x => {
                    return {
                        id: x.id,
                        text: x.name
                    };
                });
            })
            .share();
    }

    //
    getListCustomer(searchTerm: string): Observable<any> {
        const url = `customer/search/0/10/?searchTerm=${searchTerm}`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result.items.map(x => {
                    return {
                        id: x.customerId,
                        text: x.customerName,
                        customerNewOldType: x.customerNewOldType,
                        customerPhone: x.customerPhone,
                        customerAddress: x.customerAddress
                    };
                });
            })
            .share();
    }

    // Lấy cấu hình màn hình hiển thị danh sách gói thầu
    getListFields(userId: number): Observable<FieldModel[]> {
        const url = `bidopportunity/user/${userId}/fields`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result.map(x => {
                    return {
                        id: x.id,
                        fieldName: x.fieldName,
                        fieldCaption: x.fieldCaption,
                        hidden: x.hidden
                    };
                });
            })
            .share();
    }

    // Lưu cấu hình màn hình hiển thị danh sách gói thầu
    updateFieldConfigs(listField: FieldModel[], userId: number) {
        const url = `bidopportunity/fieldconfigs/update`;
        const model = {
            userId: userId,
            entityFields: listField
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    // default config
    getListFieldsDefault(): Observable<FieldModel[]> {
        const url = `bidopportunity/defaultfields`;
        return this.apiService
            .get(url)
            .map(response => {
                return response.result.map(x => {
                    return {
                        id: x.id,
                        fieldName: x.fieldName,
                        fieldCaption: x.fieldCaption,
                        hidden: x.hidden
                    };
                });
            })
            .share();
    }

    // Create New Customer
    createCustomer(customer: any) {
        const url = `customer/create`;
        const model = {
            name: customer.name,
            website: customer.website,
            email: customer.email,
            phone: customer.phone,
            taxNumber: customer.taxNumber,
            stockCode: customer.stockCode,
            startWorkingFromDate: moment(customer.startWorkingFromDate).unix(),
            type: customer.type,
            address: customer.address,
            assignedEmployeeID: customer.assignedEmployeeID,
            customerContactId:
                customer.customerContactId && customer.customerContactId.id,
            business: customer.business,
            customerGroup: customer.customerGroup,
            classify: customer.classify,
            evaluate: customer.evaluate,
            revenueDueYear: customer.revenueDueYear,
            establishmentDate: moment(customer.establishmentDate).unix(),
            description: customer.description,
            isPosted: customer.isPosted,
            role: customer.role,
            manageDepartmentName: customer.manageDepartmentName,
            manageDepartmentPhone: customer.manageDepartmentPhone,
            district: customer.district,
            city: customer.city,
            country: customer.country
        };
        return this.apiService
            .post(url, model)
            .map(response => response.result);
    }

    // Danh sách user của các nhóm trong "phân công người đảm nhận vị trí trong gói thầu"
    getBidGroupMembers(
        bidId: number,
        type: string
    ): Observable<BidUserGroupMemberResponsive[]> {
        let url = `bidopportunity/${bidId}/`;
        switch (type) {
            case SETTING_BID_USER.GroupMember:
                url += 'bidusergroupmembers';
                break;
            case SETTING_BID_USER.StackHolder:
                url += 'bidusergroupmembersofstakeholders';
                break;
        }
        return this.apiService.get(url).map(response => response.result);
    }

    updateBidGroupMembers(bidId: number, data): Observable<any> {
        const url = `bidopportunity/${bidId}/changebidusergroupmembers`;
        return this.apiService.post(url, data).map(response => response.result);
    }

    // Danh sách nhóm người thuộc các quyền trong các giai đoạn
    getBidPermissionGroupByStage(
        bidId: number,
        type: string
    ): Observable<BidPermissionGroupResponsive[]> {
        let url = `bidopportunity/${bidId}/`;
        switch (type) {
            case SETTING_BID_STAGE.Hsdt:
                url += 'bidpermissiongrouphsdt';
                break;
            case SETTING_BID_STAGE.Hsmt:
                url += 'bidpermissiongrouphsmt';
                break;
            case SETTING_BID_STAGE.Kqdt:
                url += 'bidpermissiongroupkqdt';
                break;
        }
        return this.apiService.get(url).map(response => response.result);
    }

    updateBidPermissionGroupByStage(bidId: number, data): Observable<any> {
        const url = `bidopportunity/${bidId}/changebidusergrouppermission`;
        return this.apiService.post(url, data).map(response => response.result);
    }

    exportExcel(
        idUser: number,
        searchTerm: string,
        filter: PackageFilter,
    ) {
        const filterUrl = `bidopportunity/export?userId=${idUser}`;
        const urlParams = PackageService.createFilterParams(filter);
        urlParams.append('searchTerm', searchTerm);
        return this.apiService.getFileHBC(filterUrl, urlParams).map(response => {
            return FileSaver.saveAs(
                new Blob([response.file], {
                    type: `${response.file.type}`,
                }), response.fileName
            );
        });
    }
    // get chi tiết bảng tóm tắt điều kiện dự thầu
    getTenderConditionSummary(packageId: number): Observable<any> {
        const url = `${packageId}/tenderconditionalsummary`;
        return this.apiService.get(url).map(response => response.result);
    }
    // tạo mới or update bảng tóm tắt điều kiện dự thầu
    createOrUpdateTenderConditionSummary(data): Observable<any> {
        const url = `tenderconditionalsummary/createorupdate`;
        return this.apiService.post(url, data).map(response => response.result);
    }
    // tạo mới or update phiếu đề nghị dự thầu
    createOrUpdateProposedTenderParticipateReport(data): Observable<any> {
        const url = `proposedtenderparticipatinngreport/createorupdate`;
        return this.apiService.post(url, data).map(response => response.result);
    }
    // get chi tiết phiếu đề nghị dự thầu
    getProposedTenderParticipateReport(bidOpportunityId: number): Observable<any> {
        const url = `${bidOpportunityId}/bidopportunity/proposedtenderparticipatinngreport`;
        return this.apiService.get(url).map(response => response.result);
    }
    // xóa phiếu đề nghị dự thầu
    deleteProposedTenderParticipateReport(bidOpportunityId: number): Observable<any> {
        const url = `bidopportunity/${bidOpportunityId}/proposedtenderparticipatinngreport/delete`;
        return this.apiService.post(url).map(response => response.result);
    }
    // gửi duyệt đề nghị dự thầu
    sendApproveBidProposal(bidOpportunityId: number, date: number): Observable<any> {
        const url = `bidopportunity/hsdt/${bidOpportunityId}/guiduyetdenghiduthau`;
        return this.apiService.post(url, {
            expectedAcceptanceDate: date
        }).map(response => response.result);
    }
    // duyệt đề nghị dự thầu
    approveBidProposal(bidOpportunityId: number, reason: string): Observable<any> {
        const url = `bidopportunity/hsdt/${bidOpportunityId}/duyetdenghiduthau`;
        return this.apiService.post(url, {
            reason: reason
        }).map(response => response.result);
    }
     // Không duyệt đề nghị dự thầu
     notApproveBidProposal(bidOpportunityId: number, reason: string): Observable<any> {
        const url = `bidopportunity/hsdt/${bidOpportunityId}/khongduyetdenghiduthau`;
        return this.apiService.post(url, {
            reason: reason
        }).map(response => response.result);
    }
    // tải template phiếu đề nghị dự thầu
    downloadProposedTenderParticipateReport() {
        const url = `proposedtenderparticipatinngreport/template/downoad`;
        return this.apiService.getFile(url).map(response => {
            return FileSaver.saveAs(
                new Blob([response.file], {
                    type: `${response.file.type}`,
                }), response.fileName
            );
        });
    }

    // get thông tin mặc định LiveForm phân công tiến độ
    getDefaultTenderPreparationPlanning(): Observable<TenderPreparationPlanningRequest> {
        const url = `tenderpreparationplanningassignment/getdefault`;
        return this.apiService.get(url).map(data => data.result);
    }

    // get thông tin LiveForm phân công tiến độ
    getTenderPreparationPlanning(bidOpportunityId: number): Observable<TenderPreparationPlanningRequest> {
        const url = `bidopportunity/${bidOpportunityId}/tenderpreparationplanningassignment`;
        return this.apiService.get(url).map(data => data.result);
    }

    // tạo mới/ sửa LiveForm phân công tiến độ
    createOrUpdateTenderPreparationPlanning(data: TenderPreparationPlanningRequest): Observable<any> {
        const url = `tenderpreparationplanningassignment/createorupdate`;
        return this.apiService.post(url, data).map(response => response.result);
    }

    // xóa LiveForm phân công tiến độ
    deleteTenderPreparationPlanning(bidOpportunityId: number): Observable<any> {
        const url = `bidopportunity/${bidOpportunityId}/tenderpreparationplanningassignment/delete`;
        return this.apiService.post(url).map(data => data.result);
    }

    // gửi phân công tiến độ
    sendTenderPreparationPlanning(bidOpportunityId: number): Observable<any> {
        const url = `bidopportunity/hsdt/${bidOpportunityId}/guiphancontiendo`;
        return this.apiService.post(url).map(data => data.result);
    }
}
