import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportKpiConstructionCategory } from '../../../shared/models/report-follow/report-kpi-construction-category.model';
import { AlertService } from '../../../shared/services';

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
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      const yearSub = startAndEndDate.endDate.getFullYear() - startAndEndDate.startDate.getFullYear();
      if (yearSub === 0) {
        this.year = startAndEndDate.endDate.getFullYear();
      } else {
        this.year = null;
      }
      this.isEditNote = startAndEndDate.isEditNote;
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
