import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem, ProspectModel } from '../../../shared/models';
import { DataService, AlertService, ProspectService, SessionService, CampaignService } from '../../../shared/services/index';
import { Router } from '@angular/router';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { SelectItemWithType } from '../../../shared/models/select-item-with-type';


@Component({
  selector: 'app-prospect-form',
  templateUrl: './prospect-form.component.html',
  styleUrls: ['./prospect-form.component.scss']
})
export class ProspectFormComponent implements OnInit {
  employeeList: Observable<DictionaryItem[]>;
  employeeGroupList: Observable<DictionaryItem[]>;
  assignToList: Observable<DictionaryItem[]>;
  salutationList: Observable<DictionaryItem[]>;
  prospectSourceList: Observable<DictionaryItem[]>;
  businessList: Observable<DictionaryItem[]>;
  evaluationList: Observable<DictionaryItem[]>;
  statusList: Observable<DictionaryItem[]>;
  campaignsSearchResults: DictionaryItem[];
  lunarBirthdayList: Observable<DictionaryItem[]>;

  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;

  @Input() prospect: ProspectModel;

  prospectForm: FormGroup;
  isSubmitted: boolean;
  invalidMessages: string[];
  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    website: '',
    phoneNumberCustomer: '',
    phoneNumberpersonal: '',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private sessionService: SessionService,
    private alertService: AlertService,
    private dataService: DataService,
    private prospectService: ProspectService,
    private cdr: ChangeDetectorRef,
    private campaignService: CampaignService
  ) { }

  ngOnInit() {
    this.createForm();
    this.salutationList = this.dataService.getSalutations();
    this.prospectSourceList = this.dataService.getProspectSources();
    this.businessList = this.dataService.getBusiness();
    this.evaluationList = this.dataService.getProspectEvaluations();
    this.statusList = this.dataService.getProspectStatus();
    this.employeeList = this.dataService.getEmployees();
    this.employeeGroupList = this.dataService.getEmployeeGroups();
    this.lunarBirthdayList = this.dataService.getlunarBirthday();

    this.assignToList = this.dataService.getAssignToItems();
    if (this.prospect && this.prospect.id && this.prospect.objectId) {
      this.campaignService.view(this.prospect.objectId).subscribe(result => {
        this.prospectForm.get('campaign').patchValue({
          id: this.prospect.objectId,
          text: result.name
        });
      });
    }
  }
  createForm() {
    this.prospectForm = this.fb.group({
      id: this.prospect.id,
      name: this.prospect.name,
      revenue: this.prospect.revenue,
      firstName: [this.prospect.firstName, CustomValidator.required],
      phoneNumberCustomer: [this.prospect.phoneNumberCustomer, [CustomValidator.phoneNumber, Validators.required]],
      lastName: [this.prospect.lastName, CustomValidator.required],
      phoneNumberpersonal: [this.prospect.phoneNumberpersonal, CustomValidator.phoneNumber],
      comment: this.prospect.comment,
      email: [this.prospect.email, CustomValidator.emailOrEmpty],
      companyName: this.prospect.companyName,
      website: [this.prospect.website, CustomValidator.website],
      source: this.prospect.source,
      statusSource: this.prospect.statusSource,
      fieldOfAction: this.prospect.fieldOfAction,
      assignTo: [(this.prospect.assignTo && this.prospect.assignTo.id) || `employee_${this.sessionService.currentUser.employeeId}`
        , CustomValidator.required],
      address: this.prospect.address,
      city: this.prospect.city,
      country: this.prospect.country,
      district: this.prospect.district,
      description: this.prospect.description,
      campaign: this.prospect.campaign && {
        id: this.prospect.campaign.id,
        name: this.prospect.campaign.name
      },
      gender: this.prospect.gender,
      lunarBirthday: this.prospect.lunarBirthday
    });
    this.cdr.detectChanges();
    this.prospectForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.prospectForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      this.prospectService.createOrUpdate(this.prospectForm.value).subscribe(result => {
        const message = this.prospect.id
          ? 'Tiềm năng đã được chỉnh sửa.'
          : 'Tiềm năng đã được tạo.';
        this.router.navigate([`/prospect/detail/${result.id}`]);
        this.alertService.success(message);
      }, err => {
        const errors = JSON.parse(err._body);
        if (errors.error_code === 'EXIST_PHONE_NUMBER') {
          this.alertService.error('Số điện thoại này đã tồn tại trong hệ thống, vui lòng nhập số khác');
        }
      });
    }
  }

  searchCampaigns(query) {
    this.dataService.searchCampaigns(query).subscribe(result => this.campaignsSearchResults = result);
  }
}
