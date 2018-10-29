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
  // animations: [routerTransition()]
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
    // this.createForm();
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
}
