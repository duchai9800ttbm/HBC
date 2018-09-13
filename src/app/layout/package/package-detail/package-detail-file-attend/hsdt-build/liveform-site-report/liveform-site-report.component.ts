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
  bidOpportunityId: number;
  isData;
  documentData = new SiteSurveyReport();
  constructor(
    private documentService: DocumentService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = +PackageDetailComponent.packageId;
    const elem = Array.from(document.querySelectorAll
      ('#searchButton, #agreeButton, #addNewButton, #printButton, #deleteButton, #downloadButton')
    );
    elem.forEach(e => { (<HTMLElement>e).style.visibility = 'hidden'; (<HTMLElement>e).style.position = 'absolute'; });

    this.documentService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      this.documentData = res;
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
    });
  }
}
