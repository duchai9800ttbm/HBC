import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import ValidationHelper from '../../../../../../shared/helpers/validation.helper';
import { Validators, FormBuilder, FormGroup } from '../../../../../../../../node_modules/@angular/forms';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { DataService } from '../../../../../../shared/services';
import { DictionaryItem } from '../../../../../../shared/models';
import { Observable } from '../../../../../../../../node_modules/rxjs';
import { PackageService } from '../../../../../../shared/services/package.service';

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
  };
  rating = 0;
  isReadonly = false;
  overStar: number;
  invalidMessages: string[];
  datePickerConfig = DATETIME_PICKER_CONFIG;
  listAnnualTurnover = [
    {
      id: 1,
      text: '1,000,000,000',
    },
    {
      id: 2,
      text: '2,000,000,000',
    },
    {
      id: 3,
      text: '3,000,000,000',
    },
    {
      id: 4,
      text: '4,000,000,000',
    }
  ];
  listRoleWithHBC = [
    {
      id: 1,
      text: 'Xây dựng chính',
    },
    {
      id: 2,
      text: 'Hợp tác xây dựng',
    },
    {
      id: 3,
      text: 'Cung cấp vât liệu',
    },
    {
      id: 4,
      text: 'Giám sát & Kiểm định',
    }
  ];
  listStockCode = [
    {
      id: 1,
      text: '12AH531',
    },
    {
      id: 2,
      text: '85UH8460',
    },
    {
      id: 3,
      text: '84PO124',
    },
    {
      id: 4,
      text: '15ID190',
    }
  ];
  listAssignedTo = [
    {
      id: 1,
      text: 'Ban quản lý',
    },
    {
      id: 2,
      text: 'Ban kiểm định',
    },
    {
      id: 3,
      text: 'Ban xây dựng',
    },
    {
      id: 4,
      text: 'Ban quảng cáo',
    }
  ];
  listContact = [
    {
      id: 1,
      text: 'PKT. Nguyễn Thị Xuân',
    },
    {
      id: 2,
      text: 'PGS. Hà Văn Nghị',
    },
    {
      id: 3,
      text: 'PVL. Nguyên Huy Chương',
    },
    {
      id: 4,
      text: 'PTB. Đặng Thu Nguyệt',
    }
  ];
  listCareer: Observable<DictionaryItem[]>;
  listGroup: Observable<DictionaryItem[]>;
  listClassify: Observable<DictionaryItem[]>;
  contactsSearchResults: DictionaryItem[];
  public close(status) {
    this.closed.emit(false);
  }

  constructor(
    private fb: FormBuilder,
    private dateService: DataService,
    private packageService: PackageService,
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
      mainPhone: '',
      listing: '',
      startDateWithHBC: '',
      taxCode: '',
      roleWithHBC: '',
      stockCode: '',
      managementDepartment: '',
      foundingDate: '',
      phoneManagementBoard: '',
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
