import { Component, OnInit } from '@angular/core';
import { PackageDetailComponent } from '../../package-detail.component';
import { NeedCreateTenderFormComponent } from './need-create-tender-form/need-create-tender-form.component';
import { ProposeTenderParticipateRequest } from '../../../../../shared/models/api-request/package/propose-tender-participate-request';
import { PackageService } from '../../../../../shared/services/package.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../shared/services';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-need-create-tender',
  templateUrl: './need-create-tender.component.html',
  styleUrls: ['./need-create-tender.component.scss']
})
export class NeedCreateTenderComponent implements OnInit {

  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  bidOpportunityId;
  proposedTender: ProposeTenderParticipateRequest;
  constructor(
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.bidOpportunityId = PackageDetailComponent.packageId;
    this.spinner.show();
    this.packageService.getProposedTenderParticipateReport(this.bidOpportunityId).subscribe(data => {
      if (data) {
        NeedCreateTenderFormComponent.formModel = data;
        this.proposedTender = data;
        setTimeout(() => {
          this.dtTrigger.next();
        });
      } else {
        NeedCreateTenderFormComponent.formModel = new ProposeTenderParticipateRequest();
      }
      this.spinner.hide();
    }, err => {
      this.spinner.hide();
      this.alertService.error('Lấy thông tin phiếu đề nghị dự thầu thất bại!');
    });
  }

}
