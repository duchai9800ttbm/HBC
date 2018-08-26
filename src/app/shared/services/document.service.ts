import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { BidDocumentModel } from '../models/document/bid-document.model';
import { BidDocumentGroupModel } from '../models/document/bid-document-group.model';
import { BidDocumentFilter } from '../models/document/bid-document-filter.model';
import * as moment from 'moment';
import { FilterPipe } from '../../../../node_modules/ngx-filter-pipe';
import * as FileSaver from 'file-saver';
import { InstantSearchService } from './instant-search.service';
import { URLSearchParams } from '@angular/http';

@Injectable()
export class DocumentService {
    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private filterService: FilterPipe,
        private instantSearchService: InstantSearchService,
    ) { }
    private static createFilterParams(filter: BidDocumentFilter): URLSearchParams {
        const urlFilterParams = new URLSearchParams();
        urlFilterParams.append('status', filter.status);
        urlFilterParams.append('uploadedEmployeeId', filter.uploadedEmployeeId ? filter.uploadedEmployeeId.toString() : '');
        urlFilterParams.append('createdDate', filter.createDate ? filter.createDate.toString() : '');
        return urlFilterParams;
    }
    private static toRecordInvitation(result: any): any {
        return {
            id: result.id,
            typeOfDocument: result.documentType,
            fileName: result.documentName,
            version: result.version,
            status: result.status,
            uploadPeople: result.uploadedBy.employeeName,
            uploadDate: result.createdDate,
            receivedDate: result.receivedDate
            // fileGuid: result.fileGuid,
        };
    }
    get employeeId() {
        return this.sessionService.currentUser.employeeId;
    }

    read(opportunityId: number | string): Observable<BidDocumentModel[]> {
        const url = `bidopportunity/${opportunityId}/biddocuments`;
        return this.apiService.get(url)
            .map(response => response.result as BidDocumentModel[]);
    }

    readAndGroup(opportunityId: number | string): Observable<BidDocumentGroupModel[]> {
        const url = `bidopportunity/${opportunityId}/biddocuments`;
        return this.apiService.get(url)
            .map(response => this.group(response.result));
    }

    bidDocumentsFilter(
        opportunityId: number,
        terms: Observable<string>,
        filter: BidDocumentFilter,
        page: number | string,
        pageSize: number | string
    ): Observable<any> {
        const searchUrl = `bidopportunity/${opportunityId}/biddocuments/filter/${page}/${pageSize}`;
        return this.instantSearchService.searchWithFilter(
            searchUrl,
            terms,
            DocumentService.createFilterParams(filter),
        )
            .map(result => {
                return {
                    currentPage: result.pageIndex,
                    pageSize: result.pageSize,
                    pageCount: result.totalPages,
                    total: result.totalCount,
                    items: (result.items || []).map(DocumentService.toRecordInvitation),
                };
            });
    }

    updateStatus(bidDocumentId: number | string, status: string) {
        const url = `biddocument/${bidDocumentId}/${status.toLocaleLowerCase()}`;
        return this.apiService.post(url).map(response => response);
    }

    delete(bidDocumentId: number) {
        const url = `biddocument/${bidDocumentId}/delete `;
        return this.apiService.post(url).map(response => response);
    }
    multiDelete(ids: any[]) {
        const url = `biddocument/multidelete`;
        const model = {
            ids: ids
        };
        return this.apiService.post(url, model).map(res => res);
    }

    download(bidDocumentId: number) {
        const url = `biddocument/${bidDocumentId}/download `;
        return this.apiService.getFile(url).map(response => {
            return FileSaver.saveAs(
                new Blob([response.file], {
                    type: `${response.file.type}`,
                }), response.fileName
            );
        });
    }

    upload(
        id: number,
        documentName: string,
        documentType: string,
        description: string,
        receivedDate: number,
        file: File,
    ) {
        const url = `biddocument/upload`;
        const formData = new FormData();
        formData.append('BidOpportunityId', `${id}`);
        formData.append('DocumentType', documentType);
        formData.append('DocumentName', documentName);
        formData.append('DocumentDesc', description);
        formData.append('ReceivedDate', `${moment(receivedDate).unix()}`);
        formData.append('DocumentFile', file);
        return this.apiService.postFile(url, formData)
            .map(response => response)
            .share();
    }

    filter(searchTerm: string, filterModel: BidDocumentFilter, source: BidDocumentGroupModel[]) {
        const listNoGroup = this.convertNestedJson(source);
        const listAfterFilter = this.sortAndSearch(searchTerm, filterModel, listNoGroup);
        const listFormat = this.formatJson(listAfterFilter);
        const listGroup = this.group(listFormat);
        return listGroup;
    }
    // convert list => listGroup
    group(source: BidDocumentModel[]): BidDocumentGroupModel[] {
        const groupedObj = source.reduce((prev, cur) => {
            if (!prev[cur['documentType']]) {
                prev[cur['documentType']] = [cur];
            } else {
                prev[cur['documentType']].push(cur);
            }
            return prev;
        }, {});
        return Object.keys(groupedObj).map(documentType => (
            {
                documentType,
                items: groupedObj[documentType]
            }
        ));
    }

    convertNestedJson(source: any[]) {
        const arr = source.map(x => {
            return x.items.map(y => {
                const day = moment.utc(y.createdDate * 1000).get('date');
                const month = moment.utc(y.createdDate * 1000).get('month');
                const year = moment.utc(y.createdDate * 1000).get('year');
                return {
                    id: y.id,
                    documentType: y.documentType,
                    documentName: y.documentName,
                    version: y.version,
                    status: y.status,
                    uploadedBy: y.uploadedBy,
                    createdDate: y.createdDate,
                    receivedDate: y.receivedDate,
                    day: day,
                    month: month + 1,
                    year: year,
                    employeeId: y.uploadedBy.employeeId
                };
            });
        }).concat();
        return ([]).concat(...arr);
    }

    unGroup(source: any[]) {
        const arr = source.map(x => {
            return x.items.map(y => {
                return {
                    id: y.id,
                    documentType: y.documentType,
                    documentName: y.documentName,
                    version: y.version,
                    status: y.status,
                    uploadedBy: y.uploadedBy,
                    createdDate: y.createdDate,
                    receivedDate: y.receivedDate,
                    checkboxSelected: y.checkboxSelected,
                    employeeId: y.uploadedBy.employeeId
                };
            });
        }).concat();
        return ([]).concat(...arr);
    }

    formatJson(source: any[]) {
        source.forEach(element => {
            delete element.day;
            delete element.month;
            delete element.year;
            delete element.employeeId;
        });
        return source;
    }

    sortAndSearch(searchTerm: string, filterModel: BidDocumentFilter, source: any[]) {
        let day = null, month = null, year = null;
        if (filterModel.createDate) {
            const today = new Date(
                moment(filterModel.createDate).unix()
            );
            day = moment(filterModel.createDate).get('date');
            month = moment(filterModel.createDate).get('month') + 1;
            year = moment(filterModel.createDate).get('year');
        }
        return this.filterService
            .transform(source,
                {
                    documentName: `${searchTerm ? searchTerm : ''}`,
                    status: `${filterModel.status ? filterModel.status : ''}`,
                    employeeId: filterModel.uploadedEmployeeId ? +filterModel.uploadedEmployeeId : null,
                    day: `${day ? day : ''}`,
                    month: `${month ? month : ''}`,
                    year: `${year ? year : ''}`
                });
    }
}
