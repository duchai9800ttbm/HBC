import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../shared/services/alert.service';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { ListDocumentTypeIdGroup } from '../../../../../../shared/models/ho-so-du-thau/list-document-type.model';
import Utils from '../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-upload-file-hsdt',
  templateUrl: './upload-file-hsdt.component.html',
  styleUrls: ['./upload-file-hsdt.component.scss']
})
export class UploadFileHsdtComponent implements OnInit {
  @ViewChild('autofocus') autofocus;
  @ViewChild('uploadImage') uploadImageAction;
  @Input() nameFile: string;
  @Input() idFile: number;
  @Input() bidOpportunityId: number;
  @Input() childrenType: any;
  @Input() callBack: Function;
  uploadForm: FormGroup;
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    editName: '',
    interViewTimes: ''
  };
  listTypeChildren = [];
  errorMess;
  displayName: string;
  tempFile;
  typeOfDoc;
  isFile = false;
  isLinkFile = false;
  lockField = false;
  imageUrls = [];
  listDocumentShow: ListDocumentTypeIdGroup[];
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
      interViewTimes: ['', Validators.required],
      description: ''
    });
    this.uploadForm.get('type').patchValue(this.idFile);
    this.setDefaultValue(this.uploadForm.get('type').value);
    this.uploadForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
    setTimeout(() => {
      this.autofocus.nativeElement.focus();
    });
  }
  valueTypeDocChange(event) {
    this.setDefaultValue(this.uploadForm.get('type').value);
  }
  onFormValueChanged(data?: any) {
    this.lockField = this.uploadForm.get('linkFile').value ? true : false;
    if (this.isSubmitted) {
      this.validateForm();
    }
  }
  validateForm() {
    const isFile = (this.uploadForm.get('file').value) ? true : false;
    const isLinkFile = (this.uploadForm.get('linkFile').value) ? true : false;
    if (!isFile && !isLinkFile) {
      this.errorMess = 'Vui lòng chọn file hoặc đường dẫn link đến file!';
    } else {
      this.errorMess = null;
    }
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.uploadForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }
  // Get Max Value - Version & InterviewTimes
  setDefaultValue(typeDocId) {
    this.hoSoDuThauService.getFileNoSearch(this.bidOpportunityId).subscribe(responseResultDocument => {
      this.listDocumentShow = this.groupDocumentType(
        responseResultDocument.items.filter(item => item.tenderDocumentType.id == typeDocId)
      );
      if (!this.listDocumentShow[0]) {
        this.uploadForm.get('version').patchValue(1);
        this.uploadForm.get('interViewTimes').patchValue(1);
      } else {
        const maxVersion = Math.max.apply(Math, this.listDocumentShow[0].items.map(item => item.version));
        this.uploadForm.get('version').patchValue(maxVersion + 1);
        const maxInterViewTimes = Math.max.apply(Math, this.listDocumentShow[0].items.map(item => item.interViewTimes));
        this.uploadForm.get('interViewTimes').patchValue(maxInterViewTimes + 1);
      }
    }, err => {
      this.alertService.error('Lấy thông tin Phiên bản thất bại. Xin vui lòng thử lại!');
    });
  }

  groupDocumentType(source: any): any {
    const groupedObj = source.reduce((prev, cur) => {
      if (!prev[cur['tenderDocumentTypeId']]) {
        prev[cur['tenderDocumentTypeId']] = [cur];
      } else {
        prev[cur['tenderDocumentTypeId']].push(cur);
      }
      return prev;
    }, {});
    const groupBeforeSort = Object.keys(groupedObj).map(tenderDocumentTypeId => (
      {
        tenderDocumentTypeId,
        items: groupedObj[tenderDocumentTypeId]
      }
    ));
    return groupBeforeSort;
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
      const imageIds = this.imageUrls.map(image => image.guid);
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
          interViewTimes,
          imageIds
        ).subscribe(data => {
          this.spinner.hide();
          this.errorMess = null;
          this.callBack();
        }, err => {
          this.errorMess = 'Upload thất bại, xin vui lòng thử lại!';
          this.spinner.hide();
          this.callBack();
        });
      }
    }
  }
  closePopup() {
    this.callBack();
  }

  uploadFile(event) {
    this.uploadForm.get('linkFile').disable();
    this.tempFile = event.target.files;
    if (Utils.checkTypeFile(this.tempFile)) {
      this.displayName = this.tempFile[0].name;
      if (!this.uploadForm.get('editName').value) {
        this.uploadForm.get('editName').patchValue(this.displayName);
      }
      this.uploadForm.get('file').patchValue(this.tempFile[0]);
      if (!this.uploadForm.get('editName').value) {
        this.uploadForm.get('editName').patchValue(this.displayName);
      }
      event.target.value = null;
    } else {
      // tslint:disable-next-line:max-line-length
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm .jpg, .jpeg, .pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx';
    }
  }

  deleteFileUpload() {
    this.uploadForm.get('linkFile').enable();
    this.uploadForm.get('file').patchValue(null);
    this.tempFile = null;
    if (this.uploadForm.get('editName').value === this.displayName) {
      this.uploadForm.get('editName').patchValue('');
      this.displayName = '';
    } else {
      this.displayName = '';
    }
  }
  onFocus(event) {
    event.target.addEventListener('keyup', e => {
      if (e.keyCode === 13) {
        event.target.click();
      }
    });
  }
  uploadImageF(event) {
    const file = event.target.files;
    if (Utils.checkTypeFileImage(file)) {
      document.getElementById('uploadImageLoading').classList.add('loader');
      this.hoSoDuThauService.uploadImageService(file[0]).subscribe(res => {
        document.getElementById('uploadImageLoading').classList.remove('loader');
        this.imageUrls.push(res);
        this.uploadImageAction.nativeElement.value = null;
      }, err => {
        document.getElementById('uploadImageLoading').classList.remove('loader');
        this.alertService.error('Tải ảnh lên thất bại. Vui lòng thử lại!');
        this.imageUrls.forEach(x => {
          if (!x.guid) {
            this.imageUrls.splice(this.imageUrls.indexOf(x), 1);
          }
        });
      });
    } else {
      this.errorMess = 'Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg';
    }
  }
  deleteImage(image) {
    if (image.guid) {
      this.hoSoDuThauService.deleteImageService(image.guid).subscribe();
    }
    this.imageUrls.splice(this.imageUrls.indexOf(image), 1);
  }
}
