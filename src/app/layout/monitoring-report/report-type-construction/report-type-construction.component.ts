import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportKpiConstructionType } from '../../../shared/models/report-follow/report-kpi-construction-type.model';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-type-construction',
  templateUrl: './report-type-construction.component.html',
  styleUrls: ['./report-type-construction.component.scss']
})
export class ReportTypeConstructionComponent implements OnInit, OnDestroy {
  reportKpiConstructionType: ReportKpiConstructionType;
  subscription: Subscription;
  constructionTypeName: string = null;
  loading = false;
  year: number;
  constructionTypeId: number;
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
      if (startAndEndDate.constructionType) {
        this.constructionTypeName = startAndEndDate.constructionTypeName;
        this.constructionTypeId = startAndEndDate.constructionType;
        this.viewReport(startAndEndDate.constructionType,
          startAndEndDate.startDate, startAndEndDate.endDate);
      } else {
        this.reportKpiConstructionType = null;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(constructionTypeId: number, startDate: Date, endDate: Date) {
    this.loading = true;
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportKpiConstructionType(constructionTypeId, startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiConstructionType = response;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  saveNote() {
    if (this.year) {
      this.reportFollowService.updateNoteReportConstructionType(
        this.constructionTypeId, this.year, this.reportKpiConstructionType.targetNote, this.reportKpiConstructionType.note
      ).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }
}
