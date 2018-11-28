import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';

@Component({
  selector: 'app-thanks-letter',
  templateUrl: './thanks-letter.component.html',
  styleUrls: ['./thanks-letter.component.scss']
})
export class ThanksLetterComponent implements OnInit {
  @Input() callBack: Function;
  @Input() callBackAndNavigate: Function;
  uploadResultForm: FormGroup;
  file;
  formErrors = {
    documentName: '',
    version: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  currentPackageId: number;
  // checkStatusPackage = CheckStatusPackage;
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
      // this.version,
      version: [, CustomValidator.requiredDate],
      uploadedBy: [],
      // this.interviewTimes
      interviewTimes: [, CustomValidator.requiredDate],
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
      this.detailResultPackageService.uploadThanksLetter(
        this.currentPackageId,
        this.uploadResultForm.value,
        this.file
      ).subscribe(response => {
        this.closePopup();
        this.detailResultPackageService.changeListThanksLetter();
        this.alertService.success('Upload thư cảm ơn thành công!');
        this.router.navigate([`/package/detail/${this.currentPackageId}/result/package-cancel`]);
      },
        err => {
          this.alertService.error('Upload thư cảm ơn không thành công!');
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

  closePopupAndNegative() {
    this.callBackAndNavigate();
  }
}
