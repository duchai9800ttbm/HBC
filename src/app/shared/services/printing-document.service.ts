import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class PrintingDocumentService {

  constructor(
    private apiService: ApiService
  ) { }


  // Form-in trình duyệt giá
  printTenderPriceApproval(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpriceapproval/printing`;
    return this.apiService.getHTML(url).map(response => response._body);
  }

  // Form-in phiếu đề nghị dự thầu
  printProposedTenderParticipatinngReport(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/proposedtenderparticipatinngreport/printing`;
    return this.apiService.getHTML(url).map(response => response._body);
  }
}
