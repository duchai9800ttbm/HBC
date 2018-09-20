import { Component, OnInit } from '@angular/core';
import { SiteSurveyReport } from '../../../../../../shared/models/site-survey-report/site-survey-report';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TenderSiteSurveyingReport } from '../../../../../../shared/models/api-request/package/tender-site-surveying-report';
import { PackageDetailComponent } from '../../../package-detail.component';


@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit {
  static formModel: SiteSurveyReport = new SiteSurveyReport();
  static viewFlag: boolean;
  bidOpportunityId: number;
  isData;
  documentData = new SiteSurveyReport();
  idx: number;
  constructor(
    private documentService: DocumentService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = +PackageDetailComponent.packageId;
    this.documentService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      LiveformSiteReportComponent.formModel = res;
      this.documentData = res;
      this.isData = (this.documentData.id) ? true : false;
      console.log(this.documentData.id);
    });
  }
  createMode() {
    LiveformSiteReportComponent.formModel.id = 1;
  }

  onActivate(event, view) {
    LiveformSiteReportComponent.viewFlag = view;
  }
}
