import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportKpiWinRateQuarter } from '../../../shared/models/report-follow/report-kpi-win-rate-quarter.model';
import { Subscription } from 'rxjs';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-win-rate-quarter',
  templateUrl: './report-win-rate-quarter.component.html',
  styleUrls: ['./report-win-rate-quarter.component.scss']
})
export class ReportWinRateQuarterComponent implements OnInit, OnDestroy {
  reportKpiWinRateQuarter: ReportKpiWinRateQuarter;
  subscription: Subscription;
  loading = false;
  year: number;
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
      this.viewReport(startAndEndDate.startDate, startAndEndDate.endDate);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(startDate: Date, endDate: Date) {
    this.loading = true;
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportWinRateQuarter(startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiWinRateQuarter = response;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  saveNote() {
    console.log('savenote');
    if (this.year) {
      this.reportFollowService.updateNoteReportQuaterOfYear(
        this.year, this.reportKpiWinRateQuarter.reportKPIQuaterOfYearDetails
      ).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }
}
