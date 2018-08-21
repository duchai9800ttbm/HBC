import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivityService } from '../../../../../../shared/services/activity.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { DocumentReviewService } from '../../../../../../shared/services/document-review.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.scss']
})
export class UploadFileComponent implements OnInit {
  uploadForm: FormGroup;
  @Output() closed = new EventEmitter<boolean>();
  @Input() typeFile;
  @Input() packageId;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  public listItems: Array<string> = ["Item 1", "Item 2", "Item 3"];

  listTypeFile = [
    {
      id: 'Drawing',
      text: 'Bản vẽ',
    },
    {
      id: 'Book',
      text: 'Cuốn hồ sơ mời thầu',
    },
    {
      id: 'TechnicalStandard',
      text: 'Tiêu chuẩn kỹ thuật',
    },
    {
      id: 'BOQ',
      text: 'BOQ',
    },
    {
      id: 'GeologicalSurvey',
      text: 'Khảo sát địa chất',
    },
  ];
  file;
  public close() {
    this.closed.emit(false);
  }
  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private documentService: DocumentService
  ) { }
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
      type: this.typeFile.id,
      editName: '',
      description: ''
    });
  }

  submitForm() {
    if (this.uploadForm.get('nameFile').value.length > 0) {
      const documentName = this.uploadForm.get('editName').value;
      const documentType = this.uploadForm.get('type').value;
      const description = this.uploadForm.get('description').value;
      this.documentService.upload(this.packageId, documentName, documentType, description, this.file).subscribe(data => {
        this.closed.emit(true);
      });
    }
  }

}
