import { Injectable } from '@angular/core';
import { Observable } from '../../../../node_modules/rxjs';
import { ApiService } from './api.service';
import { Response } from '../../../../node_modules/@angular/http';
import { EmailModel } from '../models/email/email.model';

@Injectable()
export class OpportunityHsmtService {

  constructor(
    private apiService: ApiService,
  ) { }
  moveEvaluate(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/chuyendanhgia`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }
  evaluatePass(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/danhgiadat`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }
  evaluatePassFail(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/danhgiakhongdat`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }
  submitProposal(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/guiduyetdenghiduthau`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }
  joinBid(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/thamgiaduthau`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }

  hasDeclined(bidOpportunityId: number): Observable<any> {
    const url = `bidopportunity/hsmt/${bidOpportunityId}/tuchoiduthau`;
    return this.apiService.post(url)
      .map(response => {
        return response;
      })
      .share();
  }
  refuseMessage(emailModel: EmailModel): Observable<any> {
    const url = `bidopportunity/hsmt/guithutuchoiduthau`;
    const model = {
      bidOpportunityId: emailModel.bidOpportunityId,
      subject: emailModel.subject,
      recipientEmails: emailModel.recipientEmails,
      content: emailModel.content
    };
    return this.apiService.post(url, model)
      .map(response => {
        return response;
      })
      .share();
  }
}
