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
import { HadTransferList } from '../models/result-attend/had-transfer-list.model';
import { FilterTransferredDoc } from '../models/result-attend/filter-transferred-doc.model';
import { TransferredDoc } from '../models/result-attend/transferred-doc.model';
import { DocumentTypeAll } from '../models/package/document-type-all';
import { StatusDocTranfered } from '../models/result-attend/status-doc-tranfered.model';
import { NeedTransferDocFilter } from '../models/result-attend/need-transfer-doc-filter.model';
import { DocmentParent } from '../models/result-attend/docment-parent.model';
@Injectable()
export class DetailResultPackageService {
  listFileResult: Subject<any> = new Subject();
  listContractSigning: Subject<any> = new Subject();
  listReportMeeting: Subject<any> = new Subject();
  listFilePresentationMeeting: Subject<any> = new Subject();
  listFileThanksLetter: Subject<any> = new Subject();
  instantSearchService: any;
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
          guid: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.guid,
          thumbSizeUrl: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.largeSizeUrl,
        },
        employeeEmail: result.uploadBy.employeeEmail,
      },
      uploadDate: result.uploadDate,
      interviewTimes: result.interviewTimes,
      fileGuid: result.fileGuid,
      linkUrl: result.linkUrl,
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
    formData.append('Name', `${uploadResultFormValue.documentName.trim()}`);
    formData.append('InterviewTimes', `${uploadResultFormValue.interviewTimes}`);
    formData.append('ReceivedDate', uploadResultFormValue.receivedDate ?
      DateTimeConvertHelper.fromDtObjectToTimestamp(uploadResultFormValue.receivedDate).toString() : '');
    if (uploadResultFormValue.documentDesc || uploadResultFormValue.documentDesc === '') {
      formData.append('Desc', uploadResultFormValue.documentDesc);
    }
    if (file) {
      formData.append('File', file);
    } else {
      formData.append('Url', uploadResultFormValue.link.trim());
    }
    formData.append('Version', uploadResultFormValue.version);
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
  // Tải template Thông báo kết quả trật thầu
  downloadTemplateLostBid() {
    const url = `template/tenderlose/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Tải template Thông báo kết quả trúng thầu
  downloadTemplateWinBid() {
    const url = `template/tenderwin/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Tải Báo cáo đánh giá rút kinh nghiệm
  downloadTemplateLessonLearn() {
    const url = `template/tenderlesson/download`;
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
  sendFeedbackToStakeholders(data: SendEmailModel, file: File[], isAgain: boolean) {
    const url = `bidopportunity/kqdt/sendmailtostakeholders`;
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
    dataObj.append('IsAgain', isAgain.toString());
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
          documents: (itemNeedTransferDocument.documents &&
            itemNeedTransferDocument.documents.length !== 0 &&
            itemNeedTransferDocument.documents[0] !== null)
            ? itemNeedTransferDocument.documents.map(itemParDocuments =>
              ({
                type: itemParDocuments.type,
                id: itemParDocuments.id,
                name: itemParDocuments.name,
                interviewTime: itemParDocuments.interviewTime,
                isLiveForm: itemParDocuments.isLiveForm,
                filerUrl: itemParDocuments.filerUrl,
              })) : null,
          childDocuments: itemNeedTransferDocument.childDocuments ? itemNeedTransferDocument.childDocuments.map(itemChildDocuments => {
            return {
              documentType: itemChildDocuments.documentType ? {
                key: itemChildDocuments.documentType.key,
                value: itemChildDocuments.documentType.value,
                displayText: itemChildDocuments.documentType.displayText,
              } : null,
              documents: itemChildDocuments.documents ? itemChildDocuments.documents.map(item =>
                ({
                  type: item.type,
                  id: item.id,
                  name: item.name,
                  interviewTime: item.interviewTime,
                  isLiveForm: item.isLiveForm,
                  filerUrl: item.filerUrl,
                })
              ) : null
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
  // Chuyển giao tài liệu
  tranferDocs(bidOpportunityId: number, docChoose: any) {
    const url = `bidopportunity/kqdt/chuyengiaotailieu`;
    const request = {
      bidOpportunityId: bidOpportunityId,
      transferDocuments: docChoose.map(item => {
        if (item.dateUse && item.dateUse.indexOf(' ngày') !== -1) {
          item.dateUse = item.dateUse.replace(' ngày', '');
        }
        const departmentIds = [];
        if (item.transferName) {
          item.transferName.forEach(itemTranfer => {
            departmentIds.push(itemTranfer.id);
          });
        }
        return {
          documentId: item.id,
          documentType: item.type,
          documentName: item.name,
          departmentIds: departmentIds,
          useDate: item.dateUse ? Number(item.dateUse) : 0
        };
      }),
    };
    return this.apiService.post(url, request);
  }
  // Thay đổi ngày sử dụng của tài liệu đã chuyển giao
  updateUsedays(bidTransferDocIds, useDate) {
    const url = `bidtransferdoc/changeusedatetrasferdocs/${useDate}`;
    const request = {
      ids: [bidTransferDocIds]
    };
    return this.apiService.post(url, request);
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
  manageTransferDocs(bidOpportunityId: number): Observable<ManageNeedTranferList[]> {
    const url = `bidopportunitys/${bidOpportunityId}/transferdocdetail`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toManageTransferDocs
      );
    });
  }
  // Yêu cầu gửi lại tài liệu
  requestToreSubmitdoc(bidTransferDocDetailId: number) {
    const url = `bidtransferdocdetail/${bidTransferDocDetailId}/requesttoresubmitdoc`;
    return this.apiService.get(url);
  }
  // Gửi lại tài liệu
  resubmitDoc(bidTransferDocDetailId: number) {
    const url = `bidtransferdocdetail/${bidTransferDocDetailId}/resubmitdoc`;
    return this.apiService.get(url);
  }
  // Xác nhận đã nhận
  confirmReceiveDocs(idsArray: number[]) {
    const url = `bidtransferdocdetail/confirmreceivedocs`;
    const request = {
      ids: idsArray
    };
    return this.apiService.post(url, request);
  }
  // Map to model danh sách tài liệu đã chuyển giao
  toHadTransferedList(result: any): HadTransferList {
    return {
      bidOpportunityStage: result.bidOpportunityStage ? {
        key: result.bidOpportunityStage.key,
        value: result.bidOpportunityStage.value,
        displayText: result.bidOpportunityStage.displayText,
      } : null,
      transferDocument: result.transferDocument ? result.transferDocument.map(itemTransferDocument => {
        return {
          documentType: itemTransferDocument.documentType ? {
            key: itemTransferDocument.documentType.key,
            value: itemTransferDocument.documentType.value,
            displayText: itemTransferDocument.documentType.displayText,
          } : null,
          // tslint:disable-next-line:max-line-length
          documents: (itemTransferDocument.documents && itemTransferDocument.documents.length !== 0 && itemTransferDocument.documents[0] !== null) ?
            itemTransferDocument.documents.map(itemdocument => {
              return {
                transferDocId: itemdocument.transferDocId,
                departments: (itemdocument.departments && itemdocument.departments.length !== 0 && itemdocument.departments[0] !== null) ?
                  itemdocument.departments.map(itemDepartments => {
                    return {
                      key: itemDepartments ? itemDepartments.key : null,
                      value: itemDepartments ? itemDepartments.value : null,
                      displayText: itemDepartments ? itemDepartments.displayText : null,
                    };
                  }) : null,
                useDays: itemdocument.useDays,
                type: itemdocument.type,
                id: itemdocument.id,
                name: itemdocument.name,
                interviewTime: itemdocument.interviewTime,
                isLiveForm: itemdocument.isLiveForm,
                filerUrl: itemdocument.filerUrl
              };
            }) : null,
          childDocuments: itemTransferDocument.childDocuments ? itemTransferDocument.childDocuments.map(itemChildDocuments => {
            return {
              documentType: itemChildDocuments.documentType ? {
                key: itemChildDocuments.documentType.key,
                value: itemChildDocuments.documentType.value,
                displayText: itemChildDocuments.documentType.displayText,
              } : null,
              documents: (itemChildDocuments.documents && itemChildDocuments.documents.length !== 0) ?
                itemChildDocuments.documents.map(itemDocuments => {
                  return {
                    transferDocId: itemDocuments.transferDocId,
                    departments: (itemDocuments.departments && itemDocuments.departments.length !== 0) ?
                      itemDocuments.departments.map(itemDepartments => {
                        return {
                          key: itemDepartments ? itemDepartments.key : null,
                          value: itemDepartments ? itemDepartments.value : null,
                          displayText: itemDepartments ? itemDepartments.displayText : null,
                        };
                      }) : null,
                    useDays: itemDocuments.useDays,
                    type: itemDocuments.type,
                    id: itemDocuments.id,
                    name: itemDocuments.name,
                    interviewTime: itemDocuments.interviewTime,
                    isLiveForm: itemDocuments.isLiveForm,
                    filerUrl: itemDocuments.filerUrl
                  };
                }) : null
            };
          }) : null,
        };
      }) : null,
    };
  }
  // Create pramaster danh sách tài liệu đã chuyển giao
  createPramaster(filter: NeedTransferDocFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    if (filter.documentType) {
      urlFilterParams.append('documentType', filter.documentType.type ? filter.documentType.type.toString() : '');
      // tslint:disable-next-line:max-line-length
      urlFilterParams.append('bidOpportunityStage', filter.documentType.bidOpportunityStage ? filter.documentType.bidOpportunityStage.toString() : '');
      urlFilterParams.append('documentTypeId', filter.documentType.id ? filter.documentType.id.toString() : '');
    }
    if (filter.useDate) {
      urlFilterParams.append('useDate', filter.useDate.toString());
    }
    if (filter.interviewTimes) {
      urlFilterParams.append('interviewTimes', filter.interviewTimes.toString());
    }
    if (filter.departmentId) {
      urlFilterParams.append('departmentId', filter.departmentId.toString());
    }
    return urlFilterParams;
  }
  // Danh sách tài liệu đã chuyển giao
  getHadTransferredList(
    bidOpportunityId,
    terms: string,
    filter: NeedTransferDocFilter,
  ): Observable<HadTransferList[]> {
    const url = `tenderresultdocument/bidOpportunity/${bidOpportunityId}/transferdocs?searchTerm=${terms}`;
    return this.apiService.get(url, this.createPramaster(filter))
      .map(reponse => {
        const result = reponse.result;
        return (result || []).map(
          this.toHadTransferedList
        );
      });
  }
  // Map to model danh sách tài liệu HSDT + HSMT cha
  toDocumentParent(result: any): DocmentParent {
    return {
      bidOpportunityStage: result.bidOpportunityStage ? {
        id: result.bidOpportunityStage.key,
        text: result.bidOpportunityStage.value,
        displayText: result.bidOpportunityStage.displayText,
      } : null,
      detail: result.detail ? (result.detail || []).map(item => {
        return {
          id: item.id,
          name: item.name,
          type: item.type,
        };
      }) : null,
    };
  }
  // Danh sách loại tài liệu HSDT + HSMT cha
  getDocumentParentList(): Observable<DocmentParent[]> {
    const url = `data/parentdocumenttypehsdtandhsmt`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(item => {
        return this.toDocumentParent(item);
      });
    });
  }
  // to filter paramter cho danh sách tài liệu được chuyển giao
  toFilterTranferDocDetails(filter: FilterTransferredDoc): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    if (filter.documentType) {
      urlFilterParams.append(
        'documentType',
        filter.documentType.type ? filter.documentType.type.toString() : ''
      );
      urlFilterParams.append(
        'documentTypeId',
        filter.documentType.id ? filter.documentType.id.toString() : ''
      );
      urlFilterParams.append(
        'bidOpportunityStage',
        filter.documentType.bidOpportunityStage ? filter.documentType.bidOpportunityStage.toString() : ''
      );
    }
    urlFilterParams.append(
      'status',
      filter.status ? filter.status.toString() : ''
    );
    return urlFilterParams;
  }
  // Map theo model cuả tài liệu được chuyển giao
  toTransferredDoc(result: any): TransferredDoc {
    return {
      bidDocumentState: result.bidDocumentState ? {
        key: result.bidDocumentState.key,
        value: result.bidDocumentState.value,
        displayText: result.bidDocumentState.displayText,
      } : null,
      bidTransferDocDetails: (result.bidTransferDocDetails && result.bidTransferDocDetails.length !== 0) ?
        result.bidTransferDocDetails.map(itemBidTransferDocDetails => {
          return {
            id: itemBidTransferDocDetails.id,
            documentType: itemBidTransferDocDetails.documentType ? {
              key: itemBidTransferDocDetails.documentType.key,
              value: itemBidTransferDocDetails.documentType.value,
              displayText: itemBidTransferDocDetails.documentType.displayText,
            } : null,
            document: itemBidTransferDocDetails.document ? {
              type: itemBidTransferDocDetails.document.type,
              id: itemBidTransferDocDetails.document.id,
              name: itemBidTransferDocDetails.document.name,
              interviewTime: itemBidTransferDocDetails.document.interviewTime,
              isLiveForm: itemBidTransferDocDetails.document.isLiveForm,
              filerUrl: itemBidTransferDocDetails.document.filerUrl,
            } : null,
            sendDate: itemBidTransferDocDetails.sendDate,
            useTo: itemBidTransferDocDetails.useTo,
            status: itemBidTransferDocDetails.status ? {
              key: itemBidTransferDocDetails.status.key,
              value: itemBidTransferDocDetails.status.value,
              displayText: itemBidTransferDocDetails.status.displayText,
            } : null,
            sendEmployee: itemBidTransferDocDetails.sendEmployee ? {
              employeeId: itemBidTransferDocDetails.sendEmployee.employeeId,
              employeeNo: itemBidTransferDocDetails.sendEmployee.employeeNo,
              employeeName: itemBidTransferDocDetails.sendEmployee.employeeName,
              employeeAvatar: itemBidTransferDocDetails.sendEmployee.employeeAvatar ? {
                guid: itemBidTransferDocDetails.sendEmployee.employeeAvatar.guid,
                thumbSizeUrl: itemBidTransferDocDetails.sendEmployee.employeeAvatar.thumbSizeUrl,
                largeSizeUrl: itemBidTransferDocDetails.sendEmployee.employeeAvatar.largeSizeUrl,
              } : null,
              employeeEmail: itemBidTransferDocDetails.sendEmployee.employeeEmail,
            } : null,
            isFirstTransfer: itemBidTransferDocDetails.isFirstTransfer,
            receiveStatus: itemBidTransferDocDetails.receiveStatus ? {
              key: itemBidTransferDocDetails.receiveStatus.key,
              value: itemBidTransferDocDetails.receiveStatus.value,
              displayText: itemBidTransferDocDetails.receiveStatus.displayText,
            } : null,
          };
        }) : null,
    };
  }
  // Danh sách tài liệu được chuyển giao
  filterTransferDocDetailsList(
    bidOpportunityId: number,
    searchTerm: string,
    filter: FilterTransferredDoc,
  ): Observable<TransferredDoc[]> {
    const filterUrl = `bidOpportunity/${bidOpportunityId}/filtertransferdocdetails`;
    const urlParams = this.toFilterTranferDocDetails(filter);
    urlParams.append('searchTerm', searchTerm);
    return this.apiService.get(filterUrl, urlParams).map(response => {
      const result = response.result;
      return (result || []).map(this.toTransferredDoc);
    });
  }
  // Danh sách loại tài liệu HSDT + HSMT con
  getDocumentChild(): Observable<DocmentParent[]> {
    const url = `data/childdocumenttypehsdtandhsmt`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return result.map(item => {
        return this.toDocumentParent(item);
      });
    });
  }
  // Yêu cầu gửi lại tài liệu
  requesstToRessubmit(bidTransferDocDetailId: number) {
    const url = `bidtransferdocdetail/${bidTransferDocDetailId}/requesttoresubmitdoc`;
    return this.apiService.get(url);
  }
  // Map model danh sách tài liệu HSDT + HSMT
  toDocumentType(result: any): DocumentTypeAll {
    return {
      bidOpportunityStage: result.bidOpportunityStage ? {
        id: result.bidOpportunityStage.key,
        text: result.bidOpportunityStage.value,
        displayText: result.bidOpportunityStage.displayText,
      } : null,
      detail: result.detail ? (result.detail || []).map(itemDetail => {
        return {
          id: itemDetail.id,
          name: itemDetail.name,
          type: itemDetail.type,
        };
      }) : null,
    };
  }
  // Danh sách tài liệu HSDT + HSMT
  documentTypeHsdtAndHsmt(): Observable<DocumentTypeAll[]> {
    const url = `data/documenttypehsdtandhsmt`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(items => {
        return this.toDocumentType(items);
      });
    });
  }
  // Danh sách trạng thái tài liệu người nhận
  getListStatusDoc(): Observable<StatusDocTranfered[]> {
    const url = `data/bidtransferdocdetailstatus`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(items => {
        return {
          id: items.key,
          text: items.value,
          displayText: items.displayText,
        };
      });
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
          guid: resutl.uploadByEmployee.employeeAvatar && resutl.uploadByEmployee.employeeAvatar.guid,
          thumbSizeUrl: resutl.uploadByEmployee.employeeAvatar && resutl.uploadByEmployee.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: resutl.uploadByEmployee.employeeAvatar && resutl.uploadByEmployee.employeeAvatar.largeSizeUrl,
        },
        employeeEmail: resutl.uploadByEmployee.employeeEmail,
      },
      uploadDate: resutl.uploadDate,
      contractDate: resutl.contractDate,
      interviewTime: resutl.interviewTime,
      fileUrl: resutl.fileUrl,
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
  notiMeetingKickOff(data: SendEmailModel, file: File[], isAgain: boolean) {
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
    dataObj.append('IsAgain', isAgain.toString());
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
    formData.append(
      'MeetingnTime',
      uploadResultFormValue.meetingTime ? DateTimeConvertHelper.fromDtObjectToTimestamp(uploadResultFormValue.meetingTime).toString() : ''
    );
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
  // Tải template biên bản cuộc họp
  meetingReportTemplate() {
    const url = `meetingreport/template/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }

  // Có sự thay đổi listReportMeeting
  changeListReportMeeting() {
    this.listReportMeeting.next();
  }
  // Obserable listReportMeeting
  watchListListReportMeeting() {
    return this.listReportMeeting;
  }

  // Có sự thay đổi listReportMeeting
  changeListFilePresentationMeeting() {
    this.listFilePresentationMeeting.next();
  }
  // Obserable listReportMeeting
  watchListFilePresentationMeeting() {
    return this.listFilePresentationMeeting;
  }

  // ==============
  // Hủy thầu
  // Tải lên tài liệu thư cảm ơn
  uploadThanksLetter(
    BidOpportunityId: number,
    uploadResultFormValue: any,
    file: File,
  ) {
    const url = `tenderthankletterdoc/upload`;
    const formData = new FormData();
    formData.append('BidOpportunityId', `${BidOpportunityId}`);
    formData.append('Name', `${uploadResultFormValue.documentName}`);
    formData.append('InterviewTimes', `${uploadResultFormValue.interviewTimes}`);
    if (uploadResultFormValue.documentDesc || uploadResultFormValue.documentDesc === '') {
      formData.append('Desc', uploadResultFormValue.documentDesc);
    }
    if (file) {
      formData.append('File', file);
    } else {
      formData.append('Url', uploadResultFormValue.link);
    }
    formData.append('Version', uploadResultFormValue.version);
    return this.apiService.postFile(url, formData)
      .map(response => response)
      .share();
  }
  // Mapping model danh sách thư cảm ơn
  toListThanksLetter(result: any): DocumentResultList {
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
          guid: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.guid,
          thumbSizeUrl: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.thumbSizeUrl,
          largeSizeUrl: result.uploadBy.employeeAvatar && result.uploadBy.employeeAvatar.largeSizeUrl,
        },
        employeeEmail: result.uploadBy.employeeEmail,
      },
      uploadDate: result.uploadDate,
      interviewTimes: result.interviewTimes,
      fileGuid: result.fileGuid,
      linkUrl: result.linkUrl,
    };
  }
  // Danh sách thư cảm ơn
  getListThanksLetter(BidOpportunityId: number): Observable<DocumentResultList[]> {
    const url = `tenderthankletterdoc/${BidOpportunityId}/gettenderthankletterdocs`;
    return this.apiService.get(url).map(response => {
      const result = response.result;
      return (result || []).map(
        this.toListThanksLetter
      );
    });
  }
  // Tải về tài liệu thư cảm ơn
  downloadThanksLetter(tenderThankLetterDocId: number) {
    const url = `tenderthankletterdoc/${tenderThankLetterDocId}/download`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }
  // Có sự thay đổi ThanksLetter list
  changeListThanksLetter() {
    this.listFileThanksLetter.next();
  }
  // Obserable ThanksLetter list
  watchListThanksLetter() {
    return this.listFileThanksLetter;
  }
  // Xóa 1 thư cảm ơn
  deleteThanksLetter(idFile: number) {
    const url = `tenderthankletterdoc/delete`;
    const request = {
      id: idFile,
    };
    return this.apiService.post(url, request);
  }
  // Xóa nhiều thư cảm ơn
  deleteMutipleThanksLetter(arayIdFile: number[]) {
    const url = `tenderthankletterdoc/deletemultiple`;
    const request = {
      ids: arayIdFile,
    };
    return this.apiService.post(url, request);
  }

  // Kiểm tra người dùng đã xác nhận tài liệu
  checkUserComfirm(bidOpportunityId: number) {
    const url = `bidtransferdoc/checkconfirmdocs/bidopportunity/${bidOpportunityId}`;
    return this.apiService.get(url).map(response => {
      return response.result;
    })
  }

}
