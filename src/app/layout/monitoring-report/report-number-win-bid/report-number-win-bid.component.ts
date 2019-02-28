import { Component, OnInit, OnDestroy } from '@angular/core';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportNumberWinBid } from '../../../shared/models/report-follow/report-number-win-bid.model';
import { Subscription } from 'rxjs';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-number-win-bid',
  templateUrl: './report-number-win-bid.component.html',
  styleUrls: ['./report-number-win-bid.component.scss']
})
export class ReportNumberWinBidComponent implements OnInit, OnDestroy {

  reportNumberWinBid: ReportNumberWinBid;
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
    this.reportFollowService.listNumberWinningOfBid(startDateNumber, endDateNumber).subscribe(response => {
      this.reportNumberWinBid = response;
      console.log('reponse-reponse', response);
    }, err => {
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }
}
