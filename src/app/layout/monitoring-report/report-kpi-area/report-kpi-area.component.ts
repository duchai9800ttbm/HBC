import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportKpiArea } from '../../../shared/models/report-follow/report-kpi-area.model';

@Component({
  selector: 'app-report-kpi-area',
  templateUrl: './report-kpi-area.component.html',
  styleUrls: ['./report-kpi-area.component.scss']
})
export class ReportKpiAreaComponent implements OnInit, OnDestroy {
  reportKpiArea: ReportKpiArea;
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
    this.reportFollowService.detailReportKpiAre(startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiArea = response;
      console.log('reponse-reponse', response);
    });
  }

}
