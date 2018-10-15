import { Component, OnInit, TemplateRef, Input } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DATATABLE_CONFIG } from '../../../../../../../shared/configs';
import { Observable, BehaviorSubject, Subject } from '../../../../../../../../../node_modules/rxjs';
import { PackageSuccessService } from '../../../../../../../shared/services/package-success.service';
import { DocumentItem } from '../../../../../../../shared/models/document-item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
import { ConfirmationService, AlertService } from '../../../../../../../shared/services';
import { DetailResultPackageService } from '../../../../../../../shared/services/detail-result-package.service';
import { FilterReportMeeting } from '../../../../../../../shared/models/result-attend/filter-report-meeting.model';
import { ReportMeetingList } from '../../../../../../../shared/models/result-attend/report-meeting-list.model';

@Component({
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  styleUrls: ['./report-meeting.component.scss']
})
export class ReportMeetingComponent implements OnInit {
  @Input() reportFile;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  documentItem: DocumentItem;
  checkboxSeclectAll: boolean;
  checkboxSeclectAllFile: boolean;
  total: number;
  totalFileUpload: number;
  formUpload: FormGroup;
  submitted = false;
  currentPackageId: number;
  modalUpload: BsModalRef;
  textUploadReport: string;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  type: number;
  public resultData: any[] = [];
  public dataFileUpload: DocumentItem[] = [];
  searchTermMeetingReport$ = new BehaviorSubject<string>('');
  searchTermFile$ = new BehaviorSubject<string>('');
  filterMeetingReport = new FilterReportMeeting();
  filterFile = new FilterReportMeeting();
  meetingReportList: ReportMeetingList[];
  meetingFileList: ReportMeetingList[];
  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private detailResultPackageService: DetailResultPackageService,
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
    if (this.reportFile) {
      this.resultData = this.packageSuccessService.getDataResult();
    } else {
      this.dataFileUpload = this.packageSuccessService.getdataDocuments();
    }
    this.totalFileUpload = this.dataFileUpload.length;
    this.total = this.resultData.length;
    // ======
    // API
    // filter report
    this.filterMeetingReport.uploadedEmployeeId = null;
    this.filterMeetingReport.createdDate = null;
    this.filterMeetingReport.meetingTime = null;
    this.filterMeetingReport.interviewTimes = null;
    this.filterMeetingReportList(false);
    this.searchTermMeetingReport$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterMeetingReportList(false);
      });
    // filter file
    this.filterFile.uploadedEmployeeId = null;
    this.filterFile.createdDate = null;
    this.filterFile.interviewTimes = null;
    this.filterFileList(false);
    this.searchTermFile$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterFileList(false);
      });
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
    this.resultData = this.packageSuccessService.getDataResult();
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
    this.totalFileUpload = this.dataFileUpload.length;
    this.modalUpload.hide();
  }

  modalUp(template: TemplateRef<any>, type: number) {
    this.type = type;
    console.log('type', type);
    if (this.type === 1) {
      this.textUploadReport = 'Upload biên bản cuộc họp';
    } else {
      this.textUploadReport = 'Upload file presentation';
    }
    this.modalUpload = this.modalService.show(template);
  }
  // ====
  // ráp API
  // Report
  filterMeetingReportList(alertReload: boolean) {
    this.detailResultPackageService.getBidMeetingReportDocsList(
      this.currentPackageId,
      this.searchTermMeetingReport$.value,
      this.filterMeetingReport,
      0,
      1000
    ).subscribe(response => {
      this.meetingReportList = response.items;
      if (alertReload) {
        this.alertService.success('Danh sách biên bản cuộc họp đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.alertService.error('Không thể cập nhật danh sách biên bản cuộc họp!');
      });
  }
  refeshListReport() {
    this.filterMeetingReportList(true);
  }
  filterReport() {
    this.filterMeetingReportList(false);
  }
  clearFilterReport() {
    this.filterMeetingReport.uploadedEmployeeId = null;
    this.filterMeetingReport.createdDate = null;
    this.filterMeetingReport.meetingTime = null;
    this.filterMeetingReport.interviewTimes = null;
    this.filterMeetingReportList(false);
  }
  // File
  filterFileList(alertReload: boolean) {
    this.detailResultPackageService.getBidMeetingFileList(
      this.currentPackageId,
      this.searchTermFile$.value,
      this.filterFile,
      0,
      1000
    ).subscribe(response => {
      this.meetingFileList = response.items;
      if (alertReload) {
        this.alertService.success('Danh sách file presentation đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.alertService.error('Không thể cập nhật danh sách file presentation!');
      });
  }
  refeshListFile() {
    this.filterFileList(true);
  }
  filterFileFunction() {
    this.filterFileList(false);
  }
  clearFilterFileFunction() {
    this.filterFile.uploadedEmployeeId = null;
    this.filterFile.createdDate = null;
    this.filterFile.interviewTimes = null;
    this.filterFileList(false);
  }
}
