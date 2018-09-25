import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '../../../../../../../../../node_modules/@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
import { DictionaryItem } from '../../../../../../../shared/models';
import { FileInfo, SelectEvent } from '../../../../../../../../../node_modules/@progress/kendo-angular-upload';
import { AlertService } from '../../../../../../../shared/services';
import { DocumentService } from '../../../../../../../shared/services/document.service';
import { NgxSpinnerService } from '../../../../../../../../../node_modules/ngx-spinner';
import ValidationHelper from '../../../../../../../shared/helpers/validation.helper';
import { PriceReviewService } from '../../../../../../../shared/services/price-review.service';

@Component({
  selector: 'app-upload-file-attach',
  templateUrl: './upload-file-attach.component.html',
  styleUrls: ['./upload-file-attach.component.scss']
})
export class UploadFileAttachComponent implements OnInit {

  uploadForm: FormGroup;
  @Output() closed = new EventEmitter<boolean>();
  @Input() packageId;
  datePickerConfig = DATETIME_PICKER_CONFIG;

  listTypeFile: DictionaryItem[];
  file;
  icon = `<i class="fa fa-search" aria-hidden="true"></i>`;
  public events: string[] = [];
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
    private priceReviewService: PriceReviewService
  ) {

  }

  ngOnInit() {
    this.createForm();
  }


  selectEventHandler(e: SelectEvent) {
    e.files.forEach((file) => this.myFiles.push(file));
  }
  public valueChange(value: any): void {
  }

  public selectionChange(value: any): void {
  }



  fileChange(event) {
    this.uploadForm.get('link').disable();
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.file = fileList[0];
      this.uploadForm.get('link').patchValue('');
      this.uploadForm.get('nameFile').patchValue('');
      this.uploadForm.get('editName').patchValue('');
      this.uploadForm.get('nameFile').patchValue(event.target.files[0].name);
      this.uploadForm.get('editName').patchValue(event.target.files[0].name);
      event.target.value = null;
    }
  }

  inputChange() {
    this.deleteFileUpload();
  }
  deleteFileUpload() {
    this.file = null;
    this.uploadForm.get('link').enable();

    this.uploadForm.get('nameFile').patchValue('');
    this.uploadForm.get('editName').patchValue('');
  }

  createForm() {
    this.uploadForm = this.fb.group({
      link: '',
      nameFile: '',
      editName: ['', Validators.required],
      description: ''
    });

    this.uploadForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
  }
  onFormValueChanged(data?: any) {
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
      const description = this.uploadForm.get('description').value;
      const link = this.uploadForm.get('link').value;
      if (this.file || link) {
        this.spinner.show();
        this.priceReviewService.upload(
          this.packageId,
          documentName,
          description,
          this.file,
          link,
        ).subscribe(data => {
          this.spinner.hide();
          this.errorMess = null;
          this.closed.emit(true);
        }, err => {
          this.errorMess = 'Upload thất bại, xin vui lòng thử lại!';
          this.spinner.hide();
        });
      } else {
        this.errorMess = 'Vui lòng chọn file hoặc đường dẫn link đến file!';
      }

    }
  }

}
