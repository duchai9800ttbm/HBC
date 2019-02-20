import { Component, OnInit } from '@angular/core';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportKpiChair } from '../../../shared/models/report-follow/report-kpi-chair.model';

@Component({
  selector: 'app-report-kpi-chair',
  templateUrl: './report-kpi-chair.component.html',
  styleUrls: ['./report-kpi-chair.component.scss']
})
export class ReportKpiChairComponent implements OnInit {
  reportKpiChair: ReportKpiChair;
  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
    console.log('this.report-kpi-chair');
    this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      this.viewReport(startAndEndDate.startDate, startAndEndDate.endDate);
    });
  }

  viewReport(startDate: Date, endDate: Date) {
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    this.reportFollowService.detailReportKpiChair(startDateNumber, endDateNumber).subscribe(response => {
      console.log('this.endDateNumber', response);
      this.reportKpiChair = response;
    });
  }

}
