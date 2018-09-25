import { Component, OnInit } from '@angular/core';
import { SiteSurveyReport } from '../../../../../../shared/models/site-survey-report/site-survey-report';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PagedResult } from '../../../../../../shared/models';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { Subject } from 'rxjs/Subject';
import { SiteReportChangedHistory } from '../../../../../../shared/models/site-survey-report/site-report-changed-history';

@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit {
  static formModel: SiteSurveyReport = new SiteSurveyReport();
  static viewFlag: boolean;
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  isData;
  documentData = new SiteSurveyReport();
  updateInfoList;
  listConstructionType;
  pagedResult: PagedResult<SiteReportChangedHistory> = new PagedResult<SiteReportChangedHistory>();
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = +PackageDetailComponent.packageId;
    this.documentService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      LiveformSiteReportComponent.formModel = res;
      if (!LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh.length) {
        this.documentService.getListConstructionType().subscribe(ress => {
          this.listConstructionType = ress;
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.listConstructionType;
        });
      }
      this.documentData = res;
      this.isData = (this.documentData.id) ? true : false;
    });
    this.documentService.changedHistoryTenderSiteReport(this.bidOpportunityId, 0, 10)
      .subscribe(responseResultHistory => {
        this.pagedResult = responseResultHistory;
        this.updateInfoList = responseResultHistory.items;
        this.dtTrigger.next();
        this.spinner.hide();
      }, err => this.spinner.hide());
  }
  refresh() {
    this.spinner.show();
    this.documentService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      LiveformSiteReportComponent.formModel = res;
      if (!LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh.length) {
        this.documentService.getListConstructionType().subscribe(ress => {
          this.listConstructionType = ress;
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.listConstructionType;
        });
      }
      this.documentData = res;
      this.isData = (this.documentData.id) ? true : false;
      LiveformSiteReportComponent.viewFlag = false;
    },
      err => {
        this.spinner.hide();
        this.alertService.error('Đã xảy ra lỗi, dữ liệu không được cập nhật');
      });
  }
  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }
  createMode() {
    LiveformSiteReportComponent.formModel.id = 1;
  }
  deleteDoc() {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa báo cáo này?',
      () => {
        this.documentService.deleteSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
          that.alertService.success('Đã xóa báo cáo công trình!');
          this.spinner.hide();
          that.refresh();
        },
          err => {
            that.alertService.error('Đã gặp lỗi, chưa xóa được báo cáo công trình!');
          });
      }
    );
  }

  onActivate(event, view) {
    LiveformSiteReportComponent.viewFlag = view;
  }
}
