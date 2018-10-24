import { Component, OnInit } from '@angular/core';
import { SiteSurveyReport } from '../../../../../../shared/models/site-survey-report/site-survey-report';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PagedResult } from '../../../../../../shared/models';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { Subject } from 'rxjs/Subject';
import { SiteReportChangedHistory } from '../../../../../../shared/models/site-survey-report/site-report-changed-history';
import { SiteSurveyReportService } from '../../../../../../shared/services/site-survey-report.service';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
import { ScaleOverall } from '../../../../../../shared/models/site-survey-report/scale-overall.model';

@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit {
  static formModel: SiteSurveyReport = new SiteSurveyReport();
  static isViewMode: boolean;
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  isData;
  isHistory;
  documentData = new SiteSurveyReport();
  updateInfoList;
  pageIndex: number | string = 0;
  listConstructionType;
  pagedResult: PagedResult<SiteReportChangedHistory> = new PagedResult<SiteReportChangedHistory>();
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  constructor(
    private documentService: DocumentService,
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.bidOpportunityId = +PackageDetailComponent.packageId;
    this.siteSurveyReportService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      if (!res) {
        LiveformSiteReportComponent.formModel = new SiteSurveyReport();
        LiveformSiteReportComponent.formModel.isCreate = true;
        LiveformSiteReportComponent.formModel.bidOpportunityId = this.bidOpportunityId;
        LiveformSiteReportComponent.formModel.scaleOverall = new ScaleOverall();
        LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = new Array;
        LiveformSiteReportComponent.formModel.scaleOverall.trangthaiCongTrinh = [
          {
            text: 'Mới (New)',
            value: '',
            checked: false
          },
          {
            text: 'Thay đổi & bổ sung (Alteration & Additional)',
            value: '',
            checked: false
          },
          {
            text: 'Khác (Other)',
            value: '',
            checked: false
          },
          {
            text: 'Nâng cấp, cải tiến (Renovation)',
            value: '',
            checked: false
          }, {
            text: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
            value: '',
            checked: false
          }
        ];
      } else {
        LiveformSiteReportComponent.formModel = res;
      }
      if (!LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh.length) {
        this.siteSurveyReportService.getListConstructionType().subscribe(ress => {
          this.listConstructionType = ress;
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.listConstructionType;
        }, err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi, danh sách loại công trình cập nhật không thành công');
        });
      }
      this.isData = (LiveformSiteReportComponent.formModel.id) ? true : false;
      this.documentData = res;
    }, err => {
      this.spinner.hide();
      this.alertService.error('Đã xảy ra lỗi, cập nhật dữ liệu lifeform không thành công');
    });
    this.siteSurveyReportService.changedHistoryTenderSiteReport(this.bidOpportunityId, 0, 10)
      .subscribe(responseResultHistory => {
        this.pagedResult = responseResultHistory;
        this.updateInfoList = responseResultHistory.items;
        this.dtTrigger.next();
        this.spinner.hide();
        this.isHistory = (this.updateInfoList.length) ? true : false;
      },
        err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi, cập nhật dữ liệu không thành công');
        });
  }
  refresh() {
    this.siteSurveyReportService.tenderSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
      if (!res) {
        LiveformSiteReportComponent.formModel = new SiteSurveyReport();
        LiveformSiteReportComponent.formModel.isCreate = true;
        LiveformSiteReportComponent.formModel.bidOpportunityId = this.bidOpportunityId;
        LiveformSiteReportComponent.formModel.scaleOverall = new ScaleOverall();
        LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = new Array;
        LiveformSiteReportComponent.formModel.scaleOverall.trangthaiCongTrinh = [
          {
            text: 'Mới (New)',
            value: '',
            checked: false
          },
          {
            text: 'Thay đổi & bổ sung (Alteration & Additional)',
            value: '',
            checked: false
          },
          {
            text: 'Khác (Other)',
            value: '',
            checked: false
          },
          {
            text: 'Nâng cấp, cải tiến (Renovation)',
            value: '',
            checked: false
          }, {
            text: 'Tháo dỡ & cải tiến (Demolishment & Renovation)',
            value: '',
            checked: false
          }
        ];
      } else {
        LiveformSiteReportComponent.formModel = res;
      }
      if (!LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh.length) {
        this.siteSurveyReportService.getListConstructionType().subscribe(ress => {
          this.listConstructionType = ress;
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = this.listConstructionType;
        }, err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi, danh sách loại công trình cập nhật không thành công');
        });
      }
      this.isData = (LiveformSiteReportComponent.formModel.id) ? true : false;
      this.documentData = res;
    }, err => {
      this.spinner.hide();
      this.alertService.error('Đã xảy ra lỗi, cập nhật dữ liệu lifeform không thành công');
    });
  }
  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  deleteDoc() {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa báo cáo này?',
      () => {
        this.siteSurveyReportService.deleteSiteSurveyingReport(this.bidOpportunityId).subscribe(res => {
          this.alertService.success('Xóa báo cáo công trình thành công!');
          this.spinner.hide();
          this.refresh();
        }, err => this.alertService.error('Xóa báo cáo công trình thất bại!'));
      }
    );
  }
  pagedResultChange(pagedResult: any) {
    this.spinner.show();
    this.siteSurveyReportService
      .changedHistoryTenderSiteReport(this.bidOpportunityId, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(responseResultHistory => {
        this.pagedResult = responseResultHistory;
        this.pageIndex = responseResultHistory.currentPage;
        this.updateInfoList = responseResultHistory.items;
        this.spinner.hide();
      }, err => {
        this.alertService.error('Tải thêm trang thất bại. Xin vui lòng thử lại');
        this.spinner.hide();
      });
  }

  onActivate(check: boolean) {
    LiveformSiteReportComponent.isViewMode = check;
  }
}
