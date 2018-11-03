import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { NeedCreateTenderComponent } from '../../need-create-tender.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-need-create-tender-form-estimated-budget',
  templateUrl: './need-create-tender-form-estimated-budget.component.html',
  styleUrls: ['./need-create-tender-form-estimated-budget.component.scss']
})
export class NeedCreateTenderFormEstimatedBudgetComponent implements OnInit {

  routerAction: string;
  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  estimatedBudgetForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => {
      this.routerAction = router;
      this.createForm();
      if (this.routerAction === 'view') {
        this.estimatedBudgetForm.disable();
      }
      this.estimatedBudgetForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    });
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage;
    this.estimatedBudgetForm = this.fb.group({
      draftBudgetOfPackage: formValue ? formValue.draftBudgetOfPackage : 0,
      draftBudgetOfPackageCurrency: this.fb.group({
        key: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.key : this.listCurrency[0],
        value: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.value : this.listCurrency[0],
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.draftBudgetOfPackageCurrency ? formValue.draftBudgetOfPackageCurrency.displayText : this.listCurrency[0]
      }),
      additionalNote: formValue ? formValue.additionalNote : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.estimatedBudgetOfPakage = data;
  }

  routerLink(event, link) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/${link}`]);
    }
  }
}
