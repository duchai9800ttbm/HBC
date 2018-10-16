import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActivityService } from '../../../../../../shared/services/activity.service';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../../node_modules/@angular/forms';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { DocumentReviewService } from '../../../../../../shared/services/document-review.service';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { FileInfo, SelectEvent } from '@progress/kendo-angular-upload';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../../../../../shared/models';
import { NgxSpinnerService } from 'ngx-spinner';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';

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
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    editName: '',
  };
  errorMess;
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
    // this.documentService.read(this.packageId, this.typeFile.id).subscribe(response => {
    //   this.uploadForm.get('version').patchValue(response.length + 1);
    // });
    this.documentService.bidDocumentType().subscribe(data => {
      this.listTypeFile = data;
      this.uploadForm.get('type').patchValue(this.typeFile);
    });
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
    this.uploadForm.get('link').disable();
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.uploadForm.get('link').patchValue('');
      this.uploadForm.get('nameFile').patchValue(event.target.files[0].name);
      if (!this.uploadForm.get('editName').value) {
        this.uploadForm.get('editName').patchValue(event.target.files[0].name);
      }
      event.target.value = null;
    }
  }

  inputChange() {
    this.deleteFileUpload();
  }
  deleteFileUpload() {
    this.uploadForm.get('link').enable();
    if (this.uploadForm.get('editName').value === this.file.name) {
      this.file = null;
      this.uploadForm.get('nameFile').patchValue('');
      this.uploadForm.get('editName').patchValue('');
    } else {
      this.uploadForm.get('nameFile').patchValue('');
      this.file = null;
    }
  }

  createForm() {
    this.uploadForm = this.fb.group({
      link: '',
      nameFile: '',
      version: '',
      type: null,
      editName: ['', Validators.required],
      date: new Date(),
      description: ''
    });
    this.uploadForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
  }
  onFormValueChanged(data?: any) {
    const isFile = (this.uploadForm.get('nameFile').value) ? true : false;
    const isLinkFile = (this.uploadForm.get('link').value) ? true : false;
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.uploadForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const documentName = this.uploadForm.get('editName').value;
      const version = this.uploadForm.get('version').value;
      const documentType = this.uploadForm.get('type').value;
      const description = this.uploadForm.get('description').value;
      const date = this.uploadForm.get('date').value;
      const link = this.uploadForm.get('link').value;
      if (this.file || link) {
        this.spinner.show();
        this.documentService.upload(
          this.packageId,
          documentName,
          documentType.id,
          description, date,
          this.file,
          link,
          version).subscribe(data => {
            this.spinner.hide();
            this.errorMess = null;
            this.closed.emit(true);
          }, err => {
            this.errorMess = 'Upload thất bại, xin vui lòng thử lại!';
            this.spinner.hide();
          });
      }
    }
  }

}
