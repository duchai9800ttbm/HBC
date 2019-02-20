import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { Subscription } from 'rxjs';
import { ReportWinRateConstractors } from '../../../shared/models/report-follow/report-win-rate-constractors.model';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-report-win-rate-contractors',
  templateUrl: './report-win-rate-contractors.component.html',
  styleUrls: ['./report-win-rate-contractors.component.scss']
})
export class ReportWinRateContractorsComponent implements OnInit, OnDestroy {
  reportWinRateConstractors: ReportWinRateConstractors;
  subscription: Subscription;
  constructor(
    private reportFollowService: ReportFollowService
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
    this.reportFollowService.detailReportWinRateContractors(startDateNumber, endDateNumber).subscribe(response => {
      this.reportWinRateConstractors = response;
      console.log('reponse-reponse', response);
    });
  }
}
