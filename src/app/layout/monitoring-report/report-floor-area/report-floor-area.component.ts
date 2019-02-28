import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportFloorArea } from '../../../shared/models/report-follow/report-floor-area.model';
import { Subscription } from 'rxjs';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-floor-area',
  templateUrl: './report-floor-area.component.html',
  styleUrls: ['./report-floor-area.component.scss']
})
export class ReportFloorAreaComponent implements OnInit, OnDestroy {
  reportFloorArea: ReportFloorArea;
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
    this.reportFollowService.detailReportFloorArea(startDateNumber, endDateNumber).subscribe(response => {
      this.reportFloorArea = response;
      console.log('reponse-reponse', response);
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

}
