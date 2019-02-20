import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportKpiConstructionCategory } from '../../../shared/models/report-follow/report-kpi-construction-category.model';

@Component({
  selector: 'app-report-construction-items',
  templateUrl: './report-construction-items.component.html',
  styleUrls: ['./report-construction-items.component.scss']
})
export class ReportConstructionItemsComponent implements OnInit, OnDestroy {
  reportKpiConstructionCategory: ReportKpiConstructionCategory;
  subscription: Subscription;
  constructor(
    private reportFollowService: ReportFollowService
  ) { }

  ngOnInit() {
    this.subscription = this.reportFollowService.startAndEndConstructionCategory.subscribe(startAndEndConstructionCategory => {
      if (startAndEndConstructionCategory.constructionCategory) {
        this.viewReport(startAndEndConstructionCategory.constructionCategory,
            startAndEndConstructionCategory.startDate, startAndEndConstructionCategory.endDate);
      } else {
        this.reportKpiConstructionCategory = null;
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewReport(constructionCategory: number, startDate: Date, endDate: Date) {
    const startDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(startDate);
    const endDateNumber = DateTimeConvertHelper.fromDtObjectToTimestamp(endDate);
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.detailReportKpiConstructionCategory(constructionCategory, startDateNumber, endDateNumber).subscribe(response => {
      this.reportKpiConstructionCategory = response;
      console.log('reponse-reponse', response);
    });
  }

}
