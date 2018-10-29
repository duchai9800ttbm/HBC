import { Component, OnInit, OnDestroy } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-new-invitation/create-new-invitation.component';
import { BehaviorSubject, Subject, Subscription } from '../../../../../../../../node_modules/rxjs';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { PagedResult } from '../../../../../../shared/models';
import { InterviewInvitationList } from '../../../../../../shared/models/interview-invitation/interview-invitation-list.model';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { InterviewInvitationFilter } from '../../../../../../shared/models/interview-invitation/interview-invitation-filter.model';
import { AlertService } from '../../../../../../shared/services';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { InterviewNoticeComponent } from './interview-notice/interview-notice.component';
import { InterviewInvitation } from '../../../../../../shared/models/interview-invitation/interview-invitation-create.model';
import { CustomerModel } from '../../../../../../shared/models/interview-invitation/customer.model';
import { StatusObservableHsdtService } from '../../../../../../shared/services/status-observable-hsdt.service';
import { PackageService } from '../../../../../../shared/services/package.service';
import { BidStatus } from '../../../../../../shared/constants/bid-status';
import { groupBy } from '../../../../../../../../node_modules/@progress/kendo-data-query';
import DateTimeConvertHelper from '../../../../../../shared/helpers/datetime-convert-helper';
import { NgbDropdownConfig } from '../../../../../../../../node_modules/@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss'],
  providers: [NgbDropdownConfig],
})
export class CreateInterviewComponent implements OnInit, OnDestroy {
  currentPackageId: number;
  dialog;
  // searchTerm$ = new BehaviorSubject<string>('');
  keySearch = '';
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  pagedResult: PagedResult<InterviewInvitationList> = new PagedResult<InterviewInvitationList>();
  filterModel = new InterviewInvitationFilter();
  numberOfInterviews = [];
  isNumberOfInterviews = true;
  statusPackage;
  bidStatus = BidStatus;
  currentFieldSort: string;
  statusSort: string;
  isOnInit: boolean;
  stattusCurrentList;
  currentStatusInterview: number;
  subscription: Subscription;
  isNgOnInit = false;
  loading = false;
  constructor(
    private dialogService: DialogService,
    private interviewInvitationService: InterviewInvitationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private packageService: PackageService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.stattusCurrentList = ['create', 'prepare', 'end'];
    this.filter();
    this.getListFilter();
    this.getSatusPackage();
    this.subscription = this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      this.getSatusPackage();
      this.spinner.hide();
    });
    this.filterModel.status = '';
    this.filterModel.interviewTimes = null;
    this.filterModel.receivedDate = null;
    const getUrlChirld = this.interviewInvitationService.getUrlChirld().subscribe(value => {
      this.currentStatusInterview = value;
      this.spinner.hide();
    });
    this.subscription.add(getUrlChirld);
    const interviewList = this.interviewInvitationService.watchInterviewInvitationList().subscribe(value => {
      if (this.isNgOnInit) {
        this.isNumberOfInterviews = true;
        this.filter();
        this.getListFilter();
        this.spinner.hide();
      }
    });
    this.subscription.add(interviewList);

    // const searchKey = this.interviewInvitationService.watchKeySearchInterviewInvitation().subscribe(value => {
    //   this.keySearch = value;
    //   this.filter();
    //   this.spinner.hide();
    // });
    // this.subscription.add(searchKey);

    const refesh = this.interviewInvitationService.watchRefeshInterviewInvitationList().subscribe(value => {
      this.getListFilter();
      this.refresh(this.isOnInit);
      this.spinner.hide();
    });
    this.subscription.add(refesh);

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getSatusPackage() {
    this.packageService.getInforPackageID(this.currentPackageId).subscribe(result => {
      this.statusPackage = result.stageStatus.id;
    });
  }

  getListFilter() {
    this.spinner.show();
    const filter = new InterviewInvitationFilter();
    this.interviewInvitationService
      .filterList(
        this.currentPackageId,
        '',
        filter,
        0,
        1000
      )
      .subscribe(result => {
        this.getListNumberOfInterviews(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  getListNumberOfInterviews(result) {
    this.numberOfInterviews = result.items ? result.items.map(item => item.interviewTimes) : [];
    this.numberOfInterviews = this.numberOfInterviews.sort((a, b) => a - b);
    this.numberOfInterviews = this.numberOfInterviews.filter((el, i, a) => i === a.indexOf(el));
    const maxOfValue = Math.max.apply(Math, this.numberOfInterviews);
    this.interviewInvitationService.saveMaxInterViewTimes(maxOfValue);
  }

  render(pagedResult: any) {
    pagedResult.items.forEach(element => {
      if (element.remainningDay < 0) {
        element['expiredDate'] = Math.abs(element.remainningDay);
      }
    });
    this.pagedResult = pagedResult;
    if (!this.currentFieldSort) {
      this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.id - b.id);
    }
    if (this.isNumberOfInterviews) {
      // this.getListNumberOfInterviews();
      this.isNumberOfInterviews = false;
    }
    this.isOnInit = true;
    this.dtTrigger.next();
  }

  createInvitation(interviewCreate: InterviewInvitation) {
    this.interviewInvitationService.saveMaxInterViewTimes(0);
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 700,
      minWidth: 250,
    });
    const instance = this.dialog.content.instance;
    interviewCreate = new InterviewInvitation();
    interviewCreate.customer = new CustomerModel();
    instance.interviewInvitation = interviewCreate;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    // this.filter();
    this.dialog.close();
    // this.spinner.hide();
  }

  filter() {
    this.spinner.show();
    this.loading = true;
    this.interviewInvitationService
      .filterList(
        this.currentPackageId,
        this.keySearch,
        this.filterModel,
        0,
        1000
      )
      .subscribe(result => {
        this.render(result);
        this.spinner.hide();
        this.isNgOnInit = true;
        this.loading = false;
      }, err => {
        this.spinner.hide();
        this.loading = false;
        this.isNgOnInit = true;
      });
  }

  clearFilter() {
    this.filterModel.status = '';
    this.filterModel.interviewTimes = null;
    this.filterModel.receivedDate = null;
    this.filter();
  }

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.interviewInvitationService
      .filterList(
        this.currentPackageId,
        this.keySearch,
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
      }, err => this.spinner.hide());
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(item => item['checkboxSelected'] = value);
    this.interviewInvitationService.chooseInterviewNotification(this.pagedResult.items.filter(item => item['checkboxSelected'] === true));
  }

  EditInvitation(interviewEdit: InterviewInvitation) {
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 700,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.interviewInvitation = interviewEdit;
    instance.edit = true;
    instance.callBack = () => this.closePopuup();
  }

  sortField(fieldSort: string, statusSort: string) {
    this.currentFieldSort = fieldSort;
    this.statusSort = statusSort;
    switch (this.statusSort) {
      case 'asc': {
        switch (fieldSort) {
          case 'approvedDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.approvedDate - b.approvedDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.interviewDate - b.interviewDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewTimes': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.interviewTimes - b.interviewTimes);
            this.render(this.pagedResult);
            break;
          }
          case 'status': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => a.remainningDay - b.remainningDay);
            this.render(this.pagedResult);
            break;
          }
        }
        break;
      }
      case 'desc': {
        switch (fieldSort) {
          case 'approvedDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.approvedDate - a.approvedDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewDate': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.interviewDate - a.interviewDate);
            this.render(this.pagedResult);
            break;
          }
          case 'interviewTimes': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.interviewTimes - a.interviewTimes);
            this.render(this.pagedResult);
            break;
          }
          case 'status': {
            this.pagedResult.items = this.pagedResult.items.sort((a, b) => b.remainningDay - a.remainningDay);
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

  dowloadFileCreateInterview(id) {
    this.interviewInvitationService.downloadFileCreateInterview(id).subscribe(data => {
    }, err => {
      this.alertService.error('Lời mời phỏng vấn này không có file đính kèm.');
      // if (err.errorCode === 'BusinessException' && err.errorMessage === `File doesn't exits`) {
      //   this.alertService.error('Lời mời phỏng vấn này không có file đính kèm.!');
      // } else {
      //   this.alertService.error('Đã có lỗi xãy ra!');
      // }
    });
  }

  saveChooseInterviewService(id) {
    this.pagedResult.items.forEach(item => {
      if (item.id === id) {
        item['checkboxSelected'] = !item['checkboxSelected'];
      }
    });
    this.interviewInvitationService.chooseInterviewNotification(this.pagedResult.items.filter(item => item['checkboxSelected'] === true));
  }
}
