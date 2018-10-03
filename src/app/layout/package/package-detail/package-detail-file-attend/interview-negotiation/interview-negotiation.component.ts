import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { InterviewInvitationService } from '../../../../../shared/services/interview-invitation.service';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { CreateNewInvitationComponent } from './create-interview/create-new-invitation/create-new-invitation.component';
import { InterviewInvitation } from '../../../../../shared/models/interview-invitation/interview-invitation-create.model';
import { CustomerModel } from '../../../../../shared/models/interview-invitation/customer.model';
import { InterviewNoticeComponent } from './create-interview/interview-notice/interview-notice.component';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs';


@Component({
  selector: 'app-interview-negotiation',
  templateUrl: './interview-negotiation.component.html',
  styleUrls: ['./interview-negotiation.component.scss']
})
export class InterviewNegotiationComponent implements OnInit {
  changeKeySearchInterviewInvitation$ = new BehaviorSubject<string>('');
  packageId = +PackageDetailComponent.packageId;
  statusPackage;
  bidStatus = BidStatus;
  amountInterview: number;
  dialog;
  constructor(
    private dialogService: DialogService,
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private interviewInvitationService: InterviewInvitationService,
  ) { }

  ngOnInit() {
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      this.checkStatusPackage();
    });
    this.changeKeySearchInterviewInvitation$.debounceTime(600)
    .distinctUntilChanged()
    .subscribe( keySearch => {
      console.log('keySearch', keySearch);
      this.interviewInvitationService.changeKeySearchNew(keySearch);
      this.interviewInvitationService.changeKeySearchInterviewInvitation(keySearch);
    });
  }

  // changeKeySearchInterviewInvitation(keySearch) {
  //   this.interviewInvitationService.changeKeySearchInterviewInvitation(keySearch);
  // }

  checkStatusPackage() {
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.statusPackage = result.stageStatus.id;
      if (this.statusPackage === this.bidStatus.DaNopHSDT || this.statusPackage === this.bidStatus.DaNhanLoiMoi) {
        this.interviewInvitationService.getListInterview(
          this.packageId,
          0,
          1000
        ).subscribe(response => {
          this.amountInterview = response.length + 1;
        });
      }
    });
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
    this.dialog.close();
  }

  noticeInterview() {
    this.dialog = this.dialogService.open({
      content: InterviewNoticeComponent,
      width: 1100,
      minWidth: 250
    });
    const instance = this.dialog.content.instance;
    instance.callBack = () => this.closePopuup();
  }

  refreshCreateInterview() {
    this.interviewInvitationService.chagneRefeshInterviewInvitationList(true);
  }
}
