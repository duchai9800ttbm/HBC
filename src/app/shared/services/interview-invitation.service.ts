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
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import * as FileSaver from 'file-saver';
import { ApprovedDossiersList } from '../models/interview-invitation/approved-dossiers-list.model';
@Injectable()
export class InterviewInvitationService {
    // Create
  static interviewInvitationList = new Subject<any>();
  static keySearchInterviewInvitation = new BehaviorSubject<string>('');
  static keySearchNew = new Subject<string>();
  static refeshCreateInterviewInvitation = new BehaviorSubject<boolean>(false);
  // Prepare
  static refeshPrepareInterviewInvitation = new BehaviorSubject<boolean>(false);
  // End
  static refeshEndInterviewInvitation = new BehaviorSubject<boolean>(false);
  static endInterviewList = new Subject<any>();
  //
  currentStatusInterview: Subject<number> = new Subject<number>();
  interviewNotification;
  maxInterViewTimes;
  // No điều hướng
  nodirection;
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
      desc: result.desc,
      fileUrl: result.fileUrl,
      // fileGuid: result.fileGuid,
      // receivedDate: result.receivedDate,
      // url: result.url,
      // description: result.description,
    };
  }
  // Tạo mới filter params - Create Interview
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
      // filter.receivedDate ? filter.receivedDate.toString() : ''
      filter.receivedDate ? DateTimeConvertHelper.fromDtObjectToTimestamp(filter.receivedDate).toString() : ''
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
      filter.createdDate ?
        DateTimeConvertHelper.fromDtObjectToTimestamp(filter.createdDate).toString() : ''
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
    InterviewInvitationService.keySearchInterviewInvitation.next(keyup);
  }
  // Observable key search interview invitation
  watchKeySearchInterviewInvitation() {
    return InterviewInvitationService.keySearchInterviewInvitation;
  }

  changeKeySearchNew(keyup: string) {
    InterviewInvitationService.keySearchNew.next(keyup);
  }

  watchKeySearchNew() {
    return InterviewInvitationService.keySearchNew.asObservable();
  }

  // change interview invitation list
  changeInterviewInvitationList() {
    InterviewInvitationService.interviewInvitationList.next();
  }
  // Observable interview invitation list
  watchInterviewInvitationList(): Observable<boolean> {
    return InterviewInvitationService.interviewInvitationList;
  }
  // refesh interview invitation list
  chagneRefeshInterviewInvitationList(displayAlert) {
    InterviewInvitationService.refeshCreateInterviewInvitation.next(displayAlert);
  }
  // Observable refesh interview invitation list
  watchRefeshInterviewInvitationList(): Observable<boolean> {
    return InterviewInvitationService.refeshCreateInterviewInvitation;
  }
  // Choose interview to notification
  chooseInterviewNotification(items) {
    this.interviewNotification = items;
  }
  // Return interview to notification
  getChooseInterviewNotification() {
    return this.interviewNotification;
  }
  // Change url chirld
  changeUrlChirld(urlChirld) {
    this.currentStatusInterview.next(urlChirld);
  }
  // Return currentStatusInterview
  getUrlChirld() {
    return this.currentStatusInterview;
  }
  // =============================
  // Prepare Interview Invitation
  // refesh interview invitation list
  chagneRefeshPrepareInterview(displayAlert) {
    InterviewInvitationService.refeshPrepareInterviewInvitation.next(displayAlert);
  }
  // Observable refesh interview invitation list
  watchRefeshPrepareInterview(): Observable<boolean> {
    return InterviewInvitationService.refeshPrepareInterviewInvitation;
  }
  // =============================
  // End Interview Invitation List
  chagneRefeshEndInterview(displayAlert) {
    InterviewInvitationService.refeshEndInterviewInvitation.next(displayAlert);
  }
  // Observable refesh interview invitation list
  watchRefeshEndInterview(): Observable<boolean> {
    return InterviewInvitationService.refeshEndInterviewInvitation;
  }
  changeEndInterviewList() {
    InterviewInvitationService.endInterviewList.next();
  }
  // Observable interview invitation list
  watchEndInterviewList(): Observable<boolean> {
    return InterviewInvitationService.endInterviewList;
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
    const url = `bidinterviewinvitation/create`;
    const formData = new FormData();
    if (customerID) {
      formData.append('CustomerId', `${customerID}`);
    }
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('ReceivedDate', `${DateTimeConvertHelper.fromDtObjectToTimestamp(createFormNewInvitationValue.approvedDate)}`);
    formData.append('InterViewDate', `${DateTimeConvertHelper.fromDtObjectToTimestamp(createFormNewInvitationValue.interviewDate)}`);
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
  // Chỉnh sửa lời mời phỏng vấn
  updateInterviewInvitation(
    customerID: number,
    BidInterviewInvitationId: number,
    createFormNewInvitationValue: any,
    file: File,
  ) {
    const url = `bidinterviewinvitation/update`;
    const formData = new FormData();
    if (customerID) {
      formData.append('CustomerId', `${customerID}`);
    }
    formData.append('BidInterviewInvitationId', `${BidInterviewInvitationId}`);
    formData.append('ReceivedDate', `${DateTimeConvertHelper.fromDtObjectToTimestamp(createFormNewInvitationValue.approvedDate)}`);
    formData.append('InterViewDate', `${DateTimeConvertHelper.fromDtObjectToTimestamp(createFormNewInvitationValue.interviewDate)}`);
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
  // Lưu lại lần phỏng vấn lớn nhât
  saveMaxInterViewTimes(maxInterViewTimes: number) {
    this.maxInterViewTimes = maxInterViewTimes;
  }
  // Trả lại biến mạc địnhhh lần phỏng vấn
  returnMaxInterViewTimes() {
    return this.maxInterViewTimes;
  }
  // Tải file lời mời phỏng vấn
  downloadFileCreateInterview(bidDocumentId: number) {
    const url = `bidinterviewinvitation/${bidDocumentId}/download `;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Load file lời mời phỏng vấn để đính kèm vào thông báo
  LoadFileCreateInterview(bidDocumentId: number) {
    const url = `bidinterviewinvitation/${bidDocumentId}/download `;
    return this.apiService.getFile(url).map(response => {
      // return new Blob([response.file], { type: `${response.file.type}` });
      return new File([response.file], response.fileName, { type: response.contentType, lastModified: Date.now() });
    });
  }
  // ===============================
  // Chuẩn bị phỏng vấn
  // Map danh sách hồ sợ dự thầu đã phê duyệt theo model
  toApprovedDossiersList(result: any): ApprovedDossiersList {
    return {
      typeName: result.typeName,
      isLiveForm: result.isLiveForm,
      document: (result.document && result.document.length !== 0 && result.document[0] !== null) ? result.document.map(itemDocument => {
        return {
          type: itemDocument.type,
          id: itemDocument.id,
          name: itemDocument.name,
          interviewTime: itemDocument.interviewTime,
          isLiveForm: itemDocument.isLiveForm,
          filerUrl: itemDocument.filerUrl,
        };
      }) : null,
      childs:
        result.childs ? result.childs.map(itemChirld => {
          return {
            typeName: itemChirld.typeName,
            document: itemChirld.document ? {
              type: itemChirld.document.type,
              id: itemChirld.document.id,
              name: itemChirld.document.name,
              interviewTime: itemChirld.document.interviewTime,
              isLiveForm: itemChirld.document.isLiveForm,
              filerUrl: itemChirld.document.filerUrl,
            } : null,
          };
        }) : null,
      // result.childs{
      //   typeName: result.childs.typeName,
      //   document: result.childs.document ? {
      //     type: result.childs.document.type,
      //     id: result.childs.document.id,
      //     name: result.childs.document.name,
      //     interviewTime: result.childs.document.interviewTime,
      //   } : null,
    };
  }
  // Danh sách hồ sơ dự thầu đã phê duyệt search
  getListApprovedDossiers(bidDocumentId, searchTerm): Observable<ApprovedDossiersList[]> {
    const url = `bidopportunity/${bidDocumentId}/approvaltenderdocs?searchTerm=${searchTerm}`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toApprovedDossiersList
      );
    });
  }
  // Download template chuẩn bị phỏng vấn
  downloadTemplatePrepare() {
    const url = `prepareinterview/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Dowload hô sơ dự thầu đã phê duyệt - đối với các file
  downloadTenderdocument(tenderDocumentId: number) {
    const url = `tenderdocument/${tenderDocumentId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Chốt công tác chuẩn bị phỏng vấn
  approvedinterviewpreparation(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/approvedinterviewpreparation`;
    return this.apiService.post(url);
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
    if (createFormReportValue.documentDesc) {
      formData.append('DocumentDesc', `${createFormReportValue.documentDesc}`);
    }
    formData.append('InterviewTimes', `${createFormReportValue.interviewTimes}`);
    if (file) {
      formData.append('DocumentFile', file);
    } else {
      formData.append('FileUrl', `${createFormReportValue.link}`);
    }
    formData.append('Version', `${createFormReportValue.version}`);
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
    const searchUrl = `bidopportunity/${bidOpportunityId}/bidinterviewreportdocs/filter/${page}/${pageSize}?searchTerm=`;
    return this.instantSearchService
      .searchWithFilter(
        searchUrl,
        searchTerm,
        InterviewInvitationService.createFilterParamsReport(filter)
      )
      .map(result => {
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.totalCount,
          total: result.totalPages,
          items: (result.items || []).map(InterviewInvitationService.toInterviewInvitationReportList)
        };
      });
  }
  // Danh sachs biên bản phỏng vấn lọc & search
  filterListReport(
    bidOpportunityId: number,
    searchTerm: string,
    filter: InterviewInvitationFilterReport,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<InterviewInvitationList>> {
    const filterUrl = `bidopportunity/${bidOpportunityId}/bidinterviewreportdocs/filter/${page}/${pageSize}`;
    const urlParams = InterviewInvitationService.createFilterParamsReport(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          InterviewInvitationService.toInterviewInvitationReportList
        )
      };
    });
  }
  // Tải về biên bản phỏng vấn
  downloadReport(bidInterviewReportDocId: number) {
    const url = `bidinterviewreportdoc/${bidInterviewReportDocId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Chuyển trạng thái đã chốt công tác phỏng vấn => đã phỏng vấn
  submitPrepareInterviews(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/daphongvan`;
    return this.apiService.post(url).map(response => {
      return response;
    });
  }
  // Tải template đã phỏng vấn
  downloadTemplateEnd() {
    const url = `interviewed/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Hiệu chỉnh HSDT
  correctionHSDT(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/canhieuchinhhsdt`;
    return this.apiService.post(url);
  }
  // Đóng phỏng vấn
  closeInterview(bidOpportunityId: number) {
    const url = `bidopportunity/hsdt/${bidOpportunityId}/dongphongvan`;
    return this.apiService.post(url);
  }
}
