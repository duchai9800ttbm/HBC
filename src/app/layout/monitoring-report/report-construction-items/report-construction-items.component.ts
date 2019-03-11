import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportKpiConstructionCategory } from '../../../shared/models/report-follow/report-kpi-construction-category.model';
import { AlertService } from '../../../shared/services';
import { StartAndEndDate } from '../../../shared/models/report-follow/startAndEndDate.model';
import { SettingService } from '../../../shared/services/setting.service';

@Component({
  selector: 'app-report-construction-items',
  templateUrl: './report-construction-items.component.html',
  styleUrls: ['./report-construction-items.component.scss']
})
export class ReportConstructionItemsComponent implements OnInit, OnDestroy {
  reportKpiConstructionCategory: ReportKpiConstructionCategory;
  subscription: Subscription;
  constructionCategoryName: string = null;
  loading = false;
  constructionCategoryId: number;
  year: number;
  targetNote: string;
  note: string;
  isEditNote: boolean;
  listYearConfigured: number[];
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      const yearSub = startAndEndDate.endDate.getFullYear() - startAndEndDate.startDate.getFullYear();
      if (yearSub === 0) {
        this.year = startAndEndDate.endDate.getFullYear();
      } else {
        this.year = null;
      }
      // this.isEditNote = startAndEndDate.isEditNote;
      this.checkListYearConfigred(startAndEndDate);
      if (startAndEndDate.constructionCategory) {
        this.constructionCategoryName = startAndEndDate.constructionCategoryName;
        this.constructionCategoryId = startAndEndDate.constructionCategory;
        this.viewReport(startAndEndDate.constructionCategory,
          startAndEndDate.startDate, startAndEndDate.endDate);
      } else {
        this.reportKpiConstructionCategory = null;
      }
    });
  }

  checkListYearConfigred(startAndEndDate: StartAndEndDate) {
    this.settingService.listYearConfigToKpiConstructionCategory().subscribe(reponseListYear => {
      this.listYearConfigured = (reponseListYear || []).filter(item => item.isConfigured === true).map(i => i.year);
      if (this.year !== null && !this.listYearConfigured.includes(this.year) ) {
        this.isEditNote = false;
      } else {
        this.isEditNote = startAndEndDate.isEditNote;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(constructionCategory: number, startDate: Date, endDate: Date) {
    this.loading = true;
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportKpiConstructionCategory(constructionCategory, startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiConstructionCategory = response;
      this.targetNote = response.targetNote;
      this.note = response.note;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  saveNote() {
    if (this.year) {
      this.reportFollowService.updateNoteReportConstructionCategory(
        this.constructionCategoryId, this.year, this.targetNote, this.note
      ).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }
}
