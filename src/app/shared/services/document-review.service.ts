import { Injectable } from '@angular/core';
import { SessionService } from './session.service';
import { ApiService } from './api.service';
import { FilterPipe } from '../../../../node_modules/ngx-filter-pipe';
import { InstantSearchService } from './instant-search.service';
import { Observable } from '../../../../node_modules/rxjs/Observable';
import { BidDocumentReviewModel } from '../models/document/bid-document-review.model';
import * as moment from 'moment';
import { BidDocumentReviewFilter } from '../models/document/bid-document-review-filter.model';
import * as FileSaver from 'file-saver';

@Injectable()
export class DocumentReviewService {

    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private filterService: FilterPipe,
        private instantSearchService: InstantSearchService,
    ) { }

    read(bidOpportunityId: number | string): Observable<BidDocumentReviewModel[]> {
        const url = `bidreviewdocument/bidopportunity/${bidOpportunityId}/bidreviewdocuments `;
        return this.apiService.get(url)
            .map(response => response.result as BidDocumentReviewModel[]);
    }

    updateStatus(bidReviewDocumentId: number | string, status: string) {
        const url = `bidreviewdocument/${bidReviewDocumentId}/${status.toLocaleLowerCase()}`;
        return this.apiService.post(url).map(response => response);
    }
    filter(searchTerm: string, filterModel: BidDocumentReviewFilter, source: BidDocumentReviewModel[]) {
        const list = this.convertJson(source);
        const listAfterfilter = this.sortAndSearch(searchTerm, filterModel, list);
        const listFormat = this.formatJson(listAfterfilter);
        return listFormat;
    }

    convertJson(source: any[]) {
        const arr = source.map(x => {
            const day = moment.utc(x.bidReviewDocumentUploadDate * 1000).get('date');
            const month = moment.utc(x.bidReviewDocumentUploadDate * 1000).get('month') + 1;
            const year = moment.utc(x.bidReviewDocumentUploadDate * 1000).get('year');
            return { ...x, day, month, year, employeeId: x.bidReviewDocumentUploadedBy.employeeId };
        });
        return arr;
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

    sortAndSearch(searchTerm: string, filterModel: BidDocumentReviewFilter, source: any[]) {
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
                    bidReviewDocumentName: `${searchTerm ? searchTerm : ''}`,
                    bidReviewDocumentStatus: `${filterModel.status ? filterModel.status : ''}`,
                    employeeId: filterModel.uploadedEmployeeId ? +filterModel.uploadedEmployeeId : null,
                    day: `${day ? day : ''}`,
                    month: `${month ? month : ''}`,
                    year: `${year ? year : ''}`
                });
    }

    download(bidReviewDocumentId: number) {
        const url = `bidreviewdocument/${bidReviewDocumentId}/download`;
        return this.apiService.getFile(url).map(response => {
            return FileSaver.saveAs(
                new Blob([response.file], {
                    type: `${response.file.type}`,
                }), response.fileName
            );
        });
    }

    delete(bidDocumentId: number) {
        const url = `biddocument/${bidDocumentId}/delete `;
        return this.apiService.post(url).map(response => response);
    }
    downloadTemplate() {
        const url = `bidreviewdocument/template/downoad`;
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
        description: string,
        isSuggestedApprove: boolean,
        date: number,
        file: File
    ) {
        const url = `bidreviewdocument/upload`;
        const formData = new FormData();
        formData.append('BidOpportunityId', `${id}`);
        formData.append('IsSuggestedApprove', `${isSuggestedApprove}`);
        formData.append('Name', documentName);
        formData.append('Desc', description);
        formData.append('File', file);
        return this.apiService.postFile(url, formData)
            .map(response => response)
            .share();
    }
}
