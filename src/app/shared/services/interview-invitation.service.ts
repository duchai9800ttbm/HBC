import { Injectable } from '@angular/core';
import { Observable, Subject, BehaviorSubject } from '../../../../node_modules/rxjs';
import { PagedResult } from '../models';
import { InterviewInvitationList } from '../models/interview-invitation/interview-invitation-list.model';
import { InstantSearchService } from './instant-search.service';
import { ApiService } from './api.service';
import * as moment from 'moment';
import { InterviewInvitationFilter } from '../models/interview-invitation/interview-invitation-filter.model';
import { URLSearchParams } from '@angular/http';
import { InterviewInvitationFilterReport } from '../models/interview-invitation/interview-invitation-filter-report';
import { InterviewInvitationReportList } from '../models/interview-invitation/interview-invitation-report-list.model';
@Injectable()
export class InterviewInvitationService {
  interviewInvitationList = new Subject<any>();
  keySearchInterviewInvitation = new BehaviorSubject<string>('');
  private keySearchNew = new Subject<string>();
  refeshCreateInterviewInvitation = new BehaviorSubject<boolean>(false);
  // map theo model danh sách biên bản phỏng vấn
  private static toInterviewInvitationReportList(result: any): InterviewInvitationReportList {
    return {
      id: result.id,
      // documentType: {
      //   key: result.documentType.key,
      //   value: result.documentType.value,
      //   displayText: result.documentType.displayText,
      // },
      documentName: result.documentName,
      version: result.version,
      // status: result.status,
      uploadedBy: {
        employeeId: result.uploadedBy.employeeId,
        employeeNo: result.uploadedBy.employeeNo,
        employeeName: result.uploadedBy.employeeName,
        employeeAvatar: result.uploadedBy.employeeAvatar,
        employeeEmail: result.uploadedBy.employeeEmail,
      },
      createdDate: result.createdDate,
      interviewTimes: result.interviewTimes,
      desc: result.desc
      // fileGuid: result.fileGuid,
      // receivedDate: result.receivedDate,
      // url: result.url,
      // description: result.description,
    };
  }
  // Tạo mới filter params
  private static createFilterParams(filter: InterviewInvitationFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'customerid',
      filter.customerid ? filter.customerid.toString() : ''
    );
    urlFilterParams.append(
      'interviewTimes',
      filter.interviewTimes ? filter.interviewTimes.toString() : ''
    );
    urlFilterParams.append(
      'receivedDate',
      filter.receivedDate ? filter.receivedDate.toString() : ''
    );
    urlFilterParams.append('status', filter.status);
    urlFilterParams.append('sorting', filter.sorting);
    return urlFilterParams;
  }
  // Tạo mới filter params for Report interview
  private static createFilterParamsReport(filter: InterviewInvitationFilterReport): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'interviewtimes',
      filter.interviewtimes ? filter.interviewtimes.toString() : ''
    );
    urlFilterParams.append(
      'uploadedEmployeeId',
      filter.uploadedEmployeeId ? filter.uploadedEmployeeId.toString() : ''
    );
    urlFilterParams.append(
      'createdDate',
      filter.createdDate ? filter.createdDate.toString() : ''
    );
    urlFilterParams.append(
      'sorting',
      filter.sorting ? filter.sorting.toString() : ''
    );
    return urlFilterParams;
  }
  constructor(
    private instantSearchService: InstantSearchService,
    private apiService: ApiService
  ) { }
  // =============================
  // Create Interview Invitation
  // change key search interview invitation
  changeKeySearchInterviewInvitation(keyup) {
    this.keySearchInterviewInvitation.next(keyup);
  }
  // Observable key search interview invitation
  watchKeySearchInterviewInvitation() {
    return this.keySearchInterviewInvitation;
  }

  changeKeySearchNew(keyup: string) {
    this.keySearchNew.next(keyup);
  }

  watchKeySearchNew() {
    return this.keySearchNew.asObservable();
  }

  // change interview invitation list
  changeInterviewInvitationList() {
    this.interviewInvitationList.next();
  }
  // Observable interview invitation list
  watchInterviewInvitationList(): Observable<boolean> {
    return this.interviewInvitationList;
  }
  // refesh interview invitation list
  chagneRefeshInterviewInvitationList(displayAlert) {
    this.refeshCreateInterviewInvitation.next(displayAlert);
  }
  // Observable refesh interview invitation list
  watchRefeshInterviewInvitationList(): Observable<boolean> {
    return this.refeshCreateInterviewInvitation;
  }
  // map theo model danh sách lời lời phỏng vấn
  toInterviewInvitationList(result: any): InterviewInvitationList {
    return {
      id: result.id,
      customer: result.customer ? {
        id: result.customer.id,
        customerId: result.customer.customerId,
        customerName: result.customer.customerName,
        customerNo: result.customer.customerNo,
        customerDesc: result.customer.customerDesc,
        customerClassify: result.customer.customerClassify,
        customerNewOldType: result.customer.customerNewOldType,
        customerPhone: result.customer.customerPhone,
        customerAddress: result.customer.customerAddress,
      } : null,
      approvedDate: result.approvedDate,
      interviewDate: result.interviewDate,
      place: result.place,
      content: result.content,
      interviewTimes: result.interviewTimes,
      status: {
        key: result.status.key,
        value: result.status.value,
        displayText: result.status.displayText,
      },
      remainningDay: result.remainningDay,
    };
  }
  // Danh sách lời mời phỏng vấn (search theo tên, sort, filter theo trạng thái, khách hàng, ngày nhận, lần phỏng vấn)
  instantSearchWithFilter(
    bidOpportunityId: number,
    searchTerm: Observable<string>,
    filter: InterviewInvitationFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<InterviewInvitationList>> {
    const searchUrl = `/bidopportunity/${bidOpportunityId}/bidinterviewinvitations/filter/${page}/${pageSize}/?searchTerm=`;
    return this.instantSearchService
      .searchWithFilter(
        searchUrl,
        searchTerm,
        InterviewInvitationService.createFilterParams(filter)
      )
      .map(result => {
        console.log('danh sách lời moiwfi phỏng vấn', result);
        return {
          currentPage: result.page,
          pageSize: pageSize,
          pageCount: result.pageCount,
          total: result.recordCount,
          items: (result.items || []).map(this.toInterviewInvitationList)
        };
      });
  }
  // Lọc Danh sách lời mời phỏng vấn
  filterList(
    bidOpportunityId: number,
    searchTerm: string,
    filter: InterviewInvitationFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<InterviewInvitationList>> {
    console.log('searchTerm-searchTerm', searchTerm);
    const filterUrl = `bidopportunity/${bidOpportunityId}/bidinterviewinvitations/filter/${page}/${pageSize}`;
    const urlParams = InterviewInvitationService.createFilterParams(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          this.toInterviewInvitationList
        )
      };
    });
  }
  // Lấy danh sách lời mời phỏng vấn
  getListInterview(
    bidOpportunityId: number,
    page: number | string,
    pageSize: number | string
  ) {
    const url = `/bidopportunity/${bidOpportunityId}/bidinterviewinvitations/filter/${page}/${pageSize}`;
    return this.apiService.get(url).map(response => {
      const result = response.result.items;
      return (result || []).map(
        this.toInterviewInvitationList
      );
    });
  }
  // Tạo mới lời mới phỏng vấn
  createInterviewInvitation(
    customerID: number,
    BidOpportunityId: number,
    createFormNewInvitationValue: any,
    file: File,
  ) {
    console.log('createFormNewInvitationValue', createFormNewInvitationValue);
    const url = `bidinterviewinvitation/create`;
    const formData = new FormData();
    if (customerID) {
      formData.append('CustomerId', `${customerID}`);
    }
    // formData.append('CustomerId', createFormNewInvitationValue.customerName);
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('ReceivedDate', `${moment(createFormNewInvitationValue.approvedDate).unix()}`);
    formData.append('InterViewDate', `${moment(createFormNewInvitationValue.interviewDate).unix()}`);
    formData.append('Place', createFormNewInvitationValue.place);
    formData.append('InterviewTimes', createFormNewInvitationValue.interviewTimes);
    if (createFormNewInvitationValue.content) {
      formData.append('Content', createFormNewInvitationValue.content);
    }
    formData.append('DocumentFile', file);
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }

  // Tải lên biên bản phỏng vấn
  UploadReportInterview(
    BidOpportunityId: number,
    createFormReportValue: any,
    file: File,
  ) {
    const url = `bidinterviewreportdoc/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('DocumentName', `${createFormReportValue.documentName}`);
    formData.append('DocumentDesc', `${createFormReportValue.documentDesc}`);
    formData.append('InterviewTimes', `${createFormReportValue.interviewTimes}`);
    formData.append('DocumentFile', file);
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }

  // Danh sách biên bản phỏng vấn (search theo tên, sort, filter theo trạng thái, khách hàng, ngày nhận, lần phỏng vấn)
  instantSearchWithFilterReport(
    bidOpportunityId: number,
    searchTerm: Observable<string>,
    filter: InterviewInvitationFilterReport,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<InterviewInvitationReportList>> {
    const searchUrl = `/bidopportunity/${bidOpportunityId}/bidinterviewreportdocs/filter/${page}/${pageSize}/?searchTerm=`;
    console.log('searchUrl', searchUrl);
    return this.instantSearchService
      .searchWithFilter(
        searchUrl,
        searchTerm,
        InterviewInvitationService.createFilterParamsReport(filter)
      )
      .map(result => {
        console.log('ressult-biên bản', result);
        // return result;
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalCount,
          total: result.totalPages,
          items: (result.items || []).map(InterviewInvitationService.toInterviewInvitationReportList)
        };
      });
  }

  // Chuyển trạng thái đã chốt công tác phỏng vấn => đã phỏng vấn
  submitPrepareInterviews(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/daphongvan`;
    return this.apiService.post(url).map(response => {
      return response;
    });
  }
}
