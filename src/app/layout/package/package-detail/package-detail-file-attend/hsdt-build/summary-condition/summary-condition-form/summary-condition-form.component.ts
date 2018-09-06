import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from '../../../../../../../shared/services';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  static formModel: TenderConditionSummaryRequest;
  packageId;
  constructor(
    private packageService: PackageService,
    private spinner: NgxSpinnerService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.packageService.setSummaryConditionForm(true);
    // this.packageId = PackageDetailComponent.packageId;
    // SummaryConditionFormComponent.formModel.bidOpportunityId = this.packageId;
    // this.packageService.getTenderConditionSummary(this.packageId)
    //   .subscribe(data => {
    //     console.log(data);
    //     if (data) {
    //       SummaryConditionFormComponent.formModel = data;
    //     } else {
    //       SummaryConditionFormComponent.formModel = new TenderConditionSummaryRequest();
    //     }
    //   });
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
  }

  onSubmit() {
    this.spinner.show();
    this.packageService.createOrUpdateTenderConditionSummary(SummaryConditionFormComponent.formModel).subscribe(data => {
      console.log(data);
      this.spinner.hide();
      this.alertService.success('Lập hồ sơ dự thầu thành công!');
    }, err => {
      this.spinner.hide();
      this.alertService.error('Lập hồ sơ dự thầu thất bại!');
    });
  }

}
