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
@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss']
})
export class CreateInterviewComponent implements OnInit {
  currentPackageId: number;
  dialog;
  searchTerm$ = new BehaviorSubject<string>('');
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
    this.filterModel.status = '';
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.interviewInvitationService.instantSearchWithFilter(
      this.currentPackageId, this.searchTerm$, this.filterModel, 0, 1000).subscribe(result => {
        this.render(result);
        this.spinner.hide();
      },
        err => {
          this.spinner.hide();
        });
  }

  render(pagedResult: any) {
    pagedResult.items.forEach(element => {
      if (element.remainningDay < 0) {
        element['expiredDate'] = Math.abs(element.remainningDay);
      }
    });
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  createInvitation() {
    this.dialog = this.dialogService.open({
      content: CreateNewInvitationComponent,
      width: 600,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
  }

  closePopuup() {
    this.dialog.close();
  }

  filter() {
    console.log('this.filter', this.filterModel);
    this.spinner.show();
    this.interviewInvitationService
      .filterList(
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

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.interviewInvitationService
      .filterList(
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
      }, err => this.spinner.hide());
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }
}
