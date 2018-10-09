import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { PackageDetailComponent } from '../../../package-detail.component';

@Component({
  selector: 'app-upload-file-hsdt',
  templateUrl: './upload-file-hsdt.component.html',
  styleUrls: ['./upload-file-hsdt.component.scss']
})
export class UploadFileHsdtComponent implements OnInit {
  @Input() nameFile: string;
  @Input() idFile: number;
  @Input() bidOpportunityId: number;
  @Input() childrenType: any;
  @Input() callBack: Function;
  @Output() isSubmitUpload = new EventEmitter<boolean>();
  uploadForm: FormGroup;
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    editName: '',
  };
  listTypeChildren = [];
  errorMess;
  displayName: string;
  tempFile;
  typeOfDoc;
  isFile = false;
  isLinkFile = false;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private hoSoDuThauService: HoSoDuThauService

  ) { }
  ngOnInit() {
    this.listTypeChildren = this.childrenType.map(i => i.item);
    this.uploadForm = this.fb.group({
      linkFile: '',
      file: '',
      type: '',
      editName: ['', Validators.required],
      version: '',
      interViewTimes: '',
      description: ''
    });
    this.uploadForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
  }
  onFormValueChanged(data?: any) {
    const isFile = (this.uploadForm.get('file').value) ? true : false;
    const isLinkFile = (this.uploadForm.get('linkFile').value) ? true : false;
    if (!isFile && !isLinkFile) {
      this.errorMess = 'Vui lòng chọn file hoặc đường dẫn link đến file!';
    } else {
      this.errorMess = null;
    }
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
  uploadFile(event) {
    this.tempFile = event.target.files;
    this.uploadForm.get('file').patchValue(this.tempFile[0]);
    this.displayName = this.tempFile[0].name;
  }

  submitUpload() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const file = this.uploadForm.get('file').value;
      const linkFile = this.uploadForm.get('linkFile').value;
      const type = this.uploadForm.get('type').value;
      const description = this.uploadForm.get('description').value;
      const editName = this.uploadForm.get('editName').value;
      const interViewTimes = this.uploadForm.get('interViewTimes').value;
      const version = this.uploadForm.get('version').value;
      if (file || linkFile) {
        this.spinner.show();
        this.typeOfDoc = (type) ? type : this.idFile;
        this.hoSoDuThauService.taiLenHoSoDuThau(
          this.bidOpportunityId,
          this.typeOfDoc,
          editName,
          description,
          file,
          linkFile,
          version,
          interViewTimes
        ).subscribe(data => {
          this.spinner.hide();
          this.errorMess = null;
          this.callBack();
        }, err => {
          this.errorMess = 'Upload thất bại, xin vui lòng thử lại!';
          this.spinner.hide();
        });
      }
    }
  }
  closePopup() {
    this.callBack();
  }
  deleteFileUpload() {
    this.uploadForm.get('file').patchValue(null);
    this.tempFile = null;
    this.displayName = '';
  }
}
