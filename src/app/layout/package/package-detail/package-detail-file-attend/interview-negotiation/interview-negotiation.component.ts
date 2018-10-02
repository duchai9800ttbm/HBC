import { Component, OnInit } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../package-detail.component';
import { StatusObservableHsdtService } from '../../../../../shared/services/status-observable-hsdt.service';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { InterviewInvitationService } from '../../../../../shared/services/interview-invitation.service';

@Component({
  selector: 'app-interview-negotiation',
  templateUrl: './interview-negotiation.component.html',
  styleUrls: ['./interview-negotiation.component.scss']
})
export class InterviewNegotiationComponent implements OnInit {
  packageId = +PackageDetailComponent.packageId;
  statusPackage;
  bidStatus = BidStatus;
  amountInterview: number;
  constructor(
    private packageService: PackageService,
    private statusObservableHsdtService: StatusObservableHsdtService,
    private interviewInvitationService: InterviewInvitationService,
  ) { }

  ngOnInit() {
    this.statusObservableHsdtService.statusPackageService.subscribe(value => {
      this.checkStatusPackage();
    });
  }

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

}
