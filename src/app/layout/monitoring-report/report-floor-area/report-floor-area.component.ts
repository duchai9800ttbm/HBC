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
  year: number;
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      const yearSub = startAndEndDate.endDate.getFullYear() - startAndEndDate.startDate.getFullYear();
      if (yearSub === 0) {
        this.year = startAndEndDate.endDate.getFullYear();
      } else {
        this.year = null;
      }
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
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  saveNote() {
    if (this.year) {
      this.reportFollowService.updateNoteReportFloorArea(
        this.year, this.reportFloorArea
      ).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }

}
