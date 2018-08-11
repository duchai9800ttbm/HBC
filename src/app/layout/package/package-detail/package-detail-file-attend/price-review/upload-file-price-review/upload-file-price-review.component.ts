import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';
import { AlertService } from '../../../../../../shared/services';
import { DocumentReviewService } from '../../../../../../shared/services/document-review.service';

@Component({
  selector: 'app-upload-file-price-review',
  templateUrl: './upload-file-price-review.component.html',
  styleUrls: ['./upload-file-price-review.component.scss']
})
export class UploadFilePriceReviewComponent implements OnInit {

  uploadForm: FormGroup;
  @Output() closed = new EventEmitter<boolean>();
  @Input() packageId;

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
      description: ''
    });
  }

  submitForm() {
    if (this.uploadForm.get('nameFile').value.length > 0) {
      const documentName = this.uploadForm.get('editName').value;
      const description = this.uploadForm.get('description').value;
    //   this.documentReviewService.upload(this.packageId, documentName, description, this.file).subscribe(data => {
    //     this.closed.emit(true);
    //   });
    }
  }

}
