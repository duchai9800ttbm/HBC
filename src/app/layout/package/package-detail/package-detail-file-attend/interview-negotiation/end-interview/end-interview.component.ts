import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { ReportEndInterviewComponent } from './report-end-interview/report-end-interview.component';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { InterviewInvitationFilterReport } from '../../../../../../shared/models/interview-invitation/interview-invitation-filter-report';
import { PagedResult } from '../../../../../../shared/models';
import { Subject } from '../../../../../../../../node_modules/rxjs';
@Component({
  selector: 'app-end-interview',
  templateUrl: './end-interview.component.html',
  styleUrls: ['./end-interview.component.scss']
})
export class EndInterviewComponent implements OnInit {
  dialog;
  currentPackageId: number;
  searchTerm$;
  filterModel = new InterviewInvitationFilterReport();
  pagedResult: PagedResult<InterviewInvitationFilterReport> = new PagedResult<InterviewInvitationFilterReport>();
  dtTrigger: Subject<any> = new Subject();
  constructor(
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private interviewInvitationService: InterviewInvitationService,
  ) { }

  ngOnInit() {
    this.filterModel.interviewtimes = 0;
    this.filterModel.uploadedEmployeeId = 0;
    this.filterModel.createdDate = 0;
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.interviewInvitationService.instantSearchWithFilterReport(
      this.currentPackageId, this.searchTerm$, this.filterModel, 0, 1000).subscribe(result => {
        this.render(result);
        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
        });
  }

  render(pagedResult: any) {
    // pagedResult.items.forEach(element => {
    //   if (element.remainningDay < 0) {
    //     element['expiredDate'] = Math.abs(element.remainningDay);
    //   }
    // });
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  uploadReportInterview() {
    this.dialog = this.dialogService.open({
      content: ReportEndInterviewComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialog.close();
  }

}
