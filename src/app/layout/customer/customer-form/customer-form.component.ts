import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { DictionaryItem, CustomerModel } from '../../../shared/models/index';
import {
    AlertService,
    DataService,
    CustomerService,
    SessionService
} from '../../../shared/services/index';
import { Router } from '@angular/router';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { DATETIME_PICKER_CONFIG } from '../../../shared/configs/datepicker.config';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';

@Component({
    selector: 'app-customer-form',
    templateUrl: './customer-form.component.html',
    styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
    isCollapsedMain = false;
    isCollapsedAddress = false;
    isCollapsedDesc = false;
    employeeGroupList: Observable<DictionaryItem[]>;
    employeeList: Observable<DictionaryItem[]>;
    customerGroupList: Observable<DictionaryItem[]>;
    lunarBirthdayList: Observable<DictionaryItem[]>;
    prospectSourceList: Observable<DictionaryItem[]>;
    businessList: Observable<DictionaryItem[]>;
    customerClassifyList: Observable<DictionaryItem[]>;
    statusList: Observable<DictionaryItem[]>;
    datePickerConfig = DATETIME_PICKER_CONFIG;
    contactsSearchResults: DictionaryItem[];
    rating: number;
    customerForm: FormGroup;
    @Input() customer: CustomerModel;

    isSubmitted: boolean;

    invalidMessages: string[];
    formErrors = {
        name: '',
        emailOfficial: '',
        emailExtra: '',
        website: '',
        fax: '',
        phoneNumberOfficial: '',
        phoneNumberExtra: '',
        taxCode: '',
        customerType: ''
    };

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private sessionService: SessionService,
        private alertService: AlertService,
        private dataService: DataService,
        private customerService: CustomerService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        this.createForm();
        this.lunarBirthdayList = this.dataService.getlunarBirthday();
        this.dataService.getlunarBirthday().subscribe(result => result);
        this.customerGroupList = this.dataService.getCustomerGroups();
        this.businessList = this.dataService.getBusiness();
        this.customerClassifyList = this.dataService.getCustomerClassifies();
        this.employeeList = this.dataService.getEmployees();
        this.employeeGroupList = this.dataService.getEmployeeGroups();
        this.customerForm.get('contact').patchValue(this.customer.contact);
    }

    createForm() {
        this.rating = this.customer.rating;
        this.customerForm = this.fb.group({
            id: this.customer.id,
            name: [this.customer.name, CustomValidator.required],
            emailOfficial: [
                this.customer.emailOfficial,
                CustomValidator.emailOrEmpty
            ],
            website: [this.customer.website, CustomValidator.website],
            emailExtra: [
                this.customer.emailExtra,
                CustomValidator.emailOrEmpty
            ],
            fax: [this.customer.fax, CustomValidator.faxNumber],
            career: this.customer.career,
            phoneNumberOfficial: [
                this.customer.phoneNumberOfficial,
                [CustomValidator.phoneNumber, Validators.required]
            ],
            group: this.customer.group,
            stockCode: this.customer.stockCode,
            rating: this.customer.rating,
            taxCode: [this.customer.taxCode, CustomValidator.taxNumber],
            type: this.customer.type,
            phoneNumberExtra: [
                this.customer.phoneNumberExtra,
                CustomValidator.phoneNumber
            ],
            revenue: this.customer.revenue,
            assignTo: [
                (this.customer.assignTo && this.customer.assignTo.id) ||
                `employee_${this.sessionService.currentUser.employeeId}`,
                Validators.required
            ],
            address: this.customer.address,
            city: this.customer.city,
            country: this.customer.country,
            district: this.customer.district,
            description: this.customer.description,
            companyEstablishmentDay: DateTimeConvertHelper.fromTimestampToDtObject(
                this.customer.companyEstablishmentDay
            ),
            dob: DateTimeConvertHelper.fromTimestampToDtObject(
                this.customer.dob
            ),
            customerType: [this.customer.customerType, Validators.required],
            contact: {},
            gender: [this.customer.gender],
            lunarBirthday: [this.customer.lunarBirthday]
        });

        this.customerForm.valueChanges.subscribe(data =>
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
            this.customerForm,
            this.formErrors
        );
        return this.invalidMessages.length === 0;
    }

    onRatingChange($event) {
        this.rating = $event.rating;
    }

    submitForm() {
        // rating component cannot using with reactive form, so manually set value
        this.customerForm.get('rating').patchValue(this.rating);
        this.isSubmitted = true;

        if (this.validateForm()) {
            this.customerService
                .createOrUpdate(this.customerForm.value)
                .subscribe(result => {
                    const message = this.customer.id
                        ? 'Khách hàng đã được chỉnh sửa.'
                        : 'Khách hàng đã được tạo.';
                    this.router.navigate([`/customer/detail/${result.id}`]);
                    this.alertService.success(message);
                });
        }
    }
    searchContacts(query) {
        this.dataService
            .searchContacts(query)
            .subscribe(result => (this.contactsSearchResults = result));
    }
}
