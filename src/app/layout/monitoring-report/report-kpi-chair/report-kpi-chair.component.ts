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
  startDate: Date;
  endDate: Date;
  reportKpiChair: ReportKpiChair;
  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
    const date = new Date();
    this.startDate = new Date(date.getFullYear(), 0, 1);
    this.endDate = date;
    this.viewReport();
  }

  viewReport() {
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate);
    this.reportFollowService.detailReportKpiChair(startDateNumber, endDateNumber).subscribe(response => {
      console.log('this.endDateNumber', response);
      this.reportKpiChair = response;
    });
  }

}
