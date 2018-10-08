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
import { GroupDescriptor } from '../../../../../../../../node_modules/@progress/kendo-data-query';
@Component({
  selector: 'app-end-interview',
  templateUrl: './end-interview.component.html',
  styleUrls: ['./end-interview.component.scss']
})
export class EndInterviewComponent implements OnInit {
  dialog;
  currentPackageId: number;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new InterviewInvitationFilterReport();
  pagedResult: PagedResult<InterviewInvitationReportList> = new PagedResult<InterviewInvitationReportList>();
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  statusPackage;
  bidStatus = BidStatus;
  peopleUploadList;
  dateUploadList;
  interviewTimeList;
  listClassifyCustomer: Observable<DictionaryItem[]>;
  constructor(
    private dialogService: DialogService,
    private spinner: NgxSpinnerService,
    private interviewInvitationService: InterviewInvitationService,
    private alertService: AlertService,
    private packageService: PackageService,
    private userService: UserService,
  ) { }

  ngOnInit() {
    this.filterModel.interviewtimes = 0;
    this.filterModel.uploadedEmployeeId = 0;
    this.filterModel.createdDate = 0;
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.statusPackage = result.stageStatus.id;
    });
    this.interviewInvitationService.instantSearchWithFilterReport(
      this.currentPackageId, this.searchTerm$, this.filterModel, 0, 1000).subscribe(result => {
        this.render(result);
        this.spinner.hide();
        // this.peopleUploadList = [result.items, { field: 'uploadedBy.employeeName' }];
        //  this.peopleUploadList = result.items.map( filed => filed.uploadedBy.employeeName);
        //  console.log( [...new Set(this.peopleUploadList).toJSON()] );
        // this.peopleUploadList = [result.items, { field: 'uploadedBy.employeeName' }];
        // this.dateUploadList = [result.items, { field: 'createdDate' }];
        // console.log('this.peopleUploadList', this.peopleUploadList, this.dateUploadList);
        this.peopleUploadList = this.userService.getAllUser('');
      },
        err => {
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi!');
        });
  }

  render(pagedResult: any) {
    // pagedResult.items.forEach(element => {
    //   if (element.remainningDay < 0) {
    //     element['expiredDate'] = Math.abs(element.remainningDay);
    //   }
    // });
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
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
    if (this.statusPackage === this.bidStatus.DaChotCongTacChuanBiPhongVan) {
      this.interviewInvitationService.submitPrepareInterviews(this.currentPackageId).subscribe(response => {
        this.loadData();
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
}
