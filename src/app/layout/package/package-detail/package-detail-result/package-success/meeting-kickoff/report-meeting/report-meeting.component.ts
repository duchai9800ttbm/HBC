import { Component, OnInit, TemplateRef,Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../node_modules/rxjs';
import { PackageSuccessService } from '../../../../../../../shared/services/package-success.service';
import { DocumentItem } from '../../../../../../../shared/models/document-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
import { ConfirmationService, AlertService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  styleUrls: ['./report-meeting.component.scss']
})
export class ReportMeetingComponent implements OnInit {   
  @Input() reportFile;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  documentItem:DocumentItem;
  checkboxSeclectAll: boolean;
  checkboxSeclectAllFile:boolean;
  total: number;
  totalFileUpload:number;
  formUpload: FormGroup;
  submitted = false;
  currentPackageId: number;
  modalUpload: BsModalRef;
  textUploadReport: string;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  type:number;
  public resultData :any [] =[];
  public dataFileUpload: DocumentItem[] =[];

  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
  ) { }

  ngOnInit() {    
    this.formUpload = this.formBuilder.group({
      name: [''],
      description: [''],
      createDate: [''],
      userId: [null],
      version: [''],
      interview: [''],
      link: ['']
    });
    if(this.reportFile) {
      this.resultData =  this.packageSuccessService.getDataResult();
    }else {
      this.dataFileUpload = this.packageSuccessService.getdataDocuments();
    }
   
    this.totalFileUpload =this.dataFileUpload.length;    
    this.total = this.resultData.length;
  }
  onSelectAll(value: boolean) {
    this.resultData.forEach(x => (x['checkboxSelected'] = value));
  }

  onSelectAllFile(value: boolean) {
    this.dataFileUpload.forEach(x => (x['checkboxSelectedFile'] = value));
  }

  get f() { return this.formUpload.controls; }
  onSubmit() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.alertService.success('Upload biên bản cuộc họp thành công!');
    this.resultData =  this.packageSuccessService.getDataResult();
    this.total = this.resultData.length;
    this.modalUpload.hide();
  }
  submitForm() {
    this.submitted = true;
    if (this.formUpload.invalid) {
      return;
    }
    this.alertService.success('Upload file Presentation thành công!');
    this.dataFileUpload = this.packageSuccessService.getdataDocuments();
    this.totalFileUpload =this.dataFileUpload.length;    
  
    this.modalUpload.hide();
  }

  modalUp(template: TemplateRef<any>, type: number) {
    this.type = type;
    console.log('type',type);
    if (this.type == 1) {
      this.textUploadReport = 'Upload biên bản cuộc họp';
    } else {
      this.textUploadReport = 'Upload file presentation';
    }
    this.modalUpload = this.modalService.show(template);

  }

}
