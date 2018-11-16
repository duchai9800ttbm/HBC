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
    private activatedRoute: ActivatedRoute,
    private packageService: PackageService,
    private router: Router,
  ) { }

  ngOnInit() {
    // this.packageService.routerAction$
    this.activatedRoute.params.subscribe(router => {
      console.log('params-params-analys', router, router.action);
    });
    const that = this;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
      console.log('this.routerAction', this.routerAction);
      if (this.analysisForm && this.routerAction === 'view') {
        this.analysisForm.disable();
      }
      if (this.analysisForm && (this.routerAction === 'edit' || this.routerAction === 'create')) {
        this.analysisForm.enable();
      }
      this.createForm();
      this.analysisForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    });
    this.packageService.dataProposals$.subscribe(value => {
      this.createForm();
      this.analysisForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    });
  }

  createForm() {
    console.log('create-analysis', NeedCreateTenderFormComponent.formModel);
    const value = NeedCreateTenderFormComponent.formModel;
    this.analysisForm = this.fb.group({
      documentName: value && value.documentName ? value.documentName : '',
      employerAnalysis: this.fb.group({
        reputation: value && value.employerAnalysis ? value.employerAnalysis.reputation : '',
        financeCapacity: value && value.employerAnalysis ? value && value.employerAnalysis.financeCapacity : '',
        projectRealizable: value && value.employerAnalysis ? value && value.employerAnalysis.projectRealizable : ''
      })
    });
    if (this.analysisForm && this.routerAction === 'view') {
      this.analysisForm.disable();
    }
    if (this.analysisForm && (this.routerAction === 'edit' || this.routerAction === 'create')) {
      this.analysisForm.enable();
    }
  }

  mappingToLiveFormData(data) {
    if (NeedCreateTenderFormComponent.formModel) {
      NeedCreateTenderFormComponent.formModel.documentName = data.documentName;
      NeedCreateTenderFormComponent.formModel.employerAnalysis = data.employerAnalysis;
    }
  }

  routerLink(event) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/consultant-analys`]);
    }
  }
}
