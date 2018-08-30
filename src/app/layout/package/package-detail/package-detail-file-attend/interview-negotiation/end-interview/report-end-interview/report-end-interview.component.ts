import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import { InterviewInvitationReport } from '../../../../../../../shared/models/interview-invitation/interview-invitation-report.model';
import { AlertService } from '../../../../../../../shared/services/alert.service';

@Component({
  selector: 'app-report-end-interview',
  templateUrl: './report-end-interview.component.html',
  styleUrls: ['./report-end-interview.component.scss']
})
export class ReportEndInterviewComponent implements OnInit {
  @Input() callBack: Function;
  createFormReport: FormGroup;
  interviewInvitationReport = new InterviewInvitationReport();
  file: File;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.createFormReport = this.fb.group({
      documentName: [this.interviewInvitationReport.documentName],
      version: [this.interviewInvitationReport.version],
      uploadedBy: [this.interviewInvitationReport.uploadedBy],
      createdDate: [this.interviewInvitationReport.uploadedBy],
      interviewTimes: [this.interviewInvitationReport.interviewTimes],
    });
  }

  closePopup() {
    this.callBack();
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.createFormReport.get('documentName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }
}
