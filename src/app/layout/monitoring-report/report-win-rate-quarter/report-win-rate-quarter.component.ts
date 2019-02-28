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
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      this.viewReport(startAndEndDate.startDate, startAndEndDate.endDate);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(startDate: Date, endDate: Date) {
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportWinRateQuarter(startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiWinRateQuarter = response;
      console.log('reponse-reponse', response);
    }, err => {
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

}
