import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import { AlertService } from '../../../../../../../shared/services';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';

@Component({
  selector: 'app-upload-result-file-attend',
  templateUrl: './upload-result-file-attend.component.html',
  styleUrls: ['./upload-result-file-attend.component.scss']
})
export class UploadResultFileAttendComponent implements OnInit {
  @Input() callBack: Function;
  @Input() version: number;
  @Input() interviewTimes: number;
  uploadResultForm: FormGroup;
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
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }
  createForm() {
    this.uploadResultForm = this.fb.group({
      documentName: ['', CustomValidator.required],
      version: [this.version],
      uploadedBy: [],
      receivedDate: [new Date()],
      interviewTimes: [this.interviewTimes],
      documentDesc: [],
      link: [],
    });
    this.uploadResultForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.uploadResultForm, this.formErrors);
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
      ((this.uploadResultForm.get('link').value && this.uploadResultForm.get('link').value !== '') || (this.file))) {
      this.detailResultPackageService.uploadFileResult(
        this.currentPackageId,
        this.uploadResultForm.value,
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
        this.uploadResultForm.get('documentName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }

  deleteFileUpload() {
    this.file = null;
    this.uploadResultForm.get('link').enable();
    this.uploadResultForm.get('documentName').patchValue('');
  }

  closePopup() {
    this.callBack();
  }
}
