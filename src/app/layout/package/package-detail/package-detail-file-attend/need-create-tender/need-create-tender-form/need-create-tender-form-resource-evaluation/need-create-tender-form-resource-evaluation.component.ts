import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-need-create-tender-form-resource-evaluation',
  templateUrl: './need-create-tender-form-resource-evaluation.component.html',
  styleUrls: ['./need-create-tender-form-resource-evaluation.component.scss']
})
export class NeedCreateTenderFormResourceEvaluationComponent implements OnInit {

  routerAction: string;
  resourceEvaluationForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private router: Router,
    private parent: NeedCreateTenderFormComponent
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
      this.createForm();
      if (this.routerAction === 'view') {
        this.resourceEvaluationForm.disable();
      }
      this.resourceEvaluationForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    });
    this.packageService.dataProposals$.subscribe(value => {
      this.createForm();
      this.resourceEvaluationForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    });
  }

  createForm() {
    if (NeedCreateTenderFormComponent.formModel) {
      const formValue = NeedCreateTenderFormComponent.formModel.internalResourcesEvaluation;
      this.resourceEvaluationForm = this.fb.group({
        currentSituation: formValue ? formValue.currentSituation : '',
        humanResorcesAndEquipments: formValue ? formValue.humanResorcesAndEquipments : '',
        financeCapacity: formValue ? formValue.financeCapacity : '',
        competitor: formValue ? formValue.competitor : ''
      });
    }
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.internalResourcesEvaluation = data;
  }

  mappingToSaveLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.internalResourcesEvaluation = data;
    this.parent.saveOfficially(false);
  }

  saveData() {
    this.mappingToSaveLiveFormData(this.resourceEvaluationForm.value);
  }

  routerLink(event, link) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
    }
  }
}
