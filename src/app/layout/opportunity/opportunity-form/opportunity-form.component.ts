import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OpportunityModel } from '../../../shared/models/opportunity/opportunity.model';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem } from '../../../shared/models';
import { DataService, SessionService, AlertService, OpportunityService, CustomerService } from '../../../shared/services';
import { CURRENT_OPTIONS_CONFIG } from '../../../shared/configs/select-dropdown.config';
import * as moment from 'moment';
import { Router } from '@angular/router';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import { DATETIME_PICKER_CONFIG } from '../../../shared/configs/datepicker.config';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
@Component({
  selector: 'app-opportunity-form',
  templateUrl: './opportunity-form.component.html',
  styleUrls: ['./opportunity-form.component.scss'],
})
export class OpportunityFormComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;

  customersSearchResults: DictionaryItem[];
  contactsSearchResults: DictionaryItem[];
  campaignsSearchResults: DictionaryItem[];
  employeeGroupList: Observable<DictionaryItem[]>;
  contactList: Observable<DictionaryItem[]>;
  customerList: Observable<DictionaryItem[]>;
  employeeList: Observable<DictionaryItem[]>;
  prospectList: Observable<DictionaryItem[]>;
  opportunityStepList: Observable<DictionaryItem[]>;
  opportunityClassifyList: Observable<DictionaryItem[]>;
  currentOptionsConfig = CURRENT_OPTIONS_CONFIG;
  datePickerConfig = DATETIME_PICKER_CONFIG;

  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private opportunityService: OpportunityService,
    private sessionService: SessionService,
    private router: Router,
    private alertService: AlertService,
    private customerService: CustomerService,

  ) { }

  opportunityForm: FormGroup;
  @Input() opportunity: OpportunityModel;

  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    name: '',
    probability: '',
    expectedValue: '',
    assignTo: '',
  };

  ngOnInit() {
   
    this.createForm();
    this.employeeGroupList = this.dataService.getEmployeeGroups();
    this.contactList = this.dataService.getContacts();
    this.customerList = this.dataService.getCustomers();
    this.employeeList = this.dataService.getEmployees();
    this.prospectList = this.dataService.getProspectSources();
    this.opportunityStepList = this.dataService.getOpportunitySteps();
    this.opportunityClassifyList = this.dataService.getOpportunityClassifies();
    this.opportunityForm.get('contact').patchValue(this.opportunity.contacts);

  }

  createForm() {
    this.opportunityForm = this.fb.group({
      id: this.opportunity.id,
      name: [this.opportunity.name, CustomValidator.required],
      opportunityDateStop: DateTimeConvertHelper.fromTimestampToDtObject(this.opportunity.opportunityDateStop),
      customer: this.opportunity.customer && {
        id: this.opportunity.customer.id,
        text: this.opportunity.customer.name,
      },
      contact: {},
      category: this.opportunity.category,
      prospectSource: this.opportunity.prospectSource,
      // amount: this.opportunity.amount,
      phase: this.opportunity.phase,
      probability: [this.opportunity.probability, CustomValidator.probability],
      campaign: this.opportunity.campaign && {
        id: this.opportunity.campaign.id,
        name: this.opportunity.campaign.name,
      },
      assignTo: [(this.opportunity.assignTo && this.opportunity.assignTo.id) ||
        `employee_${this.sessionService.currentUser.employeeId}`, Validators.required],
      description: this.opportunity.description,
      expectedValue: [this.opportunity.expectedValue, Validators.required]
    });

    this.opportunityForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.opportunityForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      this.opportunityService.createOrUpdate(this.opportunityForm.value).subscribe(result => {
        const message = this.opportunity.id
          ? 'Cơ hội đã được chỉnh sửa.'
          : 'Cơ hội đã được tạo.';
        this.router.navigate([`/opportunity/detail/${result.id}`]);
        this.alertService.success(message);
      });
    }
  }

  searchCustomers(query) {
    this.dataService.searchCustomers(query).subscribe(result => this.customersSearchResults = result);
  }

  searchContacts(query) {
    this.dataService.searchContacts(query).subscribe(result => this.contactsSearchResults = result);
  }

  searchCampaigns(query) {
    this.dataService.searchCampaigns(query).subscribe(result => this.campaignsSearchResults = result);
  }
  selectCustomer() {
    const customer = this.opportunityForm.value.customer;
    const listContactOfCustomer = [];
    this.customerService.getContactListByCustomer(customer.id)
      .subscribe(result => {
        this.opportunityForm.get('contact').patchValue(result);
      });
  }
}
