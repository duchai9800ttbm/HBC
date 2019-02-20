import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportWinBid } from '../../../shared/models/report-follow/report-kpi-win-bid.model';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-report-win-bid',
  templateUrl: './report-win-bid.component.html',
  styleUrls: ['./report-win-bid.component.scss']
})
export class ReportWinBidComponent implements OnInit, OnDestroy {
  reportWinBid: ReportWinBid;
  subscription: Subscription;
  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
    console.log('this.report-win-bid');
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
    this.reportFollowService.detailReportWinBid(startDateNumber, endDateNumber).subscribe(response => {
      this.reportWinBid = response;
    });
  }


}
