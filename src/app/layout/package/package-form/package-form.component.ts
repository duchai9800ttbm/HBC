import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackageModel } from '../../../shared/models/package/package.model';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import { AlertService, DataService, UserService } from '../../../shared/services';
import { ActivatedRoute, Router } from '../../../../../node_modules/@angular/router';
import { DATETIME_PICKER_CONFIG } from '../../../shared/configs/datepicker.config';
import { FakePackageData } from '../../../shared/fake-data/package-data';
import { ZoneListPackage } from '../../../shared/fake-data/zone-listPackage';
import { QuarterOfYearCreatePackage } from '../../../shared/fake-data/quarterOfYear-createPackage';
import { ClassifyCustomer } from '../../../shared/fake-data/classify-customer';
import { BuildingProjectTypePackage } from '../../../shared/fake-data/buildingProjectType-package';
import { MainBuildingCategoryPackage } from '../../../shared/fake-data/mainBuildingCategory-package';
import { roleContractorsPackage } from '../../../shared/fake-data/roleContractors-package';
import { PresideHBC } from '../../../shared/fake-data/presideHBC';
import { StatusListPackage } from '../../../shared/fake-data/status-package';
import { PackageService } from '../../../shared/services/package.service';
import { ObjectInforPackage } from '../../../shared/models/package/object-infoPackage';
import { Observable } from '../../../../../node_modules/rxjs';
import { DictionaryItem } from '../../../shared/models';
import { ScrollToTopService } from '../../../shared/services/scroll-to-top.service';
import { Spinner } from '../../../../../node_modules/primeng/primeng';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';
import CustomValidator from '../../../shared/helpers/custom-validator.helper';
import { UserItemModel } from '../../../shared/models/user/user-item.model';
import { DialogService } from '@progress/kendo-angular-dialog';
import { PopupCreateAssignerComponent } from '../../../shared/components/popup-create-assigner/popup-create-assigner.component';
import { PopupCreateChairComponent } from '../../../shared/components/popup-create-chair/popup-create-chair.component';
@Component({
  selector: 'app-package-form',
  templateUrl: './package-form.component.html',
  styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent implements OnInit {
  @Input() package: PackageModel;
  packageForm: FormGroup;
  formErrors = {
    projectName: '',
    opportunityName: '',
    submissionDate: '',
    resultEstimatedDate: '',
    consultantPhone: ''
  };
  dialogChair;
  dialogAssigner;

  isSubmitted: boolean;
  invalidMessages: string[];
  // listZone: ObjectInforPackage[];
  listZone: Observable<DictionaryItem[]>;
  listQuarterOfYear: Observable<DictionaryItem[]>;
  listCustomerType: Observable<DictionaryItem[]>;
  listBuildingProjectType: Observable<DictionaryItem[]>;
  listMainBuildingCategory: Observable<DictionaryItem[]>;
  listRoleContractors: Observable<DictionaryItem[]>;
  listRoleHBC = [];
  listPresideHBC = PresideHBC;
  listStatus: Observable<DictionaryItem[]>;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  showPopupAdd = false;
  customersSearchResults: any[];
  contactsSearchResults: DictionaryItem[];
  assignSearchResults: DictionaryItem[];
  userListItem: UserItemModel[];

  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private packageService: PackageService,
    private dataService: DataService,
    private scrollToTopService: ScrollToTopService,
    private spinner: NgxSpinnerService,
    private userService: UserService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.userService.getAllUser('').subscribe(data => {
      this.userListItem = data;
    });
    this.listZone = this.dataService.getListRegionTypes();
    this.listQuarterOfYear = this.dataService.getListQuatersOfYear();
    this.listCustomerType = this.dataService.getListOpportunityClassifies();
    this.listBuildingProjectType = this.dataService.getListConstructonTypes();
    this.listMainBuildingCategory = this.dataService.getListMainConstructionComponents();
    this.listRoleContractors = this.dataService.getListHBCRoles();
    this.listStatus = this.dataService.getListBidOpportunityStatuses();
    this.createForm();
    window.scroll(0, 0);
  }

  createForm() {
    this.packageForm = this.fb.group({
      projectName: [this.package.projectName, Validators.required],
      projectNo: [this.package.projectNo, Validators.required],
      opportunityName: [this.package.opportunityName, Validators.required],
      job: this.package.job,
      place: this.package.place,
      location: this.package.location,
      trimester: this.package.trimester,
      customer: this.package.customer,
      classify: this.package.classify,
      customerContact: this.package.customerContact,
      consultantUnit: this.package.consultantUnit,
      consultantAddress: this.package.consultantAddress,
      consultantPhone: [this.package.consultantPhone, CustomValidator.phoneNumber],
      startTrackingDate: DateTimeConvertHelper.fromTimestampToDtObject(this.package.startTrackingDate),
      submissionDate: [DateTimeConvertHelper.fromTimestampToDtObject(this.package.submissionDate), Validators.required],
      resultEstimatedDate: [DateTimeConvertHelper.fromTimestampToDtObject(this.package.resultEstimatedDate), Validators.required],
      floorArea: this.package.floorArea,
      magnitude: this.package.magnitude,
      projectType: this.package.projectType,
      mainBuildingCategory: this.package.mainBuildingCategory,
      hbcRole: this.package.hbcRole,
      documentLink: this.package.documentLink,
      hbcChair: this.package.hbcChair,
      status: this.package.status,
      amount: this.package.amount,
      evaluation: this.package.evaluation,
      estimatedProjectStartDate: DateTimeConvertHelper.fromTimestampToDtObject(this.package.estimatedProjectStartDate),
      estimatedProjectEndDate: DateTimeConvertHelper.fromTimestampToDtObject(this.package.estimatedProjectEndDate),
      totalTime: this.package.totalTime,
      description: this.package.description,
    });
    this.packageForm.valueChanges.subscribe(data => {
      this.onFormValueChanged(data);
    });
  }

  submitForm() {
    this.isSubmitted = true;
    console.log(this.packageForm.value);
    if (this.validateForm()) {
      this.spinner.show();
      this.packageService.createOpportunity(this.packageForm.value).subscribe(response => {
        this.spinner.hide();
        this.router.navigate([`/package/detail/${response.result.bidOpportunityId}`]);
        const message = 'Gói thầu đã được tạo.';
        this.alertService.success(message);
      },
        err => {
          this.spinner.hide();
          const message = 'Đã xảy ra lỗi. Gói thầu không được tạo.';
          this.alertService.success(message);
        });
    }
  }

  onFormValueChanged(data?: any) {
    if (this.isSubmitted) {
      this.validateForm();
    }
  }

  validateForm() {
    this.invalidMessages = ValidationHelper.getInvalidMessages(
      this.packageForm,
      this.formErrors,
    );
    return this.invalidMessages.length === 0;
  }

  addCustomer() {
    this.showPopupAdd = true;
  }

  closePopup(agreed: boolean) {
    this.showPopupAdd = agreed;
  }

  searchContacts(query) {
    this.packageService.getListCustomercontact(query)
      .subscribe(result => {
        this.contactsSearchResults = result;
      });
  }

  searchCustomers(query) {
    this.packageService.getListCustomer(query)
      .subscribe(result => {
        this.customersSearchResults = result;
      });
  }

  searchAssigns(query) {
    this.userService.searchListUser(query)
      .subscribe(result => this.assignSearchResults = result);
  }
  openPopupCreateAssigner() {
    this.dialogAssigner = this.dialogService.open({
      title: 'TẠO MỚI USER',
      content: PopupCreateAssignerComponent,
      width: 600,
      minWidth: 250
    });
    // const saleOrder = this.dialog2.content.instance;
    // saleOrder.saleOrder = this.saleOrder;  
  }

  openPopupCreateChair() {
    this.dialogChair = this.dialogService.open({
      title: 'TẠO MỚI USER',
      content: PopupCreateChairComponent,
      width: 600,
      minWidth: 250
    });
  }
}
