import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { ReportEndInterviewComponent } from './report-end-interview/report-end-interview.component';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { InterviewInvitationFilterReport } from '../../../../../../shared/models/interview-invitation/interview-invitation-filter-report';
import { PagedResult, DictionaryItem } from '../../../../../../shared/models';
import { Subject, BehaviorSubject, Observable } from '../../../../../../../../node_modules/rxjs';
import { AlertService, DataService, UserService } from '../../../../../../shared/services';
import { DATATABLE_CONFIG2, DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { InterviewInvitationReportList } from '../../../../../../shared/models/interview-invitation/interview-invitation-report-list.model';
import { PackageService } from '../../../../../../shared/services/package.service';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { GroupDescriptor, groupBy } from '../../../../../../../../node_modules/@progress/kendo-data-query';
import { Validators } from '../../../../../../../../node_modules/@angular/forms';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { StatusObservableHsdtService } from '../../../../../../shared/services/status-observable-hsdt.service';
import { CheckStatusPackage } from '../../../../../../shared/constants/check-status-package';
import { ViewDetailReportComponent } from './view-detail-report/view-detail-report.component';
@Component({
  selector: 'app-end-interview',
  templateUrl: './end-interview.component.html',
  styleUrls: ['./end-interview.component.scss']
})
export class EndInterviewComponent implements OnInit {
  dialog;
  dialogViewDetailReport;
  currentPackageId: number;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new InterviewInvitationFilterReport();
  pagedResult: PagedResult<InterviewInvitationReportList> = new PagedResult<InterviewInvitationReportList>();
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  statusPackage = {
    text: 'DaChotCongTacChuanBiPhongVan',
    stage: 'HSDT',
    id: 18,
  };
  bidStatus = BidStatus;
  peopleUploadList;
  dateUploadList;
  interviewTimeList;
  uploadedEmployeeList;
  listClassifyCustomer: Observable<DictionaryItem[]>;
  isOnInit: boolean;
  currentFieldSort;
  statusSort;
  checkStatusPackage = CheckStatusPackage;
  constructor(
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private interviewInvitationService: InterviewInvitationService,
    private alertService: AlertService,
    private packageService: PackageService,
    private userService: UserService,
    private statusObservableHsdtService: StatusObservableHsdtService,
  ) { }
  ngOnInit() {
    this.filterModel.interviewtimes = null;
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.createdDate = null;
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.getStatusPackage();
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      if (this.isOnInit) {
        this.getStatusPackage();
      }
    });
    this.interviewInvitationService.instantSearchWithFilterReport(
      this.currentPackageId, this.searchTerm$, this.filterModel, 0, 1000).subscribe(result => {
        this.render(result);
        this.spinner.hide();
        this.peopleUploadList = this.userService.getAllUser('');
      },
        err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi!');
        });
    this.getListFilter();
    this.interviewInvitationService.watchRefeshEndInterview().subscribe(result => {
      this.getListFilter();
      this.refresh(this.isOnInit);
      this.spinner.hide();
    });
    this.interviewInvitationService.watchEndInterviewList().subscribe(result => {
      this.getListFilter();
      this.filter();
      this.spinner.hide();
    });
  }

  getStatusPackage() {
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.statusPackage = this.checkStatusPackage[result.stageStatus.id];
    });
  }

  render(pagedResult: any) {
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  getListFilter() {
    this.spinner.show();
    const filter = new InterviewInvitationFilterReport();
    this.interviewInvitationService
      .filterListReport(
        this.currentPackageId,
        '',
        filter,
        0,
        1000
      )
      .subscribe(result => {
        this.getInterviewTimeList(result);
        this.getUploadedEmployeeList(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  getInterviewTimeList(result) {
    this.interviewTimeList = result.items ? result.items.map(item => item.interviewTimes) : [];
    this.interviewTimeList = this.interviewTimeList.sort((a, b) => a - b);
    this.interviewTimeList = this.interviewTimeList.filter((el, i, a) => i === a.indexOf(el));
  }

  getUploadedEmployeeList(result) {
    this.uploadedEmployeeList = result.items ? result.items.map(item => item.uploadedBy) : [];
    this.uploadedEmployeeList = groupBy(this.uploadedEmployeeList, [{ field: 'employeeId' }]);
    this.uploadedEmployeeList = this.uploadedEmployeeList.map(item => {
      return {
        employeeId: item.items[0].employeeId,
        employeeName: item.items[0].employeeName
      };
    });
    this.uploadedEmployeeList = this.uploadedEmployeeList.sort((a, b) => a.employeeId - b.employeeId);
  }

  uploadReportInterview() {
    this.dialog = this.dialogService.open({
      content: ReportEndInterviewComponent,
      width: 650,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
    instance.reloadData = () => this.reloadData();
  }

  closePopuup() {
    this.dialog.close();
  }

  reloadData() {
    if (this.statusPackage.id === this.checkStatusPackage.DaChotCongTacChuanBiPhongVan.id) {
      this.interviewInvitationService.submitPrepareInterviews(this.currentPackageId).subscribe(response => {
        this.loadData();
        this.getListFilter();
      },
        err => {
          this.alertService.error('Đã xảy ra lỗi. Chuyển trạng thái đã phỏng vấn không thành công!');
        });
    } else {
      this.loadData();
    }
  }

  loadData() {
    this.spinner.show();
    this.interviewInvitationService.instantSearchWithFilterReport(
      this.currentPackageId, this.searchTerm$, this.filterModel, 0, 1000).subscribe(result => {
        this.render(result);
        this.spinner.hide();
        this.alertService.success('Thêm mới biên bản thành công!');
      },
        err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }

  filter() {
    this.spinner.show();
    this.interviewInvitationService
      .filterListReport(
        this.currentPackageId,
        this.searchTerm$.value,
        this.filterModel,
        0,
        1000
      )
      .subscribe(result => {
        this.render(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel.interviewtimes = null;
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.createdDate = null;
    this.filter();
  }

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.interviewInvitationService
      .filterListReport(
        this.currentPackageId,
        this.searchTerm$.value,
        this.filterModel,
        0,
        1000
      )
      .subscribe(result => {
        this.render(result);
        this.spinner.hide();
        if (displayAlert) {
          this.alertService.success(
            'Dữ liệu đã được cập nhật mới nhất'
          );
        }
        this.isOnInit = true;
      }, err => this.spinner.hide());
  }

  downloadReport(bidInterviewReportDocId: number) {
    this.interviewInvitationService.downloadReport(bidInterviewReportDocId).subscribe(response => {
    },
      err => {
        this.alertService.error('Tải về biên bản phỏng vấn không thành công!');
      });
  }

  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSort = fieldSort;
    this.statusSort = statusSort;
    switch (this.statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'documentName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + a.documentName).localeCompare(b.documentName);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'version': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => parseFloat(a.version) - parseFloat(b.version));
            this.render(this.pagedResult);
            break;
          }
          case 'employeeName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) =>
              parseFloat(a.uploadedBy.employeeName) - parseFloat(b.uploadedBy.employeeName));
            this.render(this.pagedResult);
            break;
          }
          case 'createdDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.createdDate - b.createdDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewTimes': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.interviewTimes - b.interviewTimes);
            this.render(this.pagedResult);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'documentName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => {
              return ('' + b.documentName).localeCompare(a.documentName);
            });
            this.render(this.pagedResult);
            break;
          }
          case 'version': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => parseFloat(b.version) - parseFloat(a.version));
            this.render(this.pagedResult);
            break;
          }
          case 'employeeName': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) =>
              parseFloat(b.uploadedBy.employeeName) - parseFloat(a.uploadedBy.employeeName));
            this.render(this.pagedResult);
            break;
          }
          case 'createdDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.createdDate - a.createdDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewTimes': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.interviewTimes - a.interviewTimes);
            this.render(this.pagedResult);
            break;
          }
        }
        break;
      }
      case '': {
        this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.id - b.id);
        this.render(this.pagedResult);
        break;
      }
    }
  }
  // Xem chi tiết
  viewDetail(dataItem) {
    this.dialogViewDetailReport = this.dialogService.open({
      content: ViewDetailReportComponent,
      width: 600,
      minWidth: 600
    });
    const instance = this.dialogViewDetailReport.content.instance;
    instance.callBack = () => this.closePopuupViewDetailReport();
    instance.data = dataItem;
  }

  closePopuupViewDetailReport() {
    this.dialogViewDetailReport.close();
  }
}
