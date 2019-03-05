import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportWinBid } from '../../../shared/models/report-follow/report-kpi-win-bid.model';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-win-bid',
  templateUrl: './report-win-bid.component.html',
  styleUrls: ['./report-win-bid.component.scss']
})
export class ReportWinBidComponent implements OnInit, OnDestroy {
  reportWinBid: ReportWinBid;
  subscription: Subscription;
  loading = false;
  year: number;
  targetNote: string;
  note: string;
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
    this.reportFollowService.detailReportWinBid(startDateNumber, endDateNumber).subscribe(response => {
      this.reportWinBid = response;
      this.targetNote = response.targetNote;
      this.note = response.note;
      this.loading = false;
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }

  saveNote() {
    console.log('this.year', this.year);
    if (this.year) {
      this.reportFollowService.updateNoteReportWinBid(this.year, this.targetNote, this.note).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }

}
