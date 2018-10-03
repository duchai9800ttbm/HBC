import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-new-invitation/create-new-invitation.component';
import { BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
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
@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss']
})
export class CreateInterviewComponent implements OnInit {
  currentPackageId: number;
  dialog;
  // searchTerm$ = new BehaviorSubject<string>('');
  keySearch: string;
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  pagedResult: PagedResult<InterviewInvitationList> = new PagedResult<InterviewInvitationList>();
  filterModel = new InterviewInvitationFilter();
  constructor(
    private dialogService: DialogService,
    private interviewInvitationService: InterviewInvitationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.interviewInvitationService.watchInterviewInvitationList().subscribe(value => {
      this.filter();
    });

    this.interviewInvitationService.watchKeySearchNew().subscribe(data => {
      console.log('goi con');
    });

    // this.interviewInvitationService.watchKeySearchInterviewInvitation().subscribe( value => {
    //   console.log('value-component-chirl', value);
    //   this.keySearch = value;
    //   this.filter();
    // });

    // this.interviewInvitationService.watchKeySearchInterviewInvitation().debounceTime(600)
    // .distinctUntilChanged()
    // .subscribe(term => {
    //   this.keySearch = term;
    //   this.filter();
    //   this.spinner.hide();
    // });

    // this.spinner.show();
    // this.interviewInvitationService.instantSearchWithFilter(
    //   this.currentPackageId, this.interviewInvitationService.watchKeySearchInterviewInvitation(),
    //   this.filterModel, 0, 1000).subscribe(result => {
    //     this.render(result);
    //     this.spinner.hide();
    //   },
    //     err => {
    //       this.spinner.hide();
    //     });

    this.interviewInvitationService.watchRefeshInterviewInvitationList().subscribe(value => {
      console.log('value-refesh', value);
      this.refresh(true);
      this.spinner.hide();
    });
    this.filterModel.status = '';
    this.currentPackageId = +PackageDetailComponent.packageId;
  }

  render(pagedResult: any) {
    pagedResult.items.forEach(element => {
      if (element.remainningDay < 0) {
        element['expiredDate'] = Math.abs(element.remainningDay);
      }
    });
    this.pagedResult = pagedResult;
    console.log('this.pageRessult', this.pagedResult);
    this.dtTrigger.next();
  }

  createInvitation(interviewCreate: InterviewInvitation) {
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    interviewCreate = new InterviewInvitation();
    interviewCreate.customer = new CustomerModel();
    instance.interviewInvitation = interviewCreate;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.filter();
    this.dialog.close();
  }

  filter() {
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
      }, err => this.spinner.hide());
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
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }

  // noticeInterview() {
  //   this.dialog = this.dialogService.open({
  //     content: InterviewNoticeComponent,
  //     width: 1100,
  //     minWidth: 250
  //   });
  //   const instance = this.dialog.content.instance;
  //   instance.callBack = () => this.closePopuup();
  // }

  EditInvitation(interviewEdit: InterviewInvitation) {
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.interviewInvitation = interviewEdit;
    instance.callBack = () => this.closePopuup();
  }
}
