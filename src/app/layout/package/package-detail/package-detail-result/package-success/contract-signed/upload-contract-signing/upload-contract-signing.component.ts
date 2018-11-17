import { Component, OnInit, Input } from '@angular/core';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { FormGroup, FormBuilder } from '../../../../../../../../../node_modules/@angular/forms';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';
import { AlertService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-upload-contract-signing',
  templateUrl: './upload-contract-signing.component.html',
  styleUrls: ['./upload-contract-signing.component.scss']
})
export class UploadContractSigningComponent implements OnInit {
  @Input() callBack: Function;
  @Input() version;
  @Input() interviewTimes;
  currentPackageId;
  uploadContractForm: FormGroup;
  invalidMessages: string[];
  formErrors = {
    documentName: '',
    interviewTimes: ''
  };
  isSubmitted = false;
  file;
  constructor(
    private fb: FormBuilder,
    private detailResultPackageService: DetailResultPackageService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
  }

  createForm() {
    this.uploadContractForm = this.fb.group({
      documentName: ['', CustomValidator.required],
      version: [this.version],
      uploadedBy: [],
      receivedDate: [],
      interviewTimes: [this.interviewTimes, CustomValidator.requiredDate],
      documentDesc: [],
      link: [],
    });
    this.uploadContractForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.uploadContractForm, this.formErrors);
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
      ((this.uploadContractForm.get('link').value && this.uploadContractForm.get('link').value !== '') || (this.file))) {
      this.detailResultPackageService.uploadContractSigning(
        this.currentPackageId,
        this.uploadContractForm.value,
        this.file
      ).subscribe(response => {
        this.detailResultPackageService.changeListContractSigning();
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
        this.uploadContractForm.get('documentName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }

  deleteFileUpload() {
    this.file = null;
    this.uploadContractForm.get('link').enable();
    this.uploadContractForm.get('documentName').patchValue('');
  }

  closePopup() {
    this.callBack();
  }

}
