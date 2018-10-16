import { Injectable } from '@angular/core';
import { ApiService } from '.';
import DateTimeConvertHelper from '../helpers/datetime-convert-helper';
import { DocumentResultList } from '../models/result-attend/document-result-list.model';
import { Observable, Subject } from '../../../../node_modules/rxjs';
import * as FileSaver from 'file-saver';
import { SendEmailModel } from '../models/send-email-model';
import { FilterContractSigning } from '../models/result-attend/filter-contract-signing.model';
import { ContractSigningList } from '../models/result-attend/contract-signing.list.model';
import { PagedResult } from '../models';
import { URLSearchParams } from '@angular/http';
import { FilterNeedTransferDoc } from '../models/result-attend/filter-need-transfer-doc.model';
import { NeedTranferDocList } from '../models/result-attend/need-transfer-doc-list.model';
import { NeedTransferDoc } from '../models/result-attend/need-transfer-doc.model';
import { ReportMeetingList } from '../models/result-attend/report-meeting-list.model';
import { FilterReportMeeting } from '../models/result-attend/filter-report-meeting.model';
import { ManageNeedTranferList } from '../models/result-attend/manage-need-transfer-list.model';
@Injectable()
export class DetailResultPackageService {
  listFileResult: Subject<any> = new Subject();
  listContractSigning: Subject<any> = new Subject();
  constructor(
    private apiService: ApiService,
  ) { }
  // ==========================
  // Bước 1 - Kết quả dự thầu
  // Có sự thay đổi listFileResult
  changeListFileResult() {
    this.listFileResult.next();
  }
  // Obserable listFileResult
  watchListFileResult() {
    return this.listFileResult;
  }
  // Mapping model danh sách tài liệu kết quả dự thầu
  toListFileResult(result: any): DocumentResultList {
    return {
      id: result.id,
      name: result.name,
      version: result.version,
      desc: result.desc,
      uploadBy: {
        employeeId: result.uploadBy.employeeId,
        employeeNo: result.uploadBy.employeeNo,
        employeeName: result.uploadBy.employeeName,
        employeeAvatar: {
          guid: result.uploadBy.employeeAvatar.guid,
          thumbSizeUrl: result.uploadBy.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.uploadBy.employeeAvatar.largeSizeUrl,
        },
        employeeEmail: result.uploadBy.employeeEmail,
      },
      uploadDate: result.uploadDate,
      interviewTimes: result.interviewTimes,
      fileGuid: result.fileGuid,
    };
  }
  // Danh sách tài liệu kết quả dự thầu
  getListFileResult(BidOpportunityId: number): Observable<DocumentResultList[]> {
    const url = `tenderresultdocument/${BidOpportunityId}/gettenderresultdocuments`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toListFileResult
      );
    });
  }
  // Tải lên tài liệu kết quả dự thầu
  uploadFileResult(
    BidOpportunityId: number,
    uploadResultFormValue: any,
    file: File,
  ) {
    const url = `tenderresultdocument/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('Name', `${uploadResultFormValue.documentName}`);
    formData.append('InterviewTimes', `${uploadResultFormValue.interviewTimes}`);
    formData.append('ReceivedDate', uploadResultFormValue.receivedDate ?
      DateTimeConvertHelper.fromDtObjectToTimestamp(uploadResultFormValue.receivedDate).toString() : '');
    if (uploadResultFormValue.documentDesc || uploadResultFormValue.documentDesc === '') {
      formData.append('Desc', uploadResultFormValue.documentDesc);
    }
    if (file) {
      formData.append('File', file);
    } else {
      formData.append('Url', uploadResultFormValue.link);
    }
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }
  // Tải template tài liệu kết quả dự thầu
  downloadTemplateResult() {
    const url = `tenderresultdocument/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Xóa 1 tài liệu kết quả dự thầu
  deleteFileResult(idFile: number) {
    const url = `tenderresultdocument/delete`;
    const request = {
      id: idFile,
    };
    return this.apiService.post(url, request);
  }
  // Xóa nhiều tài liệu kết quả dự thầu
  deleteMutipleFileResult(arayIdFile: number[]) {
    const url = `tenderresultdocument/deletemultiple`;
    const request = {
      ids: arayIdFile,
    };
    return this.apiService.post(url, request);
  }
  // Tải về tài liệu kết quả dự thầu
  downloadFileResult(tenderResultDocumentId: number) {
    const url = `tenderresultdocument/${tenderResultDocumentId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Gửi thư phản hồi đến phòng hợp đồng
  sendFeedbackToContractRoom(data: SendEmailModel, file: File[]) {
    const url = `bidopportunity/kqdt/sendfeedbacktocontractroom`;
    const dataObj = new FormData();
    dataObj.append('BidOpportunityId', data.bidOpportunityId + '');
    dataObj.append('Subject', data.subject ? data.subject : '');
    data.recipientEmails.forEach((item, index) => {
      dataObj.append('RecipientEmails[' + index + ']', item);
    });
    file.forEach(item => {
      dataObj.append('AttachmentFiles', item);
    });
    dataObj.append('Content', data.content);
    return this.apiService.postFile(url, dataObj);
  }
  // Gửi thư thông báo cho các bên liên quan
  sendFeedbackToStakeholders(data: SendEmailModel, file: File[]) {
    const url = `bidopportunity/kqdt/sendfeedbacktocontractroom`;
    const dataObj = new FormData();
    dataObj.append('BidOpportunityId', data.bidOpportunityId + '');
    dataObj.append('Subject', data.subject ? data.subject : '');
    data.recipientEmails.forEach((item, index) => {
      dataObj.append('RecipientEmails[' + index + ']', item);
    });
    file.forEach(item => {
      dataObj.append('AttachmentFiles', item);
    });
    dataObj.append('Content', data.content);
    return this.apiService.postFile(url, dataObj);
  }
  // Chuyển giao tài liệu
  // Tạo filter paramater danh sách tài liệu cần chuyển giao
  toParamaterNeedTransfer(filter: FilterNeedTransferDoc): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'documentType',
      filter.documentType ? filter.documentType : ''
    );
    urlFilterParams.append(
      'DocumentTypeId',
      filter.documentTypeId ? filter.documentTypeId.toString() : ''
    );
    urlFilterParams.append(
      'interviewTimes',
      filter.interviewTimes ? filter.interviewTimes.toString() : ''
    );
    return urlFilterParams;
  }
  // Mapping to model danh sách tài liệu cần chuyển giao
  toListNeedTransferDocs(result: any): NeedTranferDocList {
    return {
      bidOpportunityStage: {
        key: result.bidOpportunityStage.key,
        value: result.bidOpportunityStage.value,
        displayText: result.bidOpportunityStage.displayText,
      },
      needTransferDocument: result.needTransferDocument ? result.needTransferDocument.map(itemNeedTransferDocument => {
        return {
          documentType: itemNeedTransferDocument.documentType ? {
            key: itemNeedTransferDocument.documentType.key,
            value: itemNeedTransferDocument.documentType.value,
            displayText: itemNeedTransferDocument.documentType.displayText,
          } : null,
          document: itemNeedTransferDocument.document ? {
            type: itemNeedTransferDocument.document.type,
            id: itemNeedTransferDocument.document.id,
            name: itemNeedTransferDocument.document.name,
            interviewTime: itemNeedTransferDocument.document.interviewTime,
            isLiveForm: itemNeedTransferDocument.document.isLiveForm,
          } : null,
          childDocuments: itemNeedTransferDocument.childDocuments ? itemNeedTransferDocument.childDocuments.map(itemChildDocuments => {
            return {
              documentType: itemChildDocuments.documentType ? {
                key: itemChildDocuments.documentType.key,
                value: itemChildDocuments.documentType.value,
                displayText: itemChildDocuments.documentType.displayText,
              } : null,
              document: itemChildDocuments.document ? {
                type: itemChildDocuments.document.type,
                id: itemChildDocuments.document.id,
                name: itemChildDocuments.document.name,
                interviewTime: itemChildDocuments.document.interviewTime,
                isLiveForm: itemChildDocuments.document.isLiveForm,
              } : null
            };
          }) : null,
        };
      }) : null,
    };
  }
  // Danh sách tài liệu cần chuyển giao CHƯA CÓ chuyển giao cho và ngày sử dụng
  getListNeedTransferDocs(
    bidOpportunityId: number,
  ): Observable<NeedTranferDocList[]> {
    const filterUrl = `tenderresultdocument/bidOpportunity/${bidOpportunityId}/needtransferdocs`;
    return this.apiService.get(filterUrl).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toListNeedTransferDocs
      );
    });
  }
  // // Danh sách tài liệu cần chuyển giao(tìm kiếm, lọc)
  // getListNeedTransferDocs(
  //   bidOpportunityId: number,
  //   searchTerm: string,
  //   filter: FilterNeedTransferDoc,
  //   page: number | string,
  //   pageSize: number | string
  // ): Observable<NeedTranferDocList[]> {
  //   const filterUrl = `tenderresultdocument/bidOpportunity/${bidOpportunityId}/needtransferdocs`;
  //   const urlParams = this.toParamaterNeedTransfer(filter);
  //   urlParams.append('searchTerm', searchTerm);
  //   return this.apiService.get(filterUrl, urlParams).map(response => {
  //     const result = response.result;
  //     return (result || []).map(
  //       this.toListNeedTransferDocs
  //     );
  //   });
  // }
  // Danh sách loại tài liệu cần chuyển giao
  getListTypeNeedTransferDoc() {
    const url = `tenderresultdocument/transferdocumenttypes`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return {
        id: result.id,
        type: result.type,
        desc: result.desc,
      };
    });
  }
  // Tải về template tài liệu cần chuyển giao
  downloadTemplateDoc() {
    const url = `tenderresultdocument/transferdoc/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Tải về tài liệu cần chuyển giao
  downloadDocNeedTransfer(documentId: number, type: string) {
    const url = `tenderresultdocument/transferdoc/${documentId}/download?type=${type}`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Chuyển giao tài liệu
  NeedTransferDoc(needTransferdoc: NeedTransferDoc) {
    const url = `bidopportunity/kqdt/chuyengiaotailieu`;
    return this.apiService.post(url, needTransferdoc);
  }
  // to Map theo model của quản lý người nhận tài liệu
  toManageTransferDocs(result: any): ManageNeedTranferList {
    return {
      id: result.id,
      document: result.document ? {
        type: result.document.type,
        id: result.document.id,
        name: result.document.name,
        interviewTime: result.document.interviewTime,
        isLiveForm: result.document.isLiveForm,
      } : null,
      department: result.department ? {
        key: result.department.key,
        value: result.department.value,
        displayText: result.department.displayText,
      } : null,
      receivedEmployee: result.receivedEmployee ? {
        employeeId: result.receivedEmployee.employeeId,
        employeeNo: result.receivedEmployee.employeeNo,
        employeeName: result.receivedEmployee.employeeName,
        employeeAvatar: result.receivedEmployee.employeeAvatar ? {
          guid: result.receivedEmployee.employeeAvatar.employeeAvatar,
          thumbSizeUrl: result.receivedEmployee.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.receivedEmployee.employeeAvatar.largeSizeUrl,
        } : null,
        employeeEmail: result.receivedEmployee.employeeEmail,
      } : null,
      receiveStatus: result.receiveStatus ? {
        key: result.receiveStatus.key,
        value: result.receiveStatus.value,
        displayText: result.receiveStatus.displayText,
      } : null,
    };
  }
  // Quản lý người nhận tài liệu
  manageTransferDocs(bidOpportunityId: number) {
    const url = `bidopportunitys/${bidOpportunityId}/transferdocdetail`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result.items || []).map(
        this.toManageTransferDocs
      );
    });
  }
  // =============================
  // Bước 2, hợp đồng ký kết
  // Tải lên hợp đồng ký kết
  uploadContractSigning(
    BidOpportunityId: number,
    uploadResultFormValue: any,
    file: File,
  ) {
    const url = `bidopportunity/kqdt/contractdocument/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('Name', `${uploadResultFormValue.documentName}`);
    if (uploadResultFormValue.documentDesc || uploadResultFormValue.documentDesc === '') {
      formData.append('Desc', uploadResultFormValue.documentDesc);
    }
    formData.append('Vesion', `${uploadResultFormValue.version}`);
    formData.append('InterviewTime', `${uploadResultFormValue.interviewTimes}`);
    formData.append('ContractDate', uploadResultFormValue.receivedDate ?
      DateTimeConvertHelper.fromDtObjectToTimestamp(uploadResultFormValue.receivedDate).toString() : '');
    if (file) {
      formData.append('File', file);
    } else {
      formData.append('Url', uploadResultFormValue.link);
    }
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }
  // Có sự thay đổi listContractSigning
  changeListContractSigning() {
    this.listContractSigning.next();
  }
  // Obserable listContractSigning
  watchListContractSigning() {
    return this.listContractSigning;
  }
  // Filter danh sách hợp đồng ký kết
  createFilterContractSigning(filter: FilterContractSigning): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'uploadedDate',
      filter.uploadedDate ? DateTimeConvertHelper.fromDtObjectToTimestamp(filter.uploadedDate).toString() : ''
    );
    urlFilterParams.append(
      'uploadedByEmployeeId',
      filter.uploadedByEmployeeId ? filter.uploadedByEmployeeId.toString() : ''
    );
    urlFilterParams.append(
      'contractDate',
      filter.contractDate ? DateTimeConvertHelper.fromDtObjectToTimestamp(filter.contractDate).toString() : ''
    );
    urlFilterParams.append(
      'interviewTime',
      filter.interviewTime ? filter.interviewTime.toString() : ''
    );
    urlFilterParams.append(
      'sorting',
      filter.sorting ? filter.sorting : ''
    );
    return urlFilterParams;
  }
  // Mapping model danh sách hợp đồng ký kêt
  toContractSigningList(resutl: any): ContractSigningList {
    return {
      id: resutl.id,
      name: resutl.name,
      version: resutl.version,
      desc: resutl.desc,
      uploadByEmployee: {
        employeeId: resutl.uploadByEmployee.employeeId,
        employeeNo: resutl.uploadByEmployee.employeeNo,
        employeeName: resutl.uploadByEmployee.employeeName,
        employeeAvatar: {
          guid: resutl.uploadByEmployee.employeeAvatar.guid,
          thumbSizeUrl: resutl.uploadByEmployee.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: resutl.uploadByEmployee.employeeAvatar.largeSizeUrl,
        },
        employeeEmail: resutl.uploadByEmployee.employeeEmail,
      },
      uploadDate: resutl.uploadDate,
      contractDate: resutl.contractDate,
      interviewTime: resutl.interviewTime,
    };
  }
  // Filter danh sách hợp đồng ký kết
  filterContractSigning(
    bidOpportunityId: number,
    searchTerm: string,
    filter: FilterContractSigning,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ContractSigningList>> {
    const filterUrl = `bidopportunity/${bidOpportunityId}/bidcontractdocument/filter/${page}/${pageSize}`;
    const urlParams = this.createFilterContractSigning(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          this.toContractSigningList
        )
      };
    });
  }
  // Tải template hợp đồng kí kết
  downloadTemplateContractSigning() {
    const url = `bidcontractdocument/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Xóa 1 hợp đồng ký kết
  deleteContractSigning(bidContractDocumentId: number) {
    const url = `bidcontractdocument/${bidContractDocumentId}/delete`;
    return this.apiService.post(url);
  }
  // Xóa nhiều hợp đồng ký kết
  deleteMultiContractSigning(bidContractDocumentIdArray: number[]) {
    const url = `bidcontractdocument/multidelete`;
    const request = {
      ids: bidContractDocumentIdArray,
    };
    return this.apiService.post(url, request);
  }
  // Tải về hợp đồng kí kết
  downloadContractSigning(bidContractDocumentId: number) {
    const url = `bidcontractdocument/${bidContractDocumentId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // =============================
  // Bước 3, Họp kick-off
  // Gửi thư thông báo họp kick-off
  notiMeetingKickOff(data: SendEmailModel, file: File[]) {
    const url = `bidopportunity/kqdt/guithuthongbaohopkickoff`;
    const dataObj = new FormData();
    dataObj.append('BidOpportunityId', data.bidOpportunityId + '');
    dataObj.append('Subject', data.subject ? data.subject : '');
    data.recipientEmails.forEach((item, index) => {
      dataObj.append('RecipientEmails[' + index + ']', item);
    });
    file.forEach(item => {
      dataObj.append('AttachmentFiles', item);
    });
    dataObj.append('Content', data.content);
    return this.apiService.postFile(url, dataObj);
  }
  // Tải lên biên bản cuộc họp
  uploadReportMeeting(
    BidOpportunityId: number,
    uploadResultFormValue: any,
    file: File,
  ) {
    const url = `bidmeetingreportdoc/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('DocumentName', `${uploadResultFormValue.documentName}`);
    formData.append('InterviewTimes', `${uploadResultFormValue.interviewTimes}`);
    formData.append('Version', `${uploadResultFormValue.version}`);
    if (uploadResultFormValue.documentDesc && uploadResultFormValue.documentDesc !== '') {
      formData.append('DocumentDesc', uploadResultFormValue.documentDesc);
    }
    if (file) {
      formData.append('DocumentFile', file);
    } else {
      formData.append('FileUrl', uploadResultFormValue.link);
    }
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }
  // Danh sách biên bản
  //  Tạo filter paramater danh sách biên bản cuộc họp
  toFilterMeetingReport(filter: FilterReportMeeting): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append(
      'meetingTime',
      filter.meetingTime ? DateTimeConvertHelper.fromDtObjectToTimestamp(filter.meetingTime).toString() : ''
    );
    urlFilterParams.append(
      'interviewTimes',
      filter.interviewTimes ? filter.interviewTimes.toString() : ''
    );
    urlFilterParams.append(
      'uploadedEmployeeId',
      filter.uploadedEmployeeId ? filter.uploadedEmployeeId.toString() : ''
    );
    urlFilterParams.append(
      'createdDate',
      filter.createdDate ? DateTimeConvertHelper.fromDtObjectToTimestamp(filter.createdDate).toString() : ''
    );
    urlFilterParams.append(
      'sorting',
      filter.sorting ? filter.sorting.toString() : ''
    );
    return urlFilterParams;
  }
  // Map theo model của danh sách biên bản cuộc họp
  toReportMeetingList(result: any): ReportMeetingList {
    return {
      id: result.id,
      documentName: result.documentName,
      version: result.version,
      uploadedBy: result.uploadedBy ? {
        employeeId: result.uploadedBy.employeeId,
        employeeNo: result.uploadedBy.employeeNo,
        employeeName: result.uploadedBy.employeeName,
        employeeAvatar: result.uploadedBy.employeeAvatar ? {
          guid: result.uploadedBy.employeeAvatar.guid,
          thumbSizeUrl: result.uploadedBy.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.uploadedBy.employeeAvatar.largeSizeUrl,
        } : null,
        employeeEmail: result.uploadedBy.employeeEmail,
      } : null,
      createdDate: result.createdDate,
      interviewTimes: result.interviewTimes,
      meetingTime: result.meetingTime,
      fileUrl: result.fileUrl,
      description: result.description,
    };
  }
  // Dánh sách biên bản cuộc họp (tìm kiếm, lọc)
  getBidMeetingReportDocsList(
    bidOpportunityId: number,
    searchTerm: string,
    filter: FilterReportMeeting,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ReportMeetingList>> {
    const filterUrl = `bidopportunity/${bidOpportunityId}/bidmeetingreportdocs/filter/${page}/${pageSize}`;
    const urlParams = this.toFilterMeetingReport(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          this.toReportMeetingList
        )
      };
    });
  }
  // Tải về biên bản cuộc họp hoặc file presentation
  downloadMeeting(bidMeetingReportDocId: number) {
    const url = `bidmeetingreportdoc/${bidMeetingReportDocId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Danh sách file Presentations
  // Danh sách file Presentations
  getBidMeetingFileList(
    bidOpportunityId: number,
    searchTerm: string,
    filter: FilterReportMeeting,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<ReportMeetingList>> {
    const filterUrl = `bidopportunity/${bidOpportunityId}/filepresentations/filter/${page}/${pageSize}`;
    const urlParams = this.toFilterMeetingReport(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      console.log('response-getBidMeetingFileList', response, result);
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.totalPages,
        total: result.totalCount,
        items: (result.items || []).map(
          this.toReportMeetingList
        )
      };
    });
  }
  // Tải lên file presentation
  uploadFilePresentationMeeting(
    BidOpportunityId: number,
    uploadResultFormValue: any,
    file: File,
  ) {
    const url = `filepresentaion/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('DocumentName', `${uploadResultFormValue.documentName}`);
    formData.append('InterviewTimes', `${uploadResultFormValue.interviewTimes}`);
    formData.append('Version', `${uploadResultFormValue.version}`);
    if (uploadResultFormValue.documentDesc || uploadResultFormValue.documentDesc === '') {
      formData.append('DocumentDesc', uploadResultFormValue.documentDesc);
    }
    if (file) {
      formData.append('DocumentFile', file);
    } else {
      formData.append('FileUrl', uploadResultFormValue.link);
    }
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }
  // Xóa biên bản cuộc họp hoặc file presentation
  deleteMeetingReportOrFile(bidMeetingReportDocId: number) {
    const url = `bidmeetingreportdoc/${bidMeetingReportDocId}/delete`;
    return this.apiService.post(url);
  }
  // Xóa nhiều biên bản cuộc họp hoặc file presentation
  deleteMutipleMeetingReportOrFile(bidMeetingReportDocIdArray: number[]) {
    const url = `bidmeetingreportdocs/multidelete`;
    const request = {
      ids: bidMeetingReportDocIdArray,
    };
    return this.apiService.post(url, request);
  }
}
