import { Component, OnInit } from '@angular/core';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { FakePackageData } from '../../../../../shared/fake-data/package-data';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import { Validators, FormBuilder, FormGroup } from '../../../../../../../node_modules/@angular/forms';
import { AlertService, DataService } from '../../../../../shared/services';
import { ActivatedRoute, Router } from '../../../../../../../node_modules/@angular/router';
import { DATETIME_PICKER_CONFIG } from '../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../package-detail.component';
import { PresideHBC } from '../../../../../shared/fake-data/presideHBC';
import { roleContractorsPackage } from '../../../../../shared/fake-data/roleContractors-package';
import { MainBuildingCategoryPackage } from '../../../../../shared/fake-data/mainBuildingCategory-package';
import { BuildingProjectTypePackage } from '../../../../../shared/fake-data/buildingProjectType-package';
import { ClassifyCustomer } from '../../../../../shared/fake-data/classify-customer';
import { QuarterOfYearCreatePackage } from '../../../../../shared/fake-data/quarterOfYear-createPackage';
import { ZoneListPackage } from '../../../../../shared/fake-data/zone-listPackage';
import { PackageModel } from '../../../../../shared/models/package/package.model';
import { StatusListPackage } from '../../../../../shared/fake-data/status-package';
import { PackageService } from '../../../../../shared/services/package.service';
import { Subject, Observable } from '../../../../../../../node_modules/rxjs';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { PackageListItem } from '../../../../../shared/models/package/package-list-item';
import { ObjectInforPackage } from '../../../../../shared/models/package/object-infoPackage';
import { DictionaryItem } from '../../../../../shared/models';
import { PackageEditModel } from '../../../../../shared/models/package/package-edit.model';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { DISABLED } from '@angular/forms/src/model';
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    package = new PackageInfoModel();
    packageForm: FormGroup;
    formErrors = {
        opportunityName: '',
        locationId: '',
        constructionCategoryId: '',
        constructionTypeId: '',
        bidStatusId: ''
    };
    dtTrigger: Subject<any> = new Subject();

    isSubmitted: boolean;
    invalidMessages: string[];
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
    packageId: number;
    contactsSearchResults: DictionaryItem[];
    editPackage: any;

    constructor(
        private fb: FormBuilder,
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private packageService: PackageService,
        private spinner: NgxSpinnerService,
        private dataService: DataService,
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.listZone = this.dataService.getListRegionTypes();
        this.listQuarterOfYear = this.dataService.getListQuatersOfYear();
        this.listCustomerType = this.dataService.getListOpportunityClassifies();
        this.listBuildingProjectType = this.dataService.getListConstructonTypes();
        this.listMainBuildingCategory = this.dataService.getListMainConstructionComponents();
        this.listRoleContractors = this.dataService.getListHBCRoles();
        this.listStatus = this.dataService.getListBidOpportunityStatuses();
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.rerender(result);
            this.createForm();
            this.spinner.hide();
        }, err => {
            this.spinner.hide();
        });
        window.scrollTo(0, 0);
    }

    rerender(result: any) {
        this.package = result;
        this.dtTrigger.next();
    }

    createForm() {
        this.packageForm = this.fb.group({
            id: this.package.id,
            projectName: [this.package.projectName],
            projectNo: [this.package.projectNo],
            opportunityName: [this.package.opportunityName, Validators.required],
            job: [this.package.job],
            place: [this.package.place],
            locationId: [this.package.location && this.package.location.id, Validators.required],
            quarter: [this.package.quarter && this.package.quarter.id],
            customerId: [this.package.customer && this.package.customer.id],
            classify: [this.package.classify],
            customerContactId: [this.package.customerContact && this.package.customerContact.id],
            consultantUnit: [this.package.consultantUnit],
            consultantAddress: [this.package.consultantAddress],
            consultantPhone: [this.package.consultantPhone],
            floorArea: [this.package.floorArea],
            magnitude: [this.package.magnitude],
            constructionTypeId: [this.package.projectType && this.package.projectType.id, Validators.required],
            constructionCategoryId: [this.package.mainBuildingCategory && this.package.mainBuildingCategory.id, Validators.required],
            hbcRole: [this.package.hbcRole ? this.package.hbcRole.id : ''],
            documentLink: [this.package.documentLink],
            chairEmployeeId: [this.package.chairEmployee && this.package.chairEmployee.text],
            bidStatusId: [this.package.status && this.package.status.id, Validators.required],
            amount: [this.package.amount],
            evaluation: [this.package.evaluation],
            startTrackingDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.startTrackingDate
            )],
            submissionDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.submissionDate
            )],
            resultEstimatedDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.resultEstimatedDate
            )],
            projectEstimatedStartDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.projectEstimatedStartDate
            )],
            projectEstimatedEndDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.projectEstimatedEndDate
            )],
            totalTime: [this.package.totalTime],
            description: [this.package.description],
            acceptanceReason: [this.package.acceptanceReason],
            unacceptanceReason: this.package.unacceptanceReason,
            cancelReason: [this.package.cancelReason],
            progress: this.package.progress
        });
        this.packageForm.valueChanges.subscribe(data => {
            this.onFormValueChanged(data);
        });
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
            this.packageService
                .EditOpportunity(this.packageForm.value)
                .subscribe(result => {
                    const message = 'Gói thầu đã chỉnh sửa thành công';
                    this.router.navigate([`/package/detail/${this.package.id}/infomation`]);
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
            }
            );
    }
}
