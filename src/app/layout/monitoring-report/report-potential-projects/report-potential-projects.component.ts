import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReportFollowService } from '../../../shared/services/report-follow.service';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { ReportPotentialProjects } from '../../../shared/models/report-follow/report-potential-projects.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-report-potential-projects',
  templateUrl: './report-potential-projects.component.html',
  styleUrls: ['./report-potential-projects.component.scss']
})
export class ReportPotentialProjectsComponent implements OnInit, OnDestroy {

  reportPotentialProjects: ReportPotentialProjects;
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
    // tslint:disable-next-line:max-line-length
    this.reportFollowService.listPotentialProjects(startDateNumber, endDateNumber).subscribe(response => {
      this.reportPotentialProjects = response;
      console.log('reponse-reponse', response);
    });
  }

}
