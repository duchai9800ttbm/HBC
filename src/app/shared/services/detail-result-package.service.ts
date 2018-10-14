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
          documentType: {
            key: itemNeedTransferDocument.documentType.key,
            value: itemNeedTransferDocument.documentType.value,
            displayText: itemNeedTransferDocument.documentType.displayText,
          },
          document: {
            type: itemNeedTransferDocument.document.type,
            id: itemNeedTransferDocument.document.id,
            name: itemNeedTransferDocument.document.name,
            interviewTime: itemNeedTransferDocument.document.interviewTime,
          },
          childDocuments: itemNeedTransferDocument.childDocuments ? itemNeedTransferDocument.childDocuments.map(itemChildDocuments => {
            return {
              documentType: {
                key: itemChildDocuments.documentType.key,
                value: itemChildDocuments.documentType.value,
                displayText: itemChildDocuments.documentType.displayText,
              },
              document: {
                type: itemChildDocuments.document.type,
                id: itemChildDocuments.document.id,
                name: itemChildDocuments.document.name,
                interviewTime: itemChildDocuments.document.interviewTime,
              }
            };
          }) : null,
        };
      }) : null,
    };
  }
  // Danh sách tài liệu cần chuyển giao(tìm kiếm, lọc)
  getListNeedTransferDocs(
    bidOpportunityId: number,
    searchTerm: string,
    filter: FilterNeedTransferDoc,
    page: number | string,
    pageSize: number | string
  ): Observable<NeedTranferDocList[]> {
    const filterUrl = `tenderresultdocument/bidOpportunity/${bidOpportunityId}/needtransferdocs`;
    const urlParams = this.toParamaterNeedTransfer(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toListNeedTransferDocs
      );
    });
  }
  // Danh sách loại tài liệu cần chuyển giao
  getListTypeNeedTransferDoc() {
    const url  = `tenderresultdocument/transferdocumenttypes`;
    return this.apiService.get(url).map( response => {
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
}
