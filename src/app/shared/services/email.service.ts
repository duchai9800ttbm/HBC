import { Injectable } from '@angular/core';
import { ApiService, InstantSearchService, SessionService } from '.';
import { EmailItemModel, MultipeDelete, EmailFilter, EmailCategory } from '../models/email/email-item.model';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { URLSearchParams } from '@angular/http';
import { PagedResult } from '../models';
import * as FileSaver from 'file-saver';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class EmailService {
  static emailSubject = new Subject();

  private static createFilterParams(filter: EmailFilter): URLSearchParams {
    const urlFilterParams = new URLSearchParams();
    urlFilterParams.append('category', filter.category);
    return urlFilterParams;
  }
  private static toEmailListItem(result: any): EmailItemModel {
    return {
      id: result.id,
      senderEmployee: result.senderEmployee && {
        id: result.senderEmployee.id,
        employeeId: result.senderEmployee.employeeId,
        employeeNo: result.senderEmployee.employeeNo,
        employeeName: result.senderEmployee.employeeName,
        employeeAddress: result.senderEmployee.employeeAddress,
        employeeDob: result.senderEmployee.employeeDob,
        employeeTel: result.senderEmployee.employeeTel,
        employeeTel1: result.senderEmployee.employeeTel1,
        departmentName: result.senderEmployee.departmentName,
        levelName: result.senderEmployee.levelName,
        employeeAvatar: result.senderEmployee.employeeAvatar,
        departmentRoomName: result.senderEmployee.departmentRoomName,
        branchName: result.senderEmployee.branchName,
        employeeBirthPlace: result.senderEmployee.employeeBirthPlace,
        employeeIDNumber: result.senderEmployee.employeeIDNumber,
        employeeGender: result.senderEmployee.employeeGender,
        employeeTaxNumber: result.senderEmployee.employeeTaxNumber,
        employeeBankAccount: result.senderEmployee.employeeBankAccount
      },
      from: result.from,
      to: result.to,
      subject: result.subject,
      sentDate: result.sentDate,
      content: result.content,
      isSuccess: result.isSuccess,
      isImportant: result.isImportant,
      emailAttatchments: (result.emailAttatchments || []).map(
        x => {
          return {
            id: x.id,
            fileName: x.fileName
          };
        })
    };
  }

  constructor(
    private apiService: ApiService,
    private instantSearchService: InstantSearchService,
    private sessionService: SessionService,
  ) { }

  watchEmailSubject(): Observable<any> {
    return EmailService.emailSubject;
  }
  emitEvent() {
    EmailService.emailSubject.next();
  }
  searchWithFilter(
    bidOpportunityId: number,
    terms: string,
    filter: EmailFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<EmailItemModel>> {
    const url = `bidopportunitys/${bidOpportunityId}/emails/filter/${page}/${pageSize}/`;
    const urlParams = EmailService.createFilterParams(filter);
    urlParams.append('searchTerm', terms);
    return this.apiService.get(url, urlParams).map(result => {
      return {
        currentPage: result.pageIndex,
        pageSize: result.pageSize,
        pageCount: result.pageCount,
        total: result.totalCount,
        items: (result.items || []).map(
          EmailService.toEmailListItem
        )
      };
    });
  }

  instantSearchWithFilter(
    bidOpportunityId: number,
    terms: Observable<string>,
    filter: EmailFilter,
    page: number | string,
    pageSize: number | string
  ): Observable<PagedResult<EmailItemModel>> {
    const url = `bidopportunitys/${bidOpportunityId}/emails/filter/${page}/${pageSize}/?searchTerm=`;
    return this.instantSearchService.searchWithFilter(url, terms, EmailService.createFilterParams(filter))
      .map(result => {
        console.log(result);
        return {
          currentPage: result.pageIndex,
          pageSize: result.pageSize,
          pageCount: result.pageCount,
          total: result.totalCount,
          items: (result.items || []).map(
            EmailService.toEmailListItem
          )
        };
      });
  }

  view(bidEmailHistoryId: number): Observable<EmailItemModel> {
    const url = `emails/${bidEmailHistoryId}`;
    return this.apiService.get(url)
      .map(response => {
        const result = response.result;
        return EmailService.toEmailListItem(result);
      });
  }

  getListCategory(bidOpportunityId: number): Observable<EmailCategory[]> {
    const url = `bidopportunitys/${bidOpportunityId}/emailcatergories`;
    return this.apiService.get(url)
      .map(response =>
        response.result.map(x => {
          return {
            category: x.category && {
              key: x.category.key,
              value: x.category.value,
              displayText: x.category.displayText
            },
            count: x.count
          };
        })
      );
  }

  download(bidEmailAttachmentId: number) {
    const url = `emails/attachments/${bidEmailAttachmentId}`;
    return this.apiService.getFile(url).map(response => {
      return FileSaver.saveAs(
        new Blob([response.file], {
          type: `${response.file.type}`,
        }), response.fileName
      );
    });
  }

  delete(listEmailId: MultipeDelete) {
    const url = `emails/multidelete`;
    return this.apiService.post(url, listEmailId)
      .map(response => response);
  }

  moveToTrash(listEmailId: MultipeDelete) {
    const url = `emails/movetotrash`;
    return this.apiService.post(url, listEmailId)
      .map(response => response);
  }

  maskAsImportant(bidEmailId: number) {
    const url = `emails/${bidEmailId}/markasimportant`;
    return this.apiService.post(url)
      .map(response => response);
  }
}

