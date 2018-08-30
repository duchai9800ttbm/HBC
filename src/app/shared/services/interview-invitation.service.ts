import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { PagedResult } from '../models';
import { InterviewInvitationList } from '../models/interview-invitation/interview-invitation-list.model';
import { InstantSearchService } from './instant-search.service';
import { ApiService } from './api.service';
import * as moment from 'moment';
import { InterviewInvitationFilter } from '../models/interview-invitation/interview-invitation-filter.model';
import { URLSearchParams } from '@angular/http';
@Injectable()
export class InterviewInvitationService {

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
    formData.append('CustomerId', `${customerID}`);
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
}
