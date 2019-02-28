import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { Subscription } from 'rxjs';
import { ReportWinRateConstractors } from '../../../shared/models/report-follow/report-win-rate-constractors.model';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-win-rate-contractors',
  templateUrl: './report-win-rate-contractors.component.html',
  styleUrls: ['./report-win-rate-contractors.component.scss']
})
export class ReportWinRateContractorsComponent implements OnInit, OnDestroy {
  reportWinRateConstractors: ReportWinRateConstractors;
  subscription: Subscription;
  loading = false;
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
    this.loading = true;
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportWinRateContractors(startDateNumber, endDateNumber).subscribe(response => {
      this.reportWinRateConstractors = response;
      console.log('reponse-reponse', response);
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }
}
