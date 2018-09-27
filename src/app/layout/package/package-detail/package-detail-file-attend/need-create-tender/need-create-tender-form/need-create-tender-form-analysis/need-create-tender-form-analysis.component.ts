import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';

@Component({
  selector: 'app-need-create-tender-form-analysis',
  templateUrl: './need-create-tender-form-analysis.component.html',
  styleUrls: ['./need-create-tender-form-analysis.component.scss']
})
export class NeedCreateTenderFormAnalysisComponent implements OnInit {

  analysisForm: FormGroup;
  routerAction;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private packageService: PackageService,
    private router: Router,
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
      this.createForm();
    });
    this.createForm();
    this.analysisForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const value = NeedCreateTenderFormComponent.formModel;
    // console.log(value);
    this.analysisForm = this.fb.group({
      documentName: value && value.documentName ? value.documentName : '',
      employerAnalysis: this.fb.group({
        reputation: value && value.employerAnalysis ? value.employerAnalysis.reputation : '',
        financeCapacity: value && value.employerAnalysis ? value && value.employerAnalysis.financeCapacity : '',
        projectRealizable: value && value.employerAnalysis ? value && value.employerAnalysis.projectRealizable : ''
      })
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.documentName = data.documentName;
    NeedCreateTenderFormComponent.formModel.employerAnalysis = data.employerAnalysis;
  }

  routerLink(event) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/consultant-analys`]);
    }
  }
}
