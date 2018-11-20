import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';
import { PackageService } from '../../../../../../shared/services/package.service';

@Component({
  selector: 'app-upload-result-attend',
  templateUrl: './upload-result-attend.component.html',
  styleUrls: ['./upload-result-attend.component.scss']
})
export class UploadResultAttendComponent implements OnInit {
  @Input() callBack: Function;
  @Input() callBackAndNavigate: Function;
  @Input() typeBid: string;
  @Input() version: number;
  @Input() interviewTimes: number;
  @Input() winOrLost: boolean;
  uploadResultForm: FormGroup;
  file;
  formErrors = {
    documentName: '',
    receivedDate: '',
    interviewTimes: '',
    version: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  currentPackageId: number;
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private detailResultPackageService: DetailResultPackageService,
    private router: Router,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }
  createForm() {
    this.uploadResultForm = this.fb.group({
      documentName: ['', CustomValidator.required],
      version: [this.version, CustomValidator.requiredDate],
      uploadedBy: [],
      receivedDate: [new Date(), CustomValidator.requiredDate],
      interviewTimes: [this.interviewTimes, CustomValidator.requiredDate],
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
        this.alertService.success('Upload kết quả dự thầu thành công!');
        switch (this.typeBid) {
          case 'win': {
            this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-success`]);
            break;
          }
          case 'lose': {
            this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-failed`]);
            break;
          }
        }
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
    if (this.winOrLost) {
      this.packageService.changeStatusPackageValue(this.checkStatusPackage.TrungThau.text);
    } else {
      this.packageService.changeStatusPackageValue(this.checkStatusPackage.TratThau.text);
    }
    this.callBack();
  }

  closePopupAndNegative() {
    this.callBackAndNavigate();
  }
}
