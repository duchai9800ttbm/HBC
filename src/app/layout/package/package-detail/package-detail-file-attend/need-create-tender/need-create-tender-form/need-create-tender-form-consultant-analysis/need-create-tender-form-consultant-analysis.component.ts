import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-need-create-tender-form-consultant-analysis',
  templateUrl: './need-create-tender-form-consultant-analysis.component.html',
  styleUrls: ['./need-create-tender-form-consultant-analysis.component.scss']
})
export class NeedCreateTenderFormConsultantAnalysisComponent implements OnInit {

  routerAction: string;
  consultantAnalysForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    console.log(this.routerAction);
    this.packageService.routerAction$.subscribe(router => this.routerAction = router);
    this.createForm();
    this.consultantAnalysForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.consultantAnalysis;
    this.consultantAnalysForm = this.fb.group({
      reputation: formValue ? formValue.reputation : '',
      pastWorkingExperience: formValue ? formValue.pastWorkingExperience : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.consultantAnalysis = data;
  }

  routerLink(event, link) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
    }
  }
}
