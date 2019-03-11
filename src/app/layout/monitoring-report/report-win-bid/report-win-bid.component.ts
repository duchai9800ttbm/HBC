import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import { ReportWinBid } from '../../../shared/models/report-follow/report-kpi-win-bid.model';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';
import { SettingService } from '../../../shared/services/setting.service';
import { StartAndEndDate } from '../../../shared/models/report-follow/startAndEndDate.model';

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
  isEditNote: boolean;
  listYearConfigured: number[];
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      const yearSub = startAndEndDate.endDate.getFullYear() - startAndEndDate.startDate.getFullYear();
      if (yearSub === 0) {
        this.year = startAndEndDate.endDate.getFullYear();
      } else {
        this.year = null;
      }
      this.checkListYearConfigred(startAndEndDate);
      this.viewReport(startAndEndDate.startDate, startAndEndDate.endDate);
    });
  }

  checkListYearConfigred(startAndEndDate: StartAndEndDate) {
    this.settingService.listYearConfigToWinBid().subscribe(reponseListYear => {
      this.listYearConfigured = (reponseListYear || []).filter(item => item.isConfigured === true).map(i => i.year);
      if (this.year !== null && !this.listYearConfigured.includes(this.year) ) {
        this.isEditNote = false;
      } else {
        this.isEditNote = startAndEndDate.isEditNote;
      }
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
    if (this.year) {
      this.reportFollowService.updateNoteReportWinBid(this.year, this.targetNote, this.note).subscribe(response => {
        this.alertService.success('Cập nhật ghi chú thành công');
      }, err => {
        this.alertService.error('Cập nhật ghi chú không thành công');
      });
    }
  }

}
