import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-upload-kick-off',
  templateUrl: './upload-kick-off.component.html',
  styleUrls: ['./upload-kick-off.component.scss']
})
export class UploadKickOffComponent implements OnInit {

  @Input() callBack: Function;
  @Input() action: string;
  uploadMeetingKickOff: FormGroup;
  file;
  formErrors = {
    documentName: '',
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  currentPackageId: number;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private detailResultPackageService: DetailResultPackageService,
  ) { }

  ngOnInit() {
    console.log('action', this.action);
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }
  createForm() {
    this.uploadMeetingKickOff = this.fb.group({
      documentName: ['', CustomValidator.required],
      version: [],
      uploadedBy: [],
      receivedDate: [],
      interviewTimes: [],
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
    }
  }

  Upload() {
    this.isSubmitted = true;
    if (this.validateForm() &&
      ((this.uploadMeetingKickOff.get('link').value && this.uploadMeetingKickOff.get('link').value !== '') || (this.file))) {
      this.detailResultPackageService.uploadFileResult(
        this.currentPackageId,
        this.uploadMeetingKickOff.value,
        this.file
      ).subscribe(response => {
        this.closePopup();
        this.detailResultPackageService.changeListFileResult();
        this.alertService.success('Upload kết quả dự thầu thành công!');
      },
        err => {
          this.alertService.error('Upload kết quả dự thầu không thành công!');
        });
    }
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.uploadMeetingKickOff.get('documentName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }

  deleteFileUpload() {
    this.file = null;
    this.uploadMeetingKickOff.get('link').enable();
    this.uploadMeetingKickOff.get('documentName').patchValue('');
  }

  closePopup() {
    this.callBack();
  }
}
