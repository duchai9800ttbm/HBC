import { Component, OnInit, Input } from '@angular/core';
import { routerTransition } from '../../../../router.animations';
import { PackageModel } from '../../../../shared/models/package/package.model';
import { Validators, FormGroup, FormBuilder } from '../../../../../../node_modules/@angular/forms';
import DateTimeConvertHelper from '../../../../shared/helpers/datetime-convert-helper';
import { DATETIME_PICKER_CONFIG } from '../../../../shared/configs/datepicker.config';
import { AlertService } from '../../../../shared/services';
import { ActivatedRoute, Router } from '../../../../../../node_modules/@angular/router';
import { BuildingProjectTypePackage } from '../../../../shared/fake-data/buildingProjectType-package';
import { MainBuildingCategoryPackage } from '../../../../shared/fake-data/mainBuildingCategory-package';
import { roleContractorsPackage } from '../../../../shared/fake-data/roleContractors-package';
import { PresideHBC } from '../../../../shared/fake-data/presideHBC';
import { ClassifyCustomer } from '../../../../shared/fake-data/classify-customer';
import { ZoneListPackage } from '../../../../shared/fake-data/zone-listPackage';
import { QuarterOfYearCreatePackage } from '../../../../shared/fake-data/quarterOfYear-createPackage';
import { FakePackageData } from '../../../../shared/fake-data/package-data';
import ValidationHelper from '../../../../shared/helpers/validation.helper';
import { PackageDetailComponent } from '../package-detail.component';
@Component({
  selector: 'app-package-edit-2',
  templateUrl: './package-edit-2.component.html',
  styleUrls: ['./package-edit-2.component.scss'],
  animations: [routerTransition()]
})
export class PackageEdit2Component implements OnInit {
  package = new PackageModel();
  packageForm: FormGroup;
  formErrors = {
    nameProject: '',
    name: '',
    submitPackageDate: '',
    expectedResultPackageDate: '',
  };
  isSubmitted: boolean;
  invalidMessages: string[];
  listZone = ZoneListPackage;
  listQuarterOfYear = QuarterOfYearCreatePackage;
  listCustomerType = ClassifyCustomer;
  listBuildingProjectType = BuildingProjectTypePackage;
  listMainBuildingCategory = MainBuildingCategoryPackage;
  listRoleContractors = roleContractorsPackage;
  listRoleHBC = [];
  listPresideHBC = PresideHBC;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  showPopupAdd = false;
  packageId: number;
  constructor(
    private fb: FormBuilder,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    window.scrollTo(0, 0);
    this.createForm();
    // console.log('this.datePickerConfig', this.datePickerConfig);
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
      consultantPhone: this.package.consultantPhone,

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
    console.log(this.packageForm);
    // this.onFormValueChanged(data);
  }

  submitForm() {
    this.isSubmitted = true;
    if (this.validateForm()) {
      const message = this.package.id
        ? 'Sự kiện đã được chỉnh sửa.'
        : 'Sự kiện đã được tạo.';
      this.alertService.success(message);
      console.log('TEST this.package.id', this.package.id);
      // this.activatedRoute.params.subscribe(params => console.log('params', params.id, this.package.id));
      if (this.package.id) {
        this.router.navigate([`/package/detail/${this.package.id}`]);
      } else {
        let maxID = FakePackageData[0].id;
        FakePackageData.forEach(i => {
          if (i.id > maxID) {
            maxID = i.id;
          }
        });
        this.router.navigate([`/package/detail/${maxID + 1}`]);
      }
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
    console.log('this.invalidMessages', this.invalidMessages);
    return this.invalidMessages.length === 0;
  }

  addCustomer() {
    this.showPopupAdd = true;
  }

  closePopup(agreed: boolean) {
    this.showPopupAdd = agreed;
  }
}
