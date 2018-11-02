import { Component, OnInit, OnDestroy } from '@angular/core';
import { SiteSurveyReport } from '../../../../../../shared/models/site-survey-report/site-survey-report';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PagedResult } from '../../../../../../shared/models';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { Subject } from 'rxjs/Subject';
import { SiteSurveyReportService } from '../../../../../../shared/services/site-survey-report.service';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
import { ScaleOverall, ConstructionItem } from '../../../../../../shared/models/site-survey-report/scale-overall.model';
import { HistoryLiveForm } from '../../../../../../shared/models/ho-so-du-thau/history-liveform.model';
import { groupBy } from '@progress/kendo-data-query';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { FormInComponent } from '../../../../../../shared/components/form-in/form-in.component';
import { Subscription } from 'rxjs';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';

@Component({
  selector: 'app-liveform-site-report',
  templateUrl: './liveform-site-report.component.html',
  styleUrls: ['./liveform-site-report.component.scss']
})
export class LiveformSiteReportComponent implements OnInit, OnDestroy {
  static formModel: SiteSurveyReport = new SiteSurveyReport();
  static actionMode: string;
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  isData;
  documentData = new SiteSurveyReport();
  updateInfoList;
  pageIndex: number | string = 0;
  pagedResultChangeHistoryList: PagedResult<HistoryLiveForm> = new PagedResult<HistoryLiveForm>();
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  dtTrigger2: Subject<any> = new Subject();
  dialog;
  indexItemHistoryChange: number;
  isClosedHSDT: boolean;
  subscription: Subscription;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.subscription = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isClosedHSDT = status;
    });
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
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = ress;
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
    this.getChangeHistory(0, 10);
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
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
          LiveformSiteReportComponent.formModel.scaleOverall.loaiCongTrinh = ress;
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
  pagedResultChangeHistory(e) {
    this.getChangeHistory(this.pagedResultChangeHistoryList.currentPage, this.pagedResultChangeHistoryList.pageSize);
  }
  getChangeHistory(page: number | string, pageSize: number | string) {
    this.spinner.show();
    this.siteSurveyReportService.changedHistoryTenderSiteReport(this.bidOpportunityId, page, pageSize).subscribe(respone => {
      this.updateInfoList = respone.items;
      this.pagedResultChangeHistoryList = respone;
      this.indexItemHistoryChange = +respone.total - +respone.pageSize * +respone.currentPage;
      this.updateInfoList = groupBy(this.pagedResultChangeHistoryList.items, [{ field: 'changedTime' }]);
      this.updateInfoList.forEach((itemList, indexList) => {
        itemList.items.forEach((itemByChangedTimes, indexChangedTimes) => {
          this.updateInfoList[indexList].items[indexChangedTimes].liveFormChangeds =
            groupBy(itemByChangedTimes.liveFormChangeds, [{ field: 'liveFormStep' }]);
        });
      });
      setTimeout(() => {
        this.dtTrigger2.next();
      });
      this.spinner.hide();
    },
      err => {
        this.spinner.hide();
      });
  }

  onActivate(actionMode: string) {
    LiveformSiteReportComponent.actionMode = actionMode;
  }

  print() {
    this.dialog = this.dialogService.open({
      title: 'FORM IN',
      content: FormInComponent,
      width: window.screen.availWidth * 0.8,
      minWidth: 250,
      height: window.screen.availHeight * 0.7
    });
    const instance = this.dialog.content.instance;
    instance.type = 'LiveFormThamQuanBaoCaoCongTruong';
    instance.packageId = this.bidOpportunityId;
  }
}
