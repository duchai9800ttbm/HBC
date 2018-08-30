import { Component, OnInit, OnDestroy } from '@angular/core';
import { PackageService } from '../../../../../../../shared/services/package.service';

@Component({
  selector: 'app-site-survey-form',
  templateUrl: './site-survey-form.component.html',
  styleUrls: ['./site-survey-form.component.scss']
})
export class SiteSurveyFormComponent implements OnInit, OnDestroy {

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
