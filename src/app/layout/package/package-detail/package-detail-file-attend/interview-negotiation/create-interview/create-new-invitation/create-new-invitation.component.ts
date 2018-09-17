import { Component, OnInit, Input } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../../../node_modules/@angular/forms';
import { InterviewInvitation } from '../../../../../../../shared/models/interview-invitation/interview-invitation-create.model';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { AlertService } from '../../../../../../../shared/services';
import { InterviewInvitationService } from '../../../../../../../shared/services/interview-invitation.service';
import { CustomerModel } from '../../../../../../../shared/models/interview-invitation/customer.model';
@Component({
  selector: 'app-create-new-invitation',
  templateUrl: './create-new-invitation.component.html',
  styleUrls: ['./create-new-invitation.component.scss']
})
export class CreateNewInvitationComponent implements OnInit {
  datePickerConfig = DATETIME_PICKER_CONFIG;
  @Input() callBack: Function;
  @Input() interviewInvitation: InterviewInvitation;
  createFormNewInvitation: FormGroup;
  // interviewInvitation = new InterviewInvitation();
  currentPackageId: number;
  file;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private alertService: AlertService,
    private interviewInvitationService: InterviewInvitationService,
  ) {
  }

  ngOnInit() {
    // this.interviewInvitation.customer = new CustomerModel();
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      if (result.customer) {
        this.interviewInvitation.customer.customerId = result.customer.id;
        this.interviewInvitation.customer.customerName = result.customer.text;
      }
      this.createForm();
    });
  }

  createForm() {
    this.createFormNewInvitation = this.fb.group({
      customerName: [this.interviewInvitation.customer && this.interviewInvitation.customer.customerName ?
        this.interviewInvitation.customer.customerName : ''],
      approvedDate: [this.interviewInvitation.approvedDate],
      interviewDate: [this.interviewInvitation.interviewDate],
      place: [this.interviewInvitation.place],
      interviewTimes: [this.interviewInvitation.interviewTimes],
      content: [this.interviewInvitation.content],
      attachedFiles: ['']
    });
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.createFormNewInvitation.get('attachedFiles').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }

  closePopup() {
    this.callBack();
  }

  onSubmit() {
    console.log('this.interviewInvitation.customer', this.interviewInvitation.customer, this.interviewInvitation.customer.customerId);
    this.interviewInvitationService.createInterviewInvitation(
      this.interviewInvitation.customer.customerId,
      this.currentPackageId, this.createFormNewInvitation.value, this.file).subscribe(response => {
        this.closePopup();
        this.alertService.success('Thêm mới lời mời thành công!');
      },
        err => {
          this.alertService.error('Tạo mới lời mời thất bại, xin vui lòng thử lại!');
        });
  }

}
