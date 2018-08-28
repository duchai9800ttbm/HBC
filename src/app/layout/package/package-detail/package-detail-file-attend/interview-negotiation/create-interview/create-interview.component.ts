import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-new-invitation/create-new-invitation.component';
import { BehaviorSubject, Subject } from '../../../../../../../../node_modules/rxjs';
import { InterviewInvitationService } from '../../../../../../shared/services/interview-invitation.service';
import { ActivatedRoute } from '../../../../../../../../node_modules/@angular/router';
import { PackageDetailComponent } from '../../../package-detail.component';
import { NgxSpinnerService } from '../../../../../../../../node_modules/ngx-spinner';
import { PagedResult } from '../../../../../../shared/models';
import { InterviewInvitationList } from '../../../../../../shared/models/interview-invitation/interview-invitation-list.model';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
@Component({
  selector: 'app-create-interview',
  templateUrl: './create-interview.component.html',
  styleUrls: ['./create-interview.component.scss']
})
export class CreateInterviewComponent implements OnInit {
  currentPackageId: number;
  dialog;
  searchTerm$= new BehaviorSubject<string>('');
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  pagedResult: PagedResult<InterviewInvitationList> = new PagedResult<InterviewInvitationList>();
  constructor(
    private dialogService: DialogService,
    private interviewInvitationService: InterviewInvitationService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.currentPackageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.interviewInvitationService.instantSearch(this.searchTerm$, this.currentPackageId, 0, 10 ).subscribe( result => {
      this.render(result);
      this.spinner.hide();
    },
    err => {
      this.spinner.hide();
    });
  }

  render(pagedResult: any) {
    this.pagedResult = pagedResult;
    console.log('this.pagedResultthis.pagedResult', this.pagedResult);
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

}
