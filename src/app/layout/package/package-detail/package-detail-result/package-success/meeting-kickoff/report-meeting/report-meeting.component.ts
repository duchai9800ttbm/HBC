import { Component, OnInit, TemplateRef, Input, EventEmitter, Output } from '@angular/core';
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
import { UploadKickOffComponent } from '../upload-kick-off/upload-kick-off.component';
import { DialogService } from '../../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../../node_modules/ngx-spinner';
import { groupBy } from '../../../../../../../../../node_modules/@progress/kendo-data-query';

@Component({
  selector: 'app-report-meeting',
  templateUrl: './report-meeting.component.html',
  styleUrls: ['./report-meeting.component.scss']
})
export class ReportMeetingComponent implements OnInit {
  @Input() reportFile;
  @Output() endAPI = new EventEmitter<boolean>();
  @Output() isData = new EventEmitter<boolean>();
  isDataChild = false;
  dtTriggerReport: Subject<any> = new Subject();
  dtTriggerFile: Subject<any> = new Subject();
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
  dialogUploadMettingKickOff;
  actionUpload: string;
  currentFieldSortReport;
  statusSortReport;
  currentFieldSortFile;
  statusSortFile;
  employeeListReport;
  interviewTimesReport;
  employeeListFile;
  interviewTimesFile;
  loadingFilterMeetingReportList = true;
  loadingFilterFileList = true;
  constructor(
    private packageSuccessService: PackageSuccessService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private detailResultPackageService: DetailResultPackageService,
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
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
    this.searchTermMeetingReport$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterMeetingReportList(false);
      });
    this.detailResultPackageService.watchListListReportMeeting().subscribe(value => {
      console.log('filterMeetingReportList');
      this.filterMeetingReportList(false);
    });
    // filter file
    this.filterFile.uploadedEmployeeId = null;
    this.filterFile.createdDate = null;
    this.filterFile.interviewTimes = null;
    // this.filterFileList(false);
    this.searchTermFile$.debounceTime(600)
      .distinctUntilChanged()
      .subscribe(keySearch => {
        this.filterFileList(false);
      });
    this.detailResultPackageService.watchListFilePresentationMeeting().subscribe(value => {
      this.filterFileList(false);
    });
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
  // ====
  // ráp API
  // Report
  filterMeetingReportList(alertReload: boolean) {
    this.spinner.show();
    this.loadingFilterMeetingReportList = true;
    this.endAPI.emit(true);
    this.detailResultPackageService.getBidMeetingReportDocsList(
      this.currentPackageId,
      this.searchTermMeetingReport$.value,
      this.filterMeetingReport,
      0,
      1000
    ).subscribe(response => {
      this.meetingReportList = response.items;
      this.loadingFilterMeetingReportList = false;
      this.endAPI.emit(false);
      console.log('this.meetingFileList.length', this.meetingReportList.length, this.meetingFileList.length);
      if ((this.meetingReportList && this.meetingReportList.length !== 0) || (this.meetingFileList && this.meetingFileList.length !== 0)) {
        this.isData.emit(true);
        this.isDataChild = true;
      }
      this.getListFilterReport();
      this.spinner.hide();
      if (alertReload) {
        this.alertService.success('Danh sách biên bản cuộc họp đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.loadingFilterMeetingReportList = false;
        this.endAPI.emit(false);
        this.spinner.hide();
        this.alertService.error('Không thể cập nhật danh sách biên bản cuộc họp!');
      });
  }
  getListFilterReport() {
    this.getUploadListReport();
    this.getInterviewTimeListReport();
  }
  getUploadListReport() {
    this.employeeListReport = this.meetingReportList ? this.meetingReportList.map(item => item.uploadedBy) : [];
    this.employeeListReport = groupBy(this.employeeListReport, [{ field: 'employeeId' }]);
    this.employeeListReport = this.employeeListReport.map(item => {
      return {
        employeeId: item.items[0].employeeId,
        employeeName: item.items[0].employeeName
      };
    });
    this.employeeListReport = this.employeeListReport.sort((a, b) => a.employeeId - b.employeeId);
  }
  getInterviewTimeListReport() {
    this.interviewTimesReport = this.meetingReportList ? this.meetingReportList.map(item => item.interviewTimes) : [];
    this.interviewTimesReport = this.interviewTimesReport.sort((a, b) => a - b);
    this.interviewTimesReport = this.interviewTimesReport.filter((el, i, a) => i === a.indexOf(el));
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
  onSelectAllReport(value: boolean) {
    this.meetingReportList.forEach(x => (x['checkboxSelected'] = value));
  }
  // File
  filterFileList(alertReload: boolean) {
    this.spinner.show();
    this.loadingFilterFileList = true;
    this.endAPI.emit(true);
    this.detailResultPackageService.getBidMeetingFileList(
      this.currentPackageId,
      this.searchTermFile$.value,
      this.filterFile,
      0,
      1000
    ).subscribe(response => {
      this.meetingFileList = response.items;
      this.loadingFilterFileList = false;
      this.endAPI.emit(false);
      if ((this.meetingReportList && this.meetingReportList.length !== 0) || (this.meetingFileList && this.meetingFileList.length !== 0)) {
        this.isData.emit(true);
        this.isDataChild = true;
      }
      this.getListFilterFile();
      this.spinner.hide();
      if (alertReload) {
        this.alertService.success('Danh sách file presentation đã được cập nhật mới nhất!');
      }
    },
      err => {
        this.spinner.hide();
        this.loadingFilterFileList = false;
        this.endAPI.emit(false);
        this.alertService.error('Không thể cập nhật danh sách file presentation!');
      });
  }
  getListFilterFile() {
    this.getUploadListFile();
    this.getInterviewTimeListFile();
  }
  getUploadListFile() {
    this.employeeListFile = this.meetingFileList ? this.meetingFileList.map(item => item.uploadedBy) : [];
    this.employeeListFile = groupBy(this.employeeListFile, [{ field: 'employeeId' }]);
    this.employeeListFile = this.employeeListFile.map(item => {
      return {
        employeeId: item.items[0].employeeId,
        employeeName: item.items[0].employeeName
      };
    });
    this.employeeListFile = this.employeeListFile.sort((a, b) => a.employeeId - b.employeeId);
  }
  getInterviewTimeListFile() {
    this.interviewTimesFile = this.meetingFileList ? this.meetingFileList.map(item => item.interviewTimes) : [];
    this.interviewTimesFile = this.interviewTimesFile.sort((a, b) => a - b);
    this.interviewTimesFile = this.interviewTimesFile.filter((el, i, a) => i === a.indexOf(el));
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
  modalUp(action) {
    this.actionUpload = action;
    this.dialogUploadMettingKickOff = this.dialogService.open({
      content: UploadKickOffComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialogUploadMettingKickOff.content.instance;
    instance.callBack = () => this.closePopuup();
    instance.addAndReload = () => this.addAndReload();
    instance.action = action;
  }
  addAndReload() {
    this.dialogUploadMettingKickOff.close();
    switch (this.actionUpload) {
      case 'report': {
        this.filterMeetingReportList(false);
        break;
      }
      case 'file': {
        this.filterFileList(false);
        break;
      }
    }
  }
  closePopuup() {
    this.dialogUploadMettingKickOff.close();
  }
  onSelectAllFile(value: boolean) {
    this.meetingFileList.forEach(x => (x['checkboxSelected'] = value));
  }
  downloadMeetingReportOrFile(actionDownload, bidMeetingReportDocId) {
    this.detailResultPackageService.downloadMeeting(bidMeetingReportDocId).subscribe(response => {
    },
      err => {
        switch (actionDownload) {
          case 'report': {
            this.alertService.error('Tải về biên bản cuộc họp không thành công!');
            break;
          }
          case 'file': {
            this.alertService.error('Tải về file presentation không thành công!');
          }
        }
      });
  }
  deleteMeetingReportOrFile(actionDownload, bidMeetingReportDocId) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa biên bản được chọn?',
      () => {
        this.detailResultPackageService.deleteMeetingReportOrFile(bidMeetingReportDocId).subscribe(response => {
          switch (actionDownload) {
            case 'report': {
              this.alertService.success('Xóa biên bản thành công!');
              this.filterMeetingReportList(false);
              break;
            }
            case 'file': {
              this.alertService.success('Xóa file presentation thành công!');
              this.filterFileList(false);
            }
          }
        }, err => {
          switch (actionDownload) {
            case 'report': {
              this.alertService.error('Xóa biên bản không thành công!');
              break;
            }
            case 'file': {
              this.alertService.error('Xóa file presentation không thành công!');
            }
          }
        });
      });
  }
  deleteButMeetingReportOrFile(actionDownload) {
    const listItemCheckbox = [];
    switch (actionDownload) {
      case 'report': {
        this.meetingReportList.forEach(x => {
          if (x['checkboxSelected'] === true) {
            listItemCheckbox.push(x.id);
          }
        });
        switch (listItemCheckbox.length) {
          case 0: {
            this.alertService.error('Bạn chưa chọn biên bản cần xóa!');
            break;
          }
          case 1: {
            this.confirmationService.confirm(
              'Bạn có chắc chắn muốn xóa biên bản được chọn?',
              () => {
                this.detailResultPackageService.deleteMeetingReportOrFile(listItemCheckbox[0]).subscribe(response => {
                  this.filterMeetingReportList(false);
                  this.alertService.success('Xóa biên bản thành công!');
                },
                  err => {
                    this.alertService.error('Xóa biên bản không thành công!');
                  });
              });
            break;
          }
          default: {
            this.confirmationService.confirm(
              'Bạn có chắc chắn muốn xóa biên bản được chọn?',
              () => {
                this.detailResultPackageService.deleteMutipleMeetingReportOrFile(listItemCheckbox).subscribe(response => {
                  this.filterMeetingReportList(false);
                  this.alertService.success('Xóa biên bản thành công!');
                },
                  err => {
                    this.alertService.error('Xóa biên bản không thành công!');
                  });
              });
          }
        }
        break;
      }
      case 'file': {
        this.meetingFileList.forEach(x => {
          if (x['checkboxSelected'] === true) {
            listItemCheckbox.push(x.id);
          }
        });
        switch (listItemCheckbox.length) {
          case 0: {
            this.alertService.error('Bạn chưa chọn file presentation cần xóa!');
            break;
          }
          case 1: {
            this.confirmationService.confirm(
              'Bạn có chắc chắn muốn xóa file presentation được chọn?',
              () => {
                this.detailResultPackageService.deleteMeetingReportOrFile(listItemCheckbox[0]).subscribe(response => {
                  this.filterFileList(false);
                  this.alertService.success('Xóa file presentation thành công!');
                },
                  err => {
                    this.alertService.error('Xóa file presentation không thành công!');
                  });
              });
            break;
          }
          default: {
            this.confirmationService.confirm(
              'Bạn có chắc chắn muốn xóa file presentation được chọn?',
              () => {
                this.detailResultPackageService.deleteMutipleMeetingReportOrFile(listItemCheckbox).subscribe(response => {
                  this.filterFileList(false);
                  this.alertService.success('Xóa file presentation thành công!');
                },
                  err => {
                    this.alertService.error('Xóa file presentation không thành công!');
                  });
              });
          }
        }
      }
    }
  }
  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSortReport = fieldSort;
    this.statusSortReport = statusSort;
    switch (statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'documentName': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + a.documentName).localeCompare(b.documentName);
            });
            break;
          }
          case 'version': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + a.version).localeCompare(b.version);
            });
            break;
          }
          case 'employeeName': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + a.uploadedBy.employeeName).localeCompare(b.uploadedBy.employeeName);
            });
            break;
          }
          case 'createdDate': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => a.createdDate - b.createdDate);
            break;
          }
          case 'interviewTimes': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => a.interviewTimes - b.interviewTimes);
            break;
          }
          case 'meetingTime': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => a.meetingTime - b.meetingTime);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'documentName': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + b.documentName).localeCompare(a.documentName);
            });
            break;
          }
          case 'version': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + b.version).localeCompare(a.version);
            });
            break;
          }
          case 'employeeName': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => {
              return ('' + b.uploadedBy.employeeName).localeCompare(a.uploadedBy.employeeName);
            });
            break;
          }
          case 'createdDate': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => b.createdDate - a.createdDate);
            break;
          }
          case 'interviewTimes': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => b.interviewTimes - a.interviewTimes);
            break;
          }
          case 'meetingTime': {
            this.meetingReportList = this.meetingReportList.sort((a, b) => b.meetingTime - a.meetingTime);
            break;
          }
        }
        break;
      }
      case '': {
        this.meetingReportList = this.meetingReportList.sort((a, b) => b.id - a.id);
        break;
      }
    }
  }

  sortFieldFile(fieldSort: string, statusSort: string) {
    this.currentFieldSortFile = fieldSort;
    this.statusSortFile = statusSort;
    switch (statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'documentName': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + a.documentName).localeCompare(b.documentName);
            });
            break;
          }
          case 'version': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + a.version).localeCompare(b.version);
            });
            break;
          }
          case 'employeeName': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + a.uploadedBy.employeeName).localeCompare(b.uploadedBy.employeeName);
            });
            break;
          }
          case 'createdDate': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => a.createdDate - b.createdDate);
            break;
          }
          case 'interviewTimes': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => a.interviewTimes - b.interviewTimes);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'documentName': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + b.documentName).localeCompare(a.documentName);
            });
            break;
          }
          case 'version': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + b.version).localeCompare(a.version);
            });
            break;
          }
          case 'employeeName': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => {
              return ('' + b.uploadedBy.employeeName).localeCompare(a.uploadedBy.employeeName);
            });
            break;
          }
          case 'createdDate': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => b.createdDate - a.createdDate);
            break;
          }
          case 'interviewTimes': {
            this.meetingFileList = this.meetingFileList.sort((a, b) => b.interviewTimes - a.interviewTimes);
            break;
          }
        }
        break;
      }
      case '': {
        this.meetingFileList = this.meetingFileList.sort((a, b) => b.id - a.id);
        break;
      }
    }
  }
}
