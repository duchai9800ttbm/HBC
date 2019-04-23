import { Injectable } from '@angular/core';
import { SessionService, ApiService, InstantSearchService } from '.';
import { FilterPipe } from 'ngx-filter-pipe';
import { Observable } from 'rxjs';
import { BidPriceApprovalModel } from '../models/document/bid-price-approval-document.model';
import * as FileSaver from 'file-saver';

@Injectable()
export class DocumentPriceReviewService {

    constructor(
        private sessionService: SessionService,
        private apiService: ApiService,
        private filterService: FilterPipe,
        private instantSearchService: InstantSearchService,
    ) { }

    read(bidOpportunityId: number | string): Observable<BidPriceApprovalModel[]> {
        const url = `bidpriceapprovaldoc/bidOpportunity/${bidOpportunityId}/filter`;
        return this.apiService.get(url)
            .map(response => response.result.map(DocumentPriceReviewService.toBidPriceApprovalListItem));
    }
    // convert du lieu tu api theo dinh dang cua model
    // tslint:disable-next-line:member-ordering
    private static toBidPriceApprovalListItem(result: any): BidPriceApprovalModel {
        return {
            id: result.id,
            documentType: result.documentType,
            documentName: result.documentName,
            version: result.version,
            status: result.status,
            uploadedBy: result.uploadedBy && {
                employeeId: result.uploadedBy.employeeId,
                employeeNo: result.uploadedBy.employeeNo,
                employeeName: result.uploadedBy.employeeName,
                employeeAvatar: result.uploadedBy.employeeAvatar
            },
            createdDate: result.createdDate,
            fileGuid: result.fileGuid,
            description: result.desc,
            interviewTimes: result.interviewTimes
        };
    }

    download(bidPriceApprovalDocId: number | string) {
        const url = `bidpriceapprovaldoc/${bidPriceApprovalDocId}/download`;
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
        documentType: string,
        documentName: string,
        description: string,
        file: File
    ) {
        const url = `bidpriceapprovaldoc/upload`;
        const formData = new FormData();
        formData.append('BidOpportunityId', `${id}`);
        formData.append('DocumentType', documentType);
        formData.append('DocumentName', documentName);
        formData.append('DocumentDesc', description);
        formData.append('DocumentFile', file);
        return this.apiService.postFile(url, formData)
            .map(response => response)
            .share();
    }
}
