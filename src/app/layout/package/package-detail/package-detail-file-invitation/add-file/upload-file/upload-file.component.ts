import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivityService } from '../../../../../../shared/services/activity.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { FormGroup, FormBuilder } from '../../../../../../../../node_modules/@angular/forms';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { DocumentReviewService } from '../../../../../../shared/services/document-review.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FileInfo, SelectEvent } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../../../../../shared/models';
import { NgxSpinnerService } from 'ngx-spinner';

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
  @Input() majorTypeId;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  public listItems: Array<string> = ['Item 1', 'Item 2', 'Item 3'];

  listTypeFile: DictionaryItem[];
  file;
  icon = `<i class="fa fa-search" aria-hidden="true"></i>`;
  public events: string[] = [];
  public source: Array<string> = ['Albania', 'Andorra', 'Armenia', 'Austria', 'Azerbaijan'];
  public data: Array<string>;
  myFiles: Array<FileInfo> = [];

  public close() {
    this.closed.emit(false);
  }

  constructor(
    private alertService: AlertService,
    private fb: FormBuilder,
    private documentService: DocumentService,
    private spinner: NgxSpinnerService,
  ) {
    this.data = this.source.slice();

  }

  ngOnInit() {
    this.createForm();
    this.documentService.bidDocumentMajorTypeByParent(this.majorTypeId).subscribe(data => this.listTypeFile = data);
  }
  selectEventHandler(e: SelectEvent) {
    e.files.forEach((file) => this.myFiles.push(file));
  }
  public valueChange(value: any): void {
  }

  public selectionChange(value: any): void {
  }

  public filterChange(filter: any): void {
    this.data = this.source.filter((s) => s.toLowerCase().indexOf(filter.toLowerCase()) !== -1);
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
      type: null,
      editName: '',
      date: null,
      description: ''
    });
  }

  submitForm() {
    if (this.uploadForm.get('nameFile').value.length > 0) {
      this.spinner.show();
      const documentName = this.uploadForm.get('editName').value;
      const documentType = this.uploadForm.get('type').value;
      const description = this.uploadForm.get('description').value;
      const date = this.uploadForm.get('date').value;
      this.documentService.upload(this.packageId, documentName, documentType.id, description, date, this.file).subscribe(data => {
        this.spinner.hide();
        this.closed.emit(true);
      });
    }
  }

}
