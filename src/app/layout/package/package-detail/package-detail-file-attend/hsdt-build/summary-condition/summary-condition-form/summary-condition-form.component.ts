import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';

@Component({
  selector: 'app-summary-condition-form',
  templateUrl: './summary-condition-form.component.html',
  styleUrls: ['./summary-condition-form.component.scss']
})
export class SummaryConditionFormComponent implements OnInit, OnDestroy {

  constructor(
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.packageService.setSummaryConditionForm(true);
  }

  ngOnDestroy(): void {
    this.packageService.setSummaryConditionForm(false);
  }

}
