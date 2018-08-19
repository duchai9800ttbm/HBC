import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { DataService, AlertService, ContactService, SessionService } from '../../../shared/services/index';
import { Observable } from 'rxjs/Observable';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactModel } from '../../../shared/models/index';
import { Router, ActivatedRoute } from '@angular/router';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import { CURRENT_OPTIONS_CONFIG } from '../../../shared/configs/select-dropdown.config';
import { DATETIME_PICKER_CONFIG } from '../../../shared/configs/datepicker.config';
import { CustomerComponent } from '../../customer/customer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactAvatarComponent } from './contact-avatar/contact-avatar.component';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
const defaultAvatarSrc = 'assets/images/no-avatar.png';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss'],

})
export class ContactFormComponent implements OnInit, OnDestroy {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  employeeGroupList: Observable<DictionaryItem[]>;
  customersSearchResults: DictionaryItem[];
  employeeList: Observable<DictionaryItem[]>;
  customerList: Observable<DictionaryItem[]>;
  salutationList: Observable<DictionaryItem[]>;
  prospectSourceList: Observable<DictionaryItem[]>;
  lunarBirthdayList: Observable<DictionaryItem[]>;

  contactId: number;
  contactForm: FormGroup;
  @Input() contact: ContactModel;
  invalidMessages: string[];
  isSubmitted: boolean;
  formErrors = {
    firstName: '',
    lastName: '',
    email: '',
    mobilePhone: '',
    homePhone: '',
    companyPhone: '',
    extraPhone: '',
    assistantPhone: '',
  };

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private sessionService: SessionService,
    private alertService: AlertService,
    private dataService: DataService,
    private contactService: ContactService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
  }
  avatarSrc: string;

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.params.subscribe(params => {
      this.contactId = params.customerItemId;
    });
    this.avatarSrc = defaultAvatarSrc;
    this.createForm();

    this.avatarSrc = this.contact.image ? this.contact.image : defaultAvatarSrc;
    this.salutationList = this.dataService.getSalutations();
    this.customerList = this.dataService.getCustomers();
    this.prospectSourceList = this.dataService.getProspectSources();
    this.employeeList = this.dataService.getEmployees();
    this.employeeGroupList = this.dataService.getEmployeeGroups();
    this.lunarBirthdayList = this.dataService.getlunarBirthday();


    const that = this;

    this.sessionService.getAvatarContact()
      .subscribe(result => {
        that.avatarSrc = result ? `data:image/jpeg;base64,${result}` : defaultAvatarSrc;
      });
  }
  ngOnDestroy() {
    window.localStorage['avatarContact'] = null;
  }

  createForm() {
    this.contactForm = this.fb.group({
      id: this.contact.id,
      salutation: this.contact.salutation,
      firstName: [this.contact.firstName, CustomValidator.required],
      lastName: [this.contact.lastName, CustomValidator.required],
      dateOfBirth: DateTimeConvertHelper.fromTimestampToDtObject(this.contact.dateOfBirth),
      prospectSource: this.contact.prospectSource,
      jobTitle: this.contact.jobTitle,
      department: this.contact.department,
      companyPhone: [this.contact.companyPhone, CustomValidator.phoneNumber],
      mobilePhone: [this.contact.mobilePhone, CustomValidator.phoneNumber],
      homePhone: [this.contact.homePhone, CustomValidator.phoneNumber],
      extraPhone: [this.contact.extraPhone, CustomValidator.phoneNumber],
      email: [this.contact.email, CustomValidator.emailOrEmpty],
      assistant: this.contact.assistant,
      assistantPhone: [this.contact.assistantPhone, CustomValidator.phoneNumber],
      assignTo: [(this.contact.assignTo && this.contact.assignTo.id) || `employee_${this.sessionService.currentUser.employeeId}`
        , CustomValidator.required],
      address: this.contact.address,
      district: this.contact.district,
      city: this.contact.city,
      country: this.contact.country,
      otherAddress: this.contact.otherAddress,
      otherDistrict: this.contact.otherDistrict,
      otherCity: this.contact.otherCity,
      otherCountry: this.contact.otherCountry,
      description: this.contact.description,
      contactImageSrc: this.contact.contactImageSrc,
      image: this.contact.image,
      customer: {},
      gender: this.contact.gender,
      lunarBirthday: this.contact.lunarBirthday
    });
    this.contactForm.get('customer').patchValue(this.contact.customer);
    this.cdr.detectChanges();
    this.contactForm.valueChanges
      .subscribe(data => this.onFormValueChanged(data));
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(this.contactForm, this.formErrors);
    return this.invalidMessages.length === 0;
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const imageBase64 = this.avatarSrc.split(',')[1];
      this.contactService.createOrUpdate(this.contactForm.value, imageBase64).subscribe(result => {
        const message = this.contact.id
          ? 'Liên hệ đã được chỉnh sửa.'
          : 'Liên hệ đã được tạo.';
        if (this.contactId) {
          this.router.navigate([`/customer/detail/${this.contactId}`]);
        } else {
          this.router.navigate([`/contact/detail/${result.id}`]);
        }
        this.alertService.success(message);
      });
    }
  }



  searchCustomers(query) {
    this.dataService.searchCustomers(query).subscribe(result => this.customersSearchResults = result);
  }

  onFileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file = fileList[0];
      if (file.size < 1048576) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          if (e.target.result) {
            this.avatarSrc = e.target.result;
          }
        };
        reader.readAsDataURL(file);
      } else {
        this.alertService.error('Dung lượng ảnh quá lớn! Vui lòng chọn ảnh dưới 1MB.');
      }
    }
  }

  clearAvatar() {
    this.avatarSrc = defaultAvatarSrc;
  }

  openAvatarModal() {
    const modaRef = this.modalService.open(ContactAvatarComponent);
  }
}
