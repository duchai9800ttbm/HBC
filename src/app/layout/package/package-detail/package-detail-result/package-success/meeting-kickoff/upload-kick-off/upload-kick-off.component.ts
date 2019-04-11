import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import Utils from '../../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-upload-kick-off',
  templateUrl: './upload-kick-off.component.html',
  styleUrls: ['./upload-kick-off.component.scss']
})
export class UploadKickOffComponent implements OnInit {

  @Input() callBack: Function;
  @Input() addAndReload: Function;
  @Input() action: string;
  @Input() version: string;
  @Input() interviewTimes: string;
  uploadMeetingKickOff: FormGroup;
  file;
  formErrors = {
    documentName: '',
    version: '',
    interviewTimes: '',
    meetingTime: '',
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  currentPackageId: number;
  errorMess: string;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private detailResultPackageService: DetailResultPackageService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }
  createForm() {
    this.uploadMeetingKickOff = this.fb.group({
      documentName: ['', CustomValidator.required],
      version: [(this.version).toString(), CustomValidator.required],
      uploadedBy: [],
      receivedDate: [],
      meetingTime: [, (this.action === 'report') ? CustomValidator.requiredDate : null],
      interviewTimes: [this.interviewTimes.toString(), CustomValidator.required],
      documentDesc: [],
      link: [],
    });
    this.uploadMeetingKickOff.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.uploadMeetingKickOff, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
      if (!((this.uploadMeetingKickOff.get('link').value &&
        this.uploadMeetingKickOff.get('link').value !== '') || this.file) && this.isSubmitted) {
          this.errorMess = 'Bạn phải nhập đường dẫn link hoặc đính kèm file';
      }
    }
  }

  Upload() {
    this.isSubmitted = true;
    if (this.validateForm() &&
      ((this.uploadMeetingKickOff.get('link').value && this.uploadMeetingKickOff.get('link').value !== '') || (this.file))) {
      switch (this.action) {
        case 'report': {
          this.detailResultPackageService.uploadReportMeeting(
            this.currentPackageId,
            this.uploadMeetingKickOff.value,
            this.file
          ).subscribe(response => {
            this.closePopup();
            this.detailResultPackageService.changeListReportMeeting();
            this.alertService.success('Upload biên bản cuộc họp thành công!');
          },
            err => {
              this.alertService.error('Upload biên bản cuộc họp không thành công!');
            });
          break;
        }
        case 'file': {
          this.detailResultPackageService.uploadFilePresentationMeeting(
            this.currentPackageId,
            this.uploadMeetingKickOff.value,
            this.file
          ).subscribe(response => {
            this.closePopup();
            this.detailResultPackageService.changeListFilePresentationMeeting();
            this.alertService.success('Upload file presentation thành công!');
          },
            err => {
              this.alertService.error('Upload file presentation không thành công!');
            });
          break;
        }
      }

    }
  }

  fileChange(event) {
    // : FileList
    const fileList = event.target.files;
    if (fileList.length > 0 && Utils.checkTypeFile(fileList)) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.uploadMeetingKickOff.get('documentName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    } else {
      // tslint:disable-next-line:max-line-length
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx';
    }
  }

  deleteFileUpload() {
    this.file = null;
    this.uploadMeetingKickOff.get('link').enable();
    this.uploadMeetingKickOff.get('documentName').patchValue('');
  }

  closePopupAndReload() {
    this.addAndReload();
  }

  closePopup() {
    this.callBack();
  }
}
