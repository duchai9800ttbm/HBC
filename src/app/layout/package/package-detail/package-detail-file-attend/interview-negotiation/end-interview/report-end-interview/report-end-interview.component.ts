import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import { InterviewInvitationReport } from '../../../../../../../shared/models/interview-invitation/interview-invitation-report.model';
import { AlertService } from '../../../../../../../shared/services/alert.service';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
@Component({
  selector: 'app-report-end-interview',
  templateUrl: './report-end-interview.component.html',
  styleUrls: ['./report-end-interview.component.scss']
})
export class ReportEndInterviewComponent implements OnInit {
  @Input() callBack: Function;
  @Input() reloadData: Function;
  createFormReport: FormGroup;
  interviewInvitationReport = new InterviewInvitationReport();
  file: File;
  currentPackageId: number;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private interviewInvitationService: InterviewInvitationService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }

  createForm() {
    this.createFormReport = this.fb.group({
      documentName: [this.interviewInvitationReport.documentName],
      version: [this.interviewInvitationReport.version],
      uploadedBy: [this.interviewInvitationReport.uploadedBy],
      createdDate: [this.interviewInvitationReport.uploadedBy],
      interviewTimes: [this.interviewInvitationReport.interviewTimes],
      documentDesc: [this.interviewInvitationReport.documentDesc],
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

  Upload() {
    console.log('this.createFormReport.value', this.createFormReport.value);
    this.interviewInvitationService.UploadReportInterview(this.currentPackageId, this.createFormReport.value, this.file)
      .subscribe(response => {
        this.closePopup();
        this.reloadData();
        this.alertService.success('Thêm mới lời mời thành công!');
      },
        err => {
          this.alertService.error('Tạo mới lời mời thất bại, xin vui lòng thử lại!');
        });
  }
}
