import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportFloorArea } from '../../../shared/models/report-follow/report-floor-area.model';
import { Subscription } from 'rxjs';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-report-floor-area',
  templateUrl: './report-floor-area.component.html',
  styleUrls: ['./report-floor-area.component.scss']
})
export class ReportFloorAreaComponent implements OnInit, OnDestroy {
  reportFloorArea: ReportFloorArea;
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
    this.reportFollowService.detailReportFloorArea(startDateNumber, endDateNumber).subscribe(response => {
      this.reportFloorArea = response;
      console.log('reponse-reponse', response);
    });
  }

}
