import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import DateTimeConvertHelper from '../../../../../../../shared/helpers/datetime-convert-helper';
import { PackageService } from '../../../../../../../shared/services/package.service';

@Component({
  selector: 'app-need-create-tender-form-contract-condition',
  templateUrl: './need-create-tender-form-contract-condition.component.html',
  styleUrls: ['./need-create-tender-form-contract-condition.component.scss']
})
export class NeedCreateTenderFormContractConditionComponent implements OnInit {

  routerAction: string;
  listCurrency: Array<string> = ['VNĐ', 'USD'];
  // currency = 'VNĐ';
  listTime: Array<string> = ['Ngày', 'Tháng', 'Năm'];
  // time = 'Tháng';
  listPayment = ['Theo tháng (Monthly Payment)', 'Theo giai đoạn (Milestone)'];
  contractConditionForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => this.routerAction = router);
    this.createForm();
    this.contractConditionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.contractCondition;
    this.contractConditionForm = this.fb.group({
      typeOfContract: formValue ? formValue.typeOfContract : '',
      timeForCompletion: formValue ? formValue.timeForCompletion : 0,
      timeForCompletionUnit: this.fb.group({
        key: formValue && formValue.timeForCompletionUnit ? formValue.timeForCompletionUnit.key : this.listTime[0],
        value: formValue && formValue.timeForCompletionUnit ? formValue.timeForCompletionUnit.value : this.listTime[0],
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.timeForCompletionUnit ? formValue.timeForCompletionUnit.displayText : this.listTime[0]
      }),
      commencementDate: formValue ? DateTimeConvertHelper.fromTimestampToDtObject(formValue.commencementDate * 1000) : null,
      warrantyPeriod: formValue ? formValue.warrantyPeriod : 0,
      warrantyPeriodUnit: this.fb.group({
        key: formValue && formValue.warrantyPeriodUnit ? formValue.warrantyPeriodUnit.key : this.listTime[0],
        value: formValue && formValue.warrantyPeriodUnit ? formValue.warrantyPeriodUnit.value : this.listTime[0],
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.warrantyPeriodUnit ? formValue.warrantyPeriodUnit.displayText : this.listTime[0]
      }),
      tenderSecurity: formValue ? formValue.tenderSecurity : 0,
      tenderSecurityCurrency: this.fb.group({
        key: formValue && formValue.tenderSecurityCurrency ? formValue.tenderSecurityCurrency.key : this.listCurrency[0],
        value: formValue && formValue.tenderSecurityCurrency ? formValue.tenderSecurityCurrency.value : this.listCurrency[0],
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.tenderSecurityCurrency ? formValue.tenderSecurityCurrency.displayText : this.listCurrency[0]
      }),
      performanceSecurity: formValue ? formValue.performanceSecurity : 0,
      delayDamagesForTheWorks: formValue ? formValue.delayDamagesForTheWorks : 0,
      insurance: formValue ? formValue.insurance : '',
      advancePayment: formValue ? formValue.advancePayment : 0,
      monthlyPaymentOrMilestone: this.fb.group({
        key: formValue && formValue.monthlyPaymentOrMilestone ? formValue.monthlyPaymentOrMilestone.key : '',
        value: formValue && formValue.monthlyPaymentOrMilestone ? formValue.monthlyPaymentOrMilestone.value : null,
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.monthlyPaymentOrMilestone ? formValue.monthlyPaymentOrMilestone.displayText : ''
      }),
      retentionMoney: formValue ? formValue.retentionMoney : 0,
      specialCondition: formValue ? formValue.specialCondition : ''
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.contractCondition = data;
    // tslint:disable-next-line:max-line-length
    NeedCreateTenderFormComponent.formModel.contractCondition.commencementDate = data.commencementDate ? DateTimeConvertHelper.fromDtObjectToSecon(data.commencementDate) : 0;
  }

}
