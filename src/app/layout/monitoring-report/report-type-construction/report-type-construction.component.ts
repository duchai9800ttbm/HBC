import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportKpiConstructionType } from '../../../shared/models/report-follow/report-kpi-construction-type.model';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';

@Component({
  selector: 'app-report-type-construction',
  templateUrl: './report-type-construction.component.html',
  styleUrls: ['./report-type-construction.component.scss']
})
export class ReportTypeConstructionComponent implements OnInit, OnDestroy {
  reportKpiConstructionType: ReportKpiConstructionType;
  subscription: Subscription;
  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndConstructionType.subscribe(startAndEndConstructionType => {
      if (startAndEndConstructionType.constructionType) {
        this.viewReport(startAndEndConstructionType.constructionType,
          startAndEndConstructionType.startDate, startAndEndConstructionType.endDate);
      } else {
        this.reportKpiConstructionType = null;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(constructionTypeId: number, startDate: Date, endDate: Date) {
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportKpiConstructionType(constructionTypeId, startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiConstructionType = response;
      console.log('reponse-reponse', response);
    });
  }


}
