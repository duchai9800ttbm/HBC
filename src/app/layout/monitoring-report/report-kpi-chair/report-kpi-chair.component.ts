import { Component, OnInit, OnDestroy } from '@angular/core';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportKpiChair } from '../../../shared/models/report-follow/report-kpi-chair.model';
import { Subscription } from 'rxjs';
import { StartAndEndDate } from '../../../shared/models/report-follow/startAndEndDate.model';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-kpi-chair',
  templateUrl: './report-kpi-chair.component.html',
  styleUrls: ['./report-kpi-chair.component.scss']
})
export class ReportKpiChairComponent implements OnInit, OnDestroy {
  reportKpiChair: ReportKpiChair;
  subscription: Subscription;
  startAndEndDate: StartAndEndDate;
  loading = false;
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      this.startAndEndDate = startAndEndDate;
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
    this.reportFollowService.detailReportKpiChair(startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiChair = response;
      if (this.reportKpiChair && this.reportKpiChair.winningBidOfDayCompareTargetAmount) {
        this.reportKpiChair['winningBidOfDayCompareTargetAmountAbs'] = Math.abs(this.reportKpiChair.winningBidOfDayCompareTargetAmount);
      }
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  autoExpand() {
  }
}
