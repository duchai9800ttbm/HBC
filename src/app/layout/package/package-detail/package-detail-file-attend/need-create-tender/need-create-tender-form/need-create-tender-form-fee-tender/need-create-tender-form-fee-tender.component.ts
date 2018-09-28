import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NeedCreateTenderFormComponent } from '../need-create-tender-form.component';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { Router } from '../../../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-need-create-tender-form-fee-tender',
  templateUrl: './need-create-tender-form-fee-tender.component.html',
  styleUrls: ['./need-create-tender-form-fee-tender.component.scss']
})
export class NeedCreateTenderFormFeeTenderComponent implements OnInit {

  routerAction: string;
  listCurrency: Array<string> = ['VNĐ', 'USD'];
  currency = 'VNĐ';
  feeTenderForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.routerAction = this.packageService.routerAction;
    this.packageService.routerAction$.subscribe(router => this.routerAction = router);
    this.createForm();
    this.feeTenderForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  createForm() {
    const formValue = NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument;
    this.feeTenderForm = this.fb.group({
      feeOfTenderInvitationDocument: formValue ? formValue.feeOfTenderInvitationDocument : 0,
      feeOfTenderInvitationDocumentCurrency: this.fb.group({
        key: formValue && formValue.feeOfTenderInvitationDocumentCurrency ? formValue.feeOfTenderInvitationDocumentCurrency.key : 'VNĐ',
        value: formValue && formValue.feeOfTenderInvitationDocumentCurrency ? formValue.feeOfTenderInvitationDocumentCurrency.value : 'VNĐ',
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.feeOfTenderInvitationDocumentCurrency ? formValue.feeOfTenderInvitationDocumentCurrency.displayText : 'VNĐ'
      }),
      tenderDocumentDeposit: formValue ? formValue.tenderDocumentDeposit : 0,
      tenderDocumentDepositCurrency: this.fb.group({
        key: formValue && formValue.tenderDocumentDepositCurrency ? formValue.tenderDocumentDepositCurrency.key : 'VNĐ',
        value: formValue && formValue.tenderDocumentDepositCurrency ? formValue.tenderDocumentDepositCurrency.value : 'VNĐ',
        // tslint:disable-next-line:max-line-length
        displayText: formValue && formValue.tenderDocumentDepositCurrency ? formValue.tenderDocumentDepositCurrency.displayText : 'VNĐ'
      })
    });
  }

  mappingToLiveFormData(data) {
    NeedCreateTenderFormComponent.formModel.feeOfTenderInvitationDocument = data;
  }

  routerLink(event) {
    if (event.key === 'Enter') {
      this.router.navigate([`/package/detail/${+PackageDetailComponent.packageId}/attend/create-request/form/create/contract-condition`]);
    }
  }
}
