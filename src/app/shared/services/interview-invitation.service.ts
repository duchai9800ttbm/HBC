import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
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
  constructor(
    private instantSearchService: InstantSearchService,
    private apiService: ApiService
  ) { }
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
  // map theo model danh sách lời lời phỏng vấn
  toInterviewInvitationList(result: any): InterviewInvitationList {
    return {
      id: result.id,
      customer: {
        id: result.id,
        customerId: result.customerId,
        customerName: result.customerName,
        customerNo: result.customerNo,
        customerDesc: result.customerDesc,
        customerClassify: result.customerClassify,
        customerNewOldType: result.customerNewOldType,
        customerPhone: result.customerPhone,
        customerAddress: result.customerAddress,
      },
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
    const filterUrl = `/bidopportunity/${bidOpportunityId}/bidinterviewinvitations/filter/${page}/${pageSize}`;
    const urlParams = InterviewInvitationService.createFilterParams(filter);
    urlParams.append('search', searchTerm);
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
  // Tạo mới lời mới phỏng vấn
  createInterviewInvitation(
    customerID: number,
    BidOpportunityId: number,
    createFormNewInvitationValue: any,
    file: File,
  ) {
    const url = `bidinterviewinvitation/create`;
    const formData = new FormData();
    console.log('customerID', customerID);
    if (customerID) {
      formData.append('CustomerId', `${customerID}`);
    }
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('ReceivedDate', `${moment(createFormNewInvitationValue.approvedDate).unix()}`);
    formData.append('InterViewDate', `${moment(createFormNewInvitationValue.interviewDate).unix()}`);
    formData.append('Place', createFormNewInvitationValue.place);
    formData.append('InterviewTimes', createFormNewInvitationValue.interviewTimes);
    formData.append('Content', createFormNewInvitationValue.content);
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
