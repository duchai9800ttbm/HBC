import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../shared/services/detail-result-package.service';
import { Router } from '../../../../../../../../node_modules/@angular/router';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import Utils from '../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-thanks-letter-cancel',
  templateUrl: './thanks-letter-cancel.component.html',
  styleUrls: ['./thanks-letter-cancel.component.scss']
})
export class ThanksLetterCancelComponent implements OnInit {
  @Input() callBack: Function;
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
  errorMess: string;
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
      if (!((this.uploadResultForm.get('link').value &&
        this.uploadResultForm.get('link').value !== '') || this.file) && this.isSubmitted) {
          this.errorMess = 'Bạn phải nhập đường dẫn link hoặc đính kèm file';
      }
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
      },
        err => {
          this.alertService.error('Upload thư cảm ơn không thành công!');
        });
    }
  }

  fileChange(event) {
    // : FileList
    const fileList = event.target.files;
    if (fileList.length > 0 && Utils.checkTypeFile(fileList)) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.uploadResultForm.get('documentName').patchValue(event.target.files[0].name);
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
    this.uploadResultForm.get('link').enable();
    this.uploadResultForm.get('documentName').patchValue('');
  }

  closePopup() {
    this.callBack();
  }

}
