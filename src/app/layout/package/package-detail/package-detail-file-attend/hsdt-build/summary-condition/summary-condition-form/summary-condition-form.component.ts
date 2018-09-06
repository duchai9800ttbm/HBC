import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';
import { PackageDetailComponent } from '../../../../package-detail.component';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  static formModel: TenderConditionSummaryRequest;
  packageId;
  constructor(
    private packageService: PackageService
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
    console.log(SummaryConditionFormComponent.formModel);
    this.packageService.createOrUpdateTenderConditionSummary(SummaryConditionFormComponent.formModel).subscribe(data => {
      console.log(data);
    });
  }

}
