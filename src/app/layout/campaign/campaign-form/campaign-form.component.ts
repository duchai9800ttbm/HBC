import { Component, OnInit, Input, ChangeDetectorRef } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CampaignModel } from "../../../shared/models/campaign/campaign.model";
import * as moment from "moment";
import {
    DataService,
    SessionService,
    UserNotificationService
} from "../../../shared/services/index";
import { CampaignService } from "../../../shared/services/campaign.service";
import { Observable } from "rxjs/Observable";
import { DictionaryItem } from "../../../shared/models/dictionary-item.model";
import { Router } from "@angular/router";
import { CampaignRequest } from "../../../shared/models/api-request/campaign/campaign-request.model";
import { AlertService } from "../../../shared/services/alert.service";
import ValidationHelper from "../../../shared/helpers/validation.helper";
import { routerTransition } from "../../../router.animations";
import DateTimeConvertHelper from "../../../shared/helpers/datetime-convert-helper";
import { DATETIME_PICKER_CONFIG } from "../../../shared/configs/datepicker.config";
import CustomValidator from "../../../shared/helpers/custom-validator.helper";
@Component({
    selector: "app-campaign-form",
    templateUrl: "./campaign-form.component.html",
    styleUrls: ["./campaign-form.component.scss"],
    animations: [routerTransition()]
})
export class CampaignFormComponent implements OnInit {
    @Input() campaign: CampaignModel;

    isCollapsedMain = false;
    isCollapsedAddress = false;
    isCollapsedDesc = false;

    datePickerConfig = DATETIME_PICKER_CONFIG;
    employeeGroupList: Observable<DictionaryItem[]>;
    employeeList: Observable<DictionaryItem[]>;
    campaignStatus: Observable<DictionaryItem[]>;
    campaignTypes: Observable<DictionaryItem[]>;

    campaignForm: FormGroup;
    isSubmitted: boolean;

    invalidMessages: string[];
    formErrors = {
        name: "",
        numberOfParticipants: ""
    };

    constructor(
        private fb: FormBuilder,
        private dataService: DataService,
        private sessionService: SessionService,
        private campaignService: CampaignService,
        private router: Router,
        private alertService: AlertService,
        private userNotificationService: UserNotificationService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.createForm();
        this.employeeGroupList = this.dataService.getEmployeeGroups();
        this.employeeList = this.dataService.getEmployees();
        this.campaignStatus = this.dataService.getCampaignStatus();
        this.campaignTypes = this.dataService.getCampaignTypes();
    }
    createForm() {
        this.campaignForm = this.fb.group({
            id: this.campaign.id,
            name: [this.campaign.name, CustomValidator.required],
            status: this.campaign.status,
            category: this.campaign.category,
            marketingObject: this.campaign.marketingObject,
            assignTo: [
                (this.campaign.assignTo && this.campaign.assignTo.id) ||
                `employee_${this.sessionService.currentUser.employeeId}`,
                CustomValidator.required
            ],
            campaignDateStart: DateTimeConvertHelper.fromTimestampToDtObject(
                this.campaign.campaignDateStart
            ),
            campaignDateStop: DateTimeConvertHelper.fromTimestampToDtObject(
                this.campaign.campaignDateStop
            ),
            donors: this.campaign.donors,
            target: this.campaign.target,
            numberOfParticipants: [
                this.campaign.numberOfParticipants,
                CustomValidator.probability
            ],
            budget: this.campaign.budget,
            actualCost: this.campaign.actualCost,
            expectedRevenue: this.campaign.expectedRevenue,
            actualRevenue: this.campaign.actualRevenue,
            expectedInvestmentEfficiency: this.campaign
                .expectedInvestmentEfficiency,
            actualInvestmentEfficiency: this.campaign
                .actualInvestmentEfficiency,
            description: this.campaign.description
        });
        this.cdr.detectChanges();
        this.campaignForm.valueChanges.subscribe(data =>
            this.onFormValueChanged(data)
        );
    }

    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.campaignForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
           
        }
    }
}
