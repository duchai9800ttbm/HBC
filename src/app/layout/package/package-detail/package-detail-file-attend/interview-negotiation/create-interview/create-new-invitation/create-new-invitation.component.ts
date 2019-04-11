import { Component, OnInit, Input } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../../../node_modules/@angular/forms';
import { InterviewInvitation } from '../../../../../../../shared/models/interview-invitation/interview-invitation-create.model';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { AlertService } from '../../../../../../../shared/services';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { StatusObservableHsdtService } from '../../../../../../../shared/services/status-observable-hsdt.service';
import CustomValidator from '../../../../../../../shared/helpers/custom-validator.helper';
import Utils from '../../../../../../../shared/helpers/utils.helper';
@Component({
  selector: 'app-create-new-invitation',
  templateUrl: './create-new-invitation.component.html',
  styleUrls: ['./create-new-invitation.component.scss']
})
export class CreateNewInvitationComponent implements OnInit {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  @Input() callBack: Function;
  @Input() interviewInvitation: InterviewInvitation;
  @Input() edit;
  createFormNewInvitation: FormGroup;
  // interviewInvitation = new InterviewInvitation();
  currentPackageId: number;
  file;
  formErrors = {
    approvedDate: '',
    interviewDate: '',
    place: '',
    interviewTimes: ''
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  interviewTimes: number;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private alertService: AlertService,
    private interviewInvitationService: InterviewInvitationService,
    private statusObservableHsdtService: StatusObservableHsdtService,
  ) {
  }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.createForm();
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      if (result.customer) {
        this.interviewInvitation.customer.customerId = result.customer.id;
        this.interviewInvitation.customer.customerName = result.customer.text;
        this.createFormNewInvitation.get('customerName').patchValue(this.interviewInvitation.customer.customerName);
      }
      if (this.edit) {
        this.interviewInvitationService.LoadFileCreateInterview(this.interviewInvitation.id).subscribe(response => {
          this.file = response;
          this.createFormNewInvitation.get('attachedFiles').patchValue(this.file.name);
        });
      }
    });
  }

  createForm() {
    this.createFormNewInvitation = this.fb.group({
      customerName: [this.interviewInvitation.customer && this.interviewInvitation.customer.customerName ?
        this.interviewInvitation.customer.customerName : ''],
      approvedDate: [this.interviewInvitation.approvedDate ?
        DateTimeConvertHelper.fromTimestampToDtObject(this.interviewInvitation.approvedDate * 1000) : new Date(), [Validators.required]],
      interviewDate: [this.interviewInvitation.interviewDate ?
        DateTimeConvertHelper.fromTimestampToDtObject(this.interviewInvitation.interviewDate * 1000) : null
        , [Validators.required]],
      place: [this.interviewInvitation.place, [CustomValidator.required]],
      interviewTimes: [this.interviewInvitation.interviewTimes ? this.interviewInvitation.interviewTimes
        : this.interviewInvitationService.returnMaxInterViewTimes() + 1, [Validators.required]],
      content: [this.interviewInvitation.content],
      attachedFiles: ['']
    });
    this.createFormNewInvitation.valueChanges.subscribe(data =>
      this.onFormValueChanged(data)
    );
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.createFormNewInvitation,
      this.formErrors
    );
    return this.invalidMessages.length === 0;
  }

  fileChange(event) {
    // FileList
    const fileList = event.target.files;
    if (fileList.length > 0 && Utils.checkTypeFile(fileList)) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.createFormNewInvitation.get('attachedFiles').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    } else {
      // tslint:disable-next-line:max-line-length
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx');
    }
  }
  deleteFileUpload(event) {
    this.file = null;
    this.createFormNewInvitation.get('attachedFiles').patchValue(null);
  }

  closePopup() {
    this.callBack();
  }

  onSubmit() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      if (this.edit) {
        this.interviewInvitationService.updateInterviewInvitation(
          this.interviewInvitation.customer && this.interviewInvitation.customer.customerId ?
            this.interviewInvitation.customer.customerId : null,
          this.interviewInvitation.id, this.createFormNewInvitation.value, this.file).subscribe(response => {
            this.statusObservableHsdtService.change();
            this.interviewInvitationService.changeInterviewInvitationList();
            this.closePopup();
            this.alertService.success('Lời mời đã được cập nhật!');
          },
            err => {
              if (err.json().errorCode === 'BusinessException') {
                this.alertService.error('Giai đoạn gói thầu không hợp lệ!');
              } else {
                this.alertService.error('Cập nhật lời mời thất bại, xin vui lòng thử lại!');
              }
            });
      } else {
        this.interviewInvitationService.createInterviewInvitation(
          this.interviewInvitation.customer && this.interviewInvitation.customer.customerId ?
            this.interviewInvitation.customer.customerId : null,
          this.currentPackageId, this.createFormNewInvitation.value, this.file).subscribe(response => {
            this.statusObservableHsdtService.change();
            this.interviewInvitationService.changeInterviewInvitationList();
            this.closePopup();
            this.alertService.success('Thêm mới lời mời thành công!');
          },
            err => {
              if (err.json().errorCode === 'BusinessException') {
                this.alertService.error('Giai đoạn gói thầu không hợp lệ!');
              } else {
                this.alertService.error('Tạo mới lời mời thất bại, xin vui lòng thử lại!');
              }
            });
      }
    }
  }

}
