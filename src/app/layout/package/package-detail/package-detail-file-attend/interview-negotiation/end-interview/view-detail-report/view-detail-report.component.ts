import { Component, OnInit, Input } from '@angular/core';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
import { AlertService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-view-detail-report',
  templateUrl: './view-detail-report.component.html',
  styleUrls: ['./view-detail-report.component.scss']
})
export class ViewDetailReportComponent implements OnInit {
  @Input() callBack: Function;
  @Input() data;
  constructor(
    private interviewInvitationService: InterviewInvitationService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
  }

  closePopup() {
    this.callBack();
  }

  dowloadDocument(bidInterviewReportDocId: number) {
    this.interviewInvitationService.downloadReport(bidInterviewReportDocId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải về biên bản phỏng vấn không thành công!');
      });
  }
}
