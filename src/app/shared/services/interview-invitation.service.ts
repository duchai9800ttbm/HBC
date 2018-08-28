import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { PagedResult } from '../models';
import { InterviewInvitationList } from '../models/interview-invitation/interview-invitation-list.model';
import { InstantSearchService } from './instant-search.service';
import { ApiService } from './api.service';
import * as moment from 'moment';
@Injectable()
export class InterviewInvitationService {

  constructor(
    private instantSearchService: InstantSearchService,
    private apiService: ApiService
  ) { }
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
        key: result.key,
        value: result.value,
        displayText: result.displayText,
      },
      remainningDay: result.remainningDay,
    };
  }
  // Danh sách lời mời phỏng vấn (search theo tên, sort, filter theo trạng thái, khách hàng, ngày nhận, lần phỏng vấn)
  instantSearch(
    terms: Observable<string>,
    bidOpportunityId: number,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<InterviewInvitationList>> {
    const searchUrl = `/bidopportunity/${bidOpportunityId}/bidinterviewinvitations/filter/${page}/${pageSize}`;
    return this.instantSearchService
      .search(searchUrl, terms)
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
  // Tạo mới lời mới phỏng vấn
  createInterviewInvitation(
    customerID: number,
    BidOpportunityId:  number,
    createFormNewInvitationValue: any,
    file: File,
  ) {
    const url = `bidinterviewinvitation/create`;
    const formData = new FormData();
    formData.append('CustomerId', `${customerID}`);
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('ReceivedDate', `${moment(createFormNewInvitationValue.approvedDate).unix()}` );
    formData.append('InterViewDate', `${moment(createFormNewInvitationValue.interviewDate).unix()}` );
    formData.append('Place', createFormNewInvitationValue.place);
    formData.append('InterviewTimes', createFormNewInvitationValue.interviewTimes);
    formData.append('Content', createFormNewInvitationValue.content);
    formData.append('DocumentFile', file);
    return this.apiService.postFile(url, formData)
        .map(response => response)
        .share();
  }
}
