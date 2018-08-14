import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '../../../../../../node_modules/@angular/forms';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { DATETIME_PICKER_CONFIG } from '../../../../shared/configs/datepicker.config';
import { PackageService } from '../../../../shared/services/package.service';
import { ObjectInforPackage } from '../../../../shared/models/package/object-infoPackage';
import { DictionaryItem } from '../../../../shared/models';
import { Observable } from '../../../../../../node_modules/rxjs';
import { DataService } from '../../../../shared/services';
import CustomValidator from '../../../../shared/helpers/custom-validator.helper';

@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.scss']
})
export class CustomerFormComponent implements OnInit {
  @Output() closed = new EventEmitter<boolean>();
  customerForm: FormGroup;
  formErrors = {
    nameCustomer: '',
    mainPhone: '',
    phoneManagementBoard: '',
  };
  rating = 0;
  isReadonly = false;
  overStar: number;
  invalidMessages: string[];
  datePickerConfig = DATETIME_PICKER_CONFIG;
  listCareer: Observable<DictionaryItem[]>;
  listGroup: Observable<DictionaryItem[]>;
  listClassify: Observable<DictionaryItem[]>;
  contactsSearchResults: DictionaryItem[];
  public close(status) {
    console.log('status', status);
    this.closed.emit(false);
  }

  constructor(
    private fb: FormBuilder,
    private packageService: PackageService,
    private dateService: DataService,
  ) {
    this.createForm();
  }

  ngOnInit() {
    this.listCareer = this.dateService.getListProspectCustomerBusinesses();
    this.listGroup = this.dateService.getListCustomerGroup();
    this.listClassify = this.dateService.getListCustomerTypes();
  }

  createForm() {
    this.customerForm = this.fb.group({
      nameCustomer: ['', Validators.required],
      rating: null,
      website: '',
      annualTurnover: '',
      email: '',
      mainPhone: ['', CustomValidator.phoneNumber],
      listing: '',
      startDateWithHBC: '',
      taxCode: '',
      roleWithHBC: '',
      stockCode: '',
      managementDepartment: '',
      foundingDate: '',
      phoneManagementBoard: ['', CustomValidator.phoneNumber],
      assignedTo: '',
      address: '',
      contact: '',
      county: '',
      career: '',
      city: '',
      group: '',
      nation: '',
      classify: '',
      description: '',
    });
  }

  submitForm() {
    this.validateForm();
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
