import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SummaryConditionFormComponent } from '../summary-condition-form.component';
import DateTimeConvertHelper from '../../../../../../../../shared/helpers/datetime-convert-helper';

@Component({
    selector: 'app-summary-condition-form-condition-tender',
    templateUrl: './summary-condition-form-condition-tender.component.html',
    styleUrls: ['./summary-condition-form-condition-tender.component.scss']
})
export class SummaryConditionFormConditionTenderComponent implements OnInit {
    conditionTenderForm: FormGroup;
    constructor(private fb: FormBuilder) {}

    ngOnInit() {
        this.createForm();
        this.conditionTenderForm.valueChanges.subscribe(data =>
            this.mappingToLiveFormData(data)
        );
    }

    createForm() {
        const formValue =
            SummaryConditionFormComponent.formModel.jsonTenderCondition;
        this.conditionTenderForm = this.fb.group({
            tenderGuaranteeValue: formValue
                ? formValue.tenderGuaranteeValue
                : 0,
            tenderGuaranteeEfficiency: formValue
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                      formValue.tenderGuaranteeEfficiency
                  )
                : new Date(),
            tenderEfficiency: formValue
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                      formValue.tenderEfficiency
                  )
                : new Date(),
            progressStartDate: formValue
                ? DateTimeConvertHelper.fromTimestampToDtObject(
                      formValue.progressStartDate
                  )
                : new Date(),
            progressComletionDate: formValue
                ? formValue.progressComletionDate
                : 0,
            taxTypes: this.fb.array([]),
            currency: this.fb.group({
                key: '',
                value: '',
                displayText: ''
            })
        });
    }

    mappingToLiveFormData(data) {
        SummaryConditionFormComponent.formModel.jsonTenderCondition = data;
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.jsonTenderCondition.tenderGuaranteeEfficiency = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.tenderGuaranteeEfficiency
        );
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.jsonTenderCondition.tenderEfficiency = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.tenderEfficiency
        );
        // tslint:disable-next-line:max-line-length
        SummaryConditionFormComponent.formModel.jsonTenderCondition.progressStartDate = DateTimeConvertHelper.fromDtObjectToTimestamp(
            data.progressStartDate
        );
    }
}
