import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import { InterviewInvitationReport } from '../../../../../../../shared/models/interview-invitation/interview-invitation-report.model';
import { AlertService } from '../../../../../../../shared/services/alert.service';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import { StatusObservableHsdtService } from '../../../../../../../shared/services/status-observable-hsdt.service';
import Utils from '../../../../../../../shared/helpers/utils.helper';
@Component({
  selector: 'app-report-end-interview',
  templateUrl: './report-end-interview.component.html',
  styleUrls: ['./report-end-interview.component.scss']
})
export class ReportEndInterviewComponent implements OnInit {
  @Input() callBack: Function;
  @Input() reloadData: Function;
  @Input() interviewOfPackage;
  @Input() versionOfPackage;
  createFormReport: FormGroup;
  interviewInvitationReport = new InterviewInvitationReport();
  file: File;
  currentPackageId: number;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    documentName: '',
    interviewTimes: '',
    version: ''
  };
  errorMess: string;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private interviewInvitationService: InterviewInvitationService,
    private statusObservableHsdtService: StatusObservableHsdtService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }

  createForm() {
    this.createFormReport = this.fb.group({
      documentName: [this.interviewInvitationReport.documentName, CustomValidator.required],
      version: [this.versionOfPackage, CustomValidator.requiredDate],
      uploadedBy: [this.interviewInvitationReport.uploadedBy],
      createdDate: [this.interviewInvitationReport.uploadedBy],
      interviewTimes: [this.interviewOfPackage, CustomValidator.required],
      // this.interviewInvitationReport.interviewTimes
      documentDesc: [this.interviewInvitationReport.documentDesc],
      link: [],
    });
    this.createFormReport.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.createFormReport, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
      if (!((this.createFormReport.get('link').value
        && this.createFormReport.get('link').value !== '') || this.file) && this.isSubmitted) {
          this.errorMess = 'Vui lòng chọn file hoặc đường dẫn link đến file!';
      }
    }
  }

  closePopup() {
    this.callBack();
  }

  fileChange(event) {
    // : FileList
    const fileList = event.target.files;
    if (fileList.length > 0 && Utils.checkTypeFile(fileList)) {
      this.errorMess = null;
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        if (this.createFormReport.get('documentName').value === null || this.createFormReport.get('documentName').value === '') {
          this.createFormReport.get('documentName').patchValue(event.target.files[0].name);
        }
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    } else {
      // tslint:disable-next-line:max-line-length
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx';
    }
  }

  Upload() {
    this.isSubmitted = true;
    if (this.validateForm() &&
      ((this.createFormReport.get('link').value && this.createFormReport.get('link').value !== '') || (this.file))) {
      this.interviewInvitationService.UploadReportInterview(this.currentPackageId, this.createFormReport.value, this.file)
        .subscribe(response => {
          this.closePopup();
          this.statusObservableHsdtService.change();
          this.interviewInvitationService.changeEndInterviewList();
          this.alertService.success('Thêm mới lời mời thành công!');
          this.loadData();
        },
          err => {
            this.alertService.error('Tạo mới lời mời thất bại, xin vui lòng thử lại!');
          });
    }
  }

  loadData() {
    this.reloadData();
  }

  deleteFileUpload() {
    this.file = null;
    this.createFormReport.get('link').enable();
    this.createFormReport.get('documentName').patchValue('');
  }
}
