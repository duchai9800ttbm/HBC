import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { FormBuilder, FormGroup } from '../../../../../../../../node_modules/@angular/forms';
import { DocumentReviewService } from '../../../../../../shared/services/document-review.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';

@Component({
  selector: 'app-upload-review-document',
  templateUrl: './upload-review-document.component.html',
  styleUrls: ['./upload-review-document.component.scss']
})
export class UploadReviewDocumentComponent implements OnInit {
  uploadForm: FormGroup;
  @Output() closed = new EventEmitter<boolean>();
  @Input() packageId;
  datePickerConfig = DATETIME_PICKER_CONFIG;

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private documentReviewService: DocumentReviewService
  ) { }
  file;
  public close() {
    this.closed.emit(false);
  }
  ngOnInit() {
    this.createForm();
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      if (this.file.size < 10485760) {
        this.uploadForm.get('nameFile').patchValue(event.target.files[0].name);
        this.uploadForm.get('editName').patchValue(event.target.files[0].name);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 10MB.');
      }
    }
  }

  createForm() {
    this.uploadForm = this.fb.group({
      nameFile: '',
      editName: '',
      description: '',
      isSuggestedApprove: true,
      date: null
    });
  }

  submitForm() {
    if (this.uploadForm.get('nameFile').value.length > 0) {
      const documentName = this.uploadForm.get('editName').value;
      const description = this.uploadForm.get('description').value;
      const isSuggestedApprove = this.uploadForm.get('isSuggestedApprove').value;
      const date = this.uploadForm.get('date').value;
      this.documentReviewService.upload(this.packageId, documentName, description, isSuggestedApprove, date, this.file).subscribe(data => {
        this.closed.emit(true);
      });
    }
  }

}
