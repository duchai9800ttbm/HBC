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

  // Form-in phiếu tóm tắt đề nghị dự thầu
  printTenderCondition(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderconditionsummaryreport/printing`;
    return this.apiService.getHTML(url).map(response => response._body);
  }

   // Form-in phân công tiến độ
  printTenderPreparationPlanningAssignment(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/tenderpreparationplanningassignment/printing`;
    return this.apiService.getHTML(url).map(response => response._body);
  }

  // Form-in báo cáo tham quan công trường
  printSiteSurveyReport(bidOpportunityId: number) {
    const url = `bidopportunity/${bidOpportunityId}/sitesurveyingreport/printing`;
    return this.apiService.getHTML(url).map(response => response._body);
  }
}
