import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportKpiConstructionType } from '../../../shared/models/report-follow/report-kpi-construction-type.model';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService } from '../../../shared/services';

@Component({
  selector: 'app-report-type-construction',
  templateUrl: './report-type-construction.component.html',
  styleUrls: ['./report-type-construction.component.scss']
})
export class ReportTypeConstructionComponent implements OnInit, OnDestroy {
  reportKpiConstructionType: ReportKpiConstructionType;
  subscription: Subscription;
  loading = false;
  constructor(
    private reportFollowService: ReportFollowService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndDate.subscribe(startAndEndDate => {
      if (startAndEndDate.constructionType) {
        this.viewReport(startAndEndDate.constructionType,
          startAndEndDate.startDate, startAndEndDate.endDate);
      } else {
        this.reportKpiConstructionType = null;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(constructionTypeId: number, startDate: Date, endDate: Date) {
    this.loading = true;
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportKpiConstructionType(constructionTypeId, startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiConstructionType = response;
      this.loading = false;
      console.log('reponse-reponse', response);
    }, err => {
      this.loading = false;
      this.alertService.error('Đã xảy ra lỗi. Vui lòng thử lại');
    });
  }


}
