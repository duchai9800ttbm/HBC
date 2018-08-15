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
@Injectable()
export class PackageService {

  constructor(
    private filterService: FilterPipe,
    private instantSearchService: InstantSearchService,
    private apiService: ApiService,
  ) { }


  private static createFilterParams(filter: PackageFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('projectName', filter.projectName);
    urlFilterParams.append('opportunityClassify', filter.opportunityClassify);
    urlFilterParams.append('stage', filter.stage);
    urlFilterParams.append('chairEmployeeId', filter.chairEmployeeId);
    urlFilterParams.append('minCost', filter.minCost ? filter.minCost.toString() : '');
    urlFilterParams.append('maxCost', filter.maxCost ? filter.maxCost.toString() : '');
    urlFilterParams.append('sorting', filter.sorting);
    return urlFilterParams;
  }

  private static toPackageListItem(result: any): PackageListItem {
    return {
      id: result.id,
      opportunityId: result.opportunityId,
      bidOpportunityId: result.bidOpportunityId,
      classify: result.classify,
      amount: result.amount,
      opportunityName: result.opportunityName,
      projectName: result.projectName,
      projectType: result.projectType,
      hbcRole: result.hbcRole && {
        id: result.hbcRole.key,
        text: result.hbcRole.name
      },
      chairEmployee: result.chairEmployee && {
        id: result.chairEmployee.key,
        text: result.chairEmployee.name
      },
      trimester: result.trimester,
      magnitude: result.magnitude,
      stage: result.stage && {
        id: result.stage.key,
        text: result.stage.value
      },
      stageStatus: result.stageStatus && {
        id: result.stageStatus.key,
        text: result.stageStatus.value
      },
      location: result.location,
      projectNo: result.projectNo,
      job: result.job,
      place: result.place,
      region: result.region,
      customerName: result.customerName,
      contact: result.contact && {
        id: result.contact.id,
        text: result.contact.customerName,
      },
      customerContact: result.customerContact && {
        id: result.customerContact.id,
        text: result.customerContact.name,
      },
      consultantUnit: result.consultantUnit,
      consultantAddress: result.consultantAddress,
      consultantPhone: result.consultantPhone,
      floorArea: result.floorArea,
      mainBuildingCategory: result.mainBuildingCategory,
      documentLink: result.documentLink,
      status: result.status,
      progress: result.progress,
      acceptanceReason: result.acceptanceReason,
      unacceptanceReason: result.unacceptanceReason,
      evaluation: result.evaluation,
      startTrackingDate: result.startTrackingDate,
      submissionDate: result.submissionDate,
      resultEstimatedDate: result.resultEstimatedDate,
      projectEstimatedStartDate: result.projectEstimatedStartDate,
      projectEstimatedEndDate: result.projectEstimatedEndDate,
      totalTime: result.totalTime,
    };
  }


  filter(terms: string, status: string, uploader: string, uploadDate: number, source: any[]): any[] {
    const list = this.convertNestedJson(source);
    const listSource = this.sortAndSearchFileName(terms, status, uploader, uploadDate, list);
    return this.group(listSource);
  }

  filterList(
    searchTerm: string,
    filter: PackageFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<PackageListItem>> {
    const filterUrl = `bidopportunity/filter/${page}/${pageSize}?searchTerm=`;
    const urlParams = PackageService.createFilterParams(filter);
    urlParams.append('search', searchTerm);
    console.log('urlParams', urlParams);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      console.log('filterList-result', result);
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(PackageService.toPackageListItem),
      };
    });
  }

  filterNoGroup(terms: string, status: string, uploader: string, uploadDate: number, source: any[]) {
    const list = this.convertJson(source);
    const listSource = this.sortAndSearchFileName(terms, status, uploader, uploadDate, list);
    const listFormat = this.formatJson(listSource);
    return listFormat;
  }

  convertNestedJson(source: any[]) {
    const arr = source.map(x => {
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
    }).concat();
    return ([]).concat(...arr);
  }


  convertJson(source: any[]) {
    source.forEach(element => {
      element.day = moment.utc(element.uploadDate * 1000).get('date');
      element.month = moment.utc(element.uploadDate * 1000).get('month') + 1;
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

  sortAndSearchFileName(fileName, status, uploader, uploadDate, source: any[]) {
    let day = null, month = null, year = null;
    if (uploadDate) {
      const today = new Date(
        moment(uploadDate).unix()
      );
      day = moment(uploadDate).get('date');
      month = moment(uploadDate).get('month') + 1;
      year = moment(uploadDate).get('year');
    }
    return this.filterService
      .transform(source,
        {
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
    return Object.keys(groupedObj).map(typeOfDocument => ({ typeOfDocument, item: groupedObj[typeOfDocument] }));
  }

  instantSearchWithFilter(
    terms: Observable<string>,
    filter: PackageFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<PackageListItem>> {
    const searchUrl = `bidopportunity/filter/${page}/${pageSize}?searchTerm=`;
    return this.instantSearchService.searchWithFilter(
      searchUrl,
      terms,
      PackageService.createFilterParams(filter),
    )
      .map(result => {
        console.log('result', result);
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalPages,
          total: result.totalCount,
          items: (result.items || []).map(PackageService.toPackageListItem),
        };
      });
  }

  getInforPackageID(id: number | string): Observable<PackageModel> {
    const searchUrl = `bidopportunity/${id}`;
    return this.apiService.get(searchUrl).map(response => {
      const result = response.result;
      return {
        id: result.bidOpportunityId,
        classify: result.classify,
        amount: result.amount,
        opportunityName: result.opportunityName,
        projectName: result.projectName,
        projectType: result.projectType,
        hbcRole: result.hbcRole,
        hbcChair: result.hbcChair && {
          id: result.hbcChair.id,
          text: result.hbcChair.text
        },
        magnitude: result.magnitude,
        stage: result.stage,
        stageStatus: result.stageStatus,
        location: result.location,
        projectNo: result.projectNo,
        job: result.job,
        place: result.place,
        region: result.region,
        customer: result.customer && {
          id: result.customer.customerId,
          text: result.customer.customerName
        },
        customerContact: result.customerContact && {
          id: result.customerContact.id,
          text: result.customerContact.name,
        },
        consultantUnit: result.consultantUnit,
        consultantAddress: result.consultantAddress,
        consultantPhone: result.consultantPhone,
        floorArea: result.floorArea,
        mainBuildingCategory: result.mainBuildingCategory,
        documentLink: result.documentLink,
        status: result.status,
        progress: result.progress,
        acceptanceReason: result.acceptanceReason,
        unacceptanceReason: result.unacceptanceReason,
        evaluation: result.evaluation,
        startTrackingDate: result.startTrackingDate,
        submissionDate: result.submissionDate,
        resultEstimatedDate: result.resultEstimatedDate,
        estimatedProjectStartDate: result.projectEstimatedStartDate,
        estimatedProjectEndDate: result.projectEstimatedEndDate,
        totalTime: result.totalTime,
        description: result.description,
        trimester: '',
        quarter: result.quarter
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
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
          text: i.value,
        };
      });
    });
  }
  ////////////////////
  // Tạo mới gói thầu
  createOpportunity(formValue: any): Observable<any> {
    const url = `bidopportunity/create`;
    const inforPackage = {
      projectName: formValue.projectName,
      projectNo: formValue.projectNo,
      opportunityName: formValue.opportunityName,
      job: formValue.job,
      place: formValue.place,
      location: formValue.location,
      quarter: formValue.trimester,
      customerId: formValue.customer ? formValue.customer.id : null,
      classify: formValue.classify,
      customerContactId: formValue.customerContact ? formValue.customerContact.id : null,
      consultantUnit: formValue.consultantUnit,
      consultantAddress: formValue.consultantAddress,
      consultantPhone: formValue.consultantPhone,
      floorArea: formValue.floorArea,
      magnitude: formValue.magnitude,
      projectType: formValue.projectType,
      mainBuildingCategory: formValue.mainBuildingCategory,
      hbcRole: formValue.hbcRole,
      documentLink: formValue.documentLink,
      hbcChair: formValue.hbcChair,
      status: formValue.status,
      amount: formValue.amount,
      evaluation: formValue.evaluation,
      startTrackingDate: moment(formValue.startTrackingDate).unix(),
      submissionDate: moment(formValue.submissionDate).unix(),
      resultEstimatedDate: moment(formValue.resultEstimatedDate).unix(),
      projectEstimatedStartDate: moment(formValue.estimatedProjectStartDate).unix(),
      projectEstimatedEndDate: moment(formValue.estimatedProjectEndDate).unix(),
      totalTime: formValue.totalTime,
      description: formValue.description,
    };
    console.log('inforPackage', inforPackage);
    return this.apiService.post(url, inforPackage)
      .map(response => {
        return response;
      })
      .share();
  }
  // Edit goi thau
  EditOpportunity(formValue: any): Observable<any> {
    const url = `bidopportunity/edit`;
    const inforPackage = {
      id: formValue.id,
      projectName: formValue.nameProject,
      projectNo: formValue.codePackage,
      opportunityName: formValue.name,
      job: formValue.task,
      place: formValue.address,
      location: formValue.zone,
      quarter: formValue.quarterOfYear,
      customerId: formValue.customer ? formValue.customer.id : null,
      classify: formValue.customerType,
      customerContactId: formValue.contact ? formValue.contact.id : null,
      consultantUnit: formValue.consultantUnit,
      consultantAddress: formValue.addressConsultingUnit,
      consultantPhone: formValue.phoneConsultingUnit,
      floorArea: formValue.acreageFloor,
      magnitude: formValue.scale,
      projectType: formValue.buildingProjectType,
      mainBuildingCategory: formValue.mainBuildingCategory,
      hbcRole: formValue.roleHBC,
      documentLink: formValue.linkDocument,
      hbcChair: formValue.presideHBC,
      status: formValue.status,
      amount: formValue.totalValue,
      evaluation: formValue.ratingProject,
      startTrackingDate: moment(formValue.trackingeStartDate).unix(),
      submissionDate: moment(formValue.submitPackageDate).unix(),
      resultEstimatedDate: moment(formValue.resultEstimatedDate).unix(),
      projectEstimatedStartDate: moment(formValue.startDateProject).unix(),
      projectEstimatedEndDate: moment(formValue.endDateProject).unix(),
      totalTime: formValue.totalTime,
      description: formValue.description,
    };
    console.log('inforPackage', inforPackage);
    return this.apiService.post(url, inforPackage)
      .map(response => {
        return response;
      })
      .share();
  }
  // Xóa gói thầu
  deleteOpportunity(id: any): Observable<any> {
    const url = `bidopportunity/delete`;
    return this.apiService.post(url, id)
      .map(response => {
        return response;
      })
      .share();
  }
  // Liên hệ khách hàng - Màn hình tạo mới gói thầu
  getListCustomercontact(searchTerm: string): Observable<any> {
    const url = `customercontact/0/10/?searchTerm=${searchTerm}`;
    return this.apiService.get(url)
      .map(response => {
        return response.result.items.map(x => {
          return {
            id: x.id,
            text: x.name,
          };
        });
      })
      .share();
  }

  //
  getListCustomer(searchTerm: string): Observable<any> {
    const url = `customer/search/0/10/?searchTerm=${searchTerm}`;
    return this.apiService.get(url)
      .map(response => {
        return response.result.items.map(x => {
          return {
            id: x.customerId,
            text: x.customerName,
          };
        });
      })
      .share();
  }

  // Lấy cấu hình màn hình hiển thị danh sách gói thầu
  getListFields(userId: number): Observable<FieldModel[]> {
    const url = `bidopportunity/user/${userId}/fields`;
    return this.apiService.get(url)
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
      entityFields: listField,
    };
    return this.apiService.post(url, model)
      .map(response => response.result);
  }

  // default config
  getListFieldsDefault(): Observable<FieldModel[]> {
    const url = `bidopportunity/defaultfields`;
    return this.apiService.get(url)
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
      customerContactId: customer.customerContactId && customer.customerContactId.id,
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


}
