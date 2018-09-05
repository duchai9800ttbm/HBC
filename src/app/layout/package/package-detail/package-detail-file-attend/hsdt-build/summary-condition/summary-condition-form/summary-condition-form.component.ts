import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { TenderConditionSummaryRequest } from '../../../../../../../shared/models/api-request/package/tender-condition-summary-request';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  static formModel: TenderConditionSummaryRequest = new TenderConditionSummaryRequest();
  constructor(
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.packageService.setSummaryConditionForm(true);
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
  }

  onSubmit() {
    console.log(SummaryConditionFormComponent.formModel);
  }

}
