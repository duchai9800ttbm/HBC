import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import { Validators, FormBuilder, FormGroup } from '../../../../../../../../node_modules/@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { DataService, UserService, AlertService } from '../../../../../../shared/services';
import { DictionaryItem } from '../../../../../../shared/models';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { PackageService } from '../../../../../../shared/services/package.service';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';
import CustomValidator from '../../../../../../shared/helpers/custom-validator.helper';
import { CustomerModel } from '../../../../../../shared/models/hbc-customer/hbc-customer.model';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
    @Output() closed = new EventEmitter<boolean>();
    @Output() returnCustomer = new EventEmitter<DictionaryItem>();
    customerForm: FormGroup;
    // validate
    formErrors = {
        name: '',
        phone: '',
        manageDepartmentPhone: '',
        email: '',
        taxNumber: '',
        type: '',
        customerContactId: '',
        website: ''
    };
    customer = new CustomerModel();
    rating = 0;
    isReadonly = false;
    overStar: number;
    invalidMessages: string[];
    datePickerConfig = DATETIME_PICKER_CONFIG;
    listCareer: Observable<DictionaryItem[]>;
    listGroup: Observable<DictionaryItem[]>;
    listClassify: Observable<DictionaryItem[]>;
    contactsSearchResults: DictionaryItem[];
    listRoleWithHBC: Observable<DictionaryItem[]>;
    userListItem: UserItemModel[];
    isSubmitted: boolean;

    public close(status) {
        this.closed.emit(false);
    }

    constructor(
        private fb: FormBuilder,
        private packageService: PackageService,
        private dateService: DataService,
        private userService: UserService,
        private alertService: AlertService
    ) { }


    ngOnInit() {
        // danh sach nganh nghe
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
        });
        this.listCareer = this.dateService.getListProspectCustomerBusinesses();
        this.listGroup = this.dateService.getListCustomerGroup();
        this.listClassify = this.dateService.getListCustomerTypes();
        this.listRoleWithHBC = this.dateService.getListHBCRoles();
        this.createForm();

    }

    createForm() {
        this.customerForm = this.fb.group({
            name: [this.customer.name, Validators.required],
            website: this.customer.website,
            email: [this.customer.email, CustomValidator.emailOrEmpty],
            phone: [this.customer.phone, [Validators.required, CustomValidator.phoneNumber]],
            taxNumber: [this.customer.taxNumber, CustomValidator.taxNumber],
            stockCode: [this.customer.stockCode],
            startWorkingFromDate: [this.customer.startWorkingFromDate],
            type: [this.customer.type, Validators.required],
            address: [this.customer.address],
            assignedEmployeeID: [this.customer.assignedEmployeeID],
            customerContactId: [this.customer.customerContactId],
            business: [this.customer.business],
            customerGroup: this.customer.customerGroup,
            // classify: [this.customer.classify],
            evaluate: [this.customer.evaluate],
            revenueDueYear: [this.customer.revenueDueYear],
            establishmentDate: this.customer.establishmentDate,
            description: [this.customer.description],
            isPosted: [this.customer.isPosted],
            role: [this.customer.role],
            manageDepartmentName: [this.customer.manageDepartmentName],
            manageDepartmentPhone: [this.customer.manageDepartmentPhone, CustomValidator.phoneNumber],
            district: [this.customer.district],
            city: [this.customer.city],
            country: [this.customer.country]
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
    submitForm() {
        this.isSubmitted = true;
        // rating component cannot using with reactive form, so manually set value
        this.customerForm.get('evaluate').patchValue(this.rating);
        if (this.validateForm()) {
            this.packageService
                .createCustomer(this.customerForm.value)
                .subscribe(res => {
                    // const message = 'Khách hàng đã được tạo.';
                    const obj = {
                        id: res.customerId,
                        text: res.customerName
                    };
                    this.returnCustomer.emit(obj);
                    this.closed.emit(true);
                    // this.alertService.success(message);
                });
        }

    }

    validateForm() {
        this.invalidMessages = ValidationHelper.getInvalidMessages(
            this.customerForm,
            this.formErrors,
        );
        return this.invalidMessages.length === 0;
    }

    resetStar(): void {
        this.overStar = void 0;
    }

    onRatingChange($event) {
        this.rating = $event.rating;
    }

    searchContacts(query) {
        this.packageService.getListCustomercontact(query)
            .subscribe(result => {
                this.contactsSearchResults = result;
            }
            );
    }
}
