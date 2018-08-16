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
@Component({
    selector: 'app-edit',
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {

    package = new PackageModel();
    packageForm: FormGroup;
    formErrors = {
        nameProject: '',
        name: '',
        submitPackageDate: '',
        expectedResultPackageDate: '',
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
        // console.log(this.package);
        // this.packageForm = this.fb.group({
        //     id: this.package.id,
        //     nameProject: [this.package.projectName, Validators.required],
        //     codePackage: [this.package.projectNo, Validators.required],
        //     name: [this.package.opportunityName, Validators.required],
        //     task: [this.package.job, Validators.required],
        //     address: [this.package.place, Validators.required],
        //     zone: [this.package.location],
        //     quarterOfYear: [this.package.quarter, Validators.required],
        //     customer: [this.package.customer],
        //     customerType: this.package.classify,
        //     contact: [this.package.customerContact],
        //     consultingUnit: this.package.consultantUnit,
        //     addressConsultingUnit: this.package.consultantAddress,
        //     phoneConsultingUnit: this.package.consultantPhone,
        //     trackingeStartDate: DateTimeConvertHelper
        //         .fromTimestampToDtObject(this.package.startTrackingDate ? this.package.startTrackingDate * 1000 : 0),
        //     submitPackageDate: [DateTimeConvertHelper
        //         .fromTimestampToDtObject(this.package.submissionDate ? this.package.submissionDate * 1000 : 0), Validators.required],
        //     expectedResultPackageDate: [DateTimeConvertHelper
        //         .fromTimestampToDtObject(this.package.resultEstimatedDate ? this.package.resultEstimatedDate * 1000 : 0),
        //     Validators.required],

        //     acreageFloor: this.package.floorArea,

        //     scale: this.package.magnitude,
        //     buildingProjectType: this.package.projectType,
        //     mainBuildingCategory: this.package.mainBuildingCategory,
        //     roleContractors: this.package.hbcRole,
        //     roleHBC: this.package.hbcRole,
        //     linkDocument: this.package.documentLink,
        //     presideHBC: this.package.hbcChair,
        //     status: this.package.status,
        //     progressMade: this.package.progress,
        //     reasonWinPackage: this.package.acceptanceReason,
        //     reasonLostPackage: this.package.unacceptanceReason,
        //     totalValue: this.package.amount,
        //     // totalTime: this.package.totalTime,
        //     // ratingProject: this.package.ratingProject,
        //     ratingProject: this.package.evaluation,
        //     // note: this.package.note,
        //     startDateProject: DateTimeConvertHelper
        //         .fromTimestampToDtObject(this.package.estimatedProjectStartDate ? this.package.estimatedProjectStartDate * 1000 : 0),
        //     endDateProject: DateTimeConvertHelper
        //         .fromTimestampToDtObject(this.package.estimatedProjectEndDate ? this.package.estimatedProjectEndDate * 1000 : 0),
        //     totalTimeProject: this.package.totalTime,
        //     description: this.package.description,
        // });
        // this.packageForm.valueChanges.subscribe(data =>
        //     this.onFormValueChanged(data)
        // );
        // console.log(this.packageForm);
        // this.onFormValueChanged(data);
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
            this.packageService
                .EditOpportunity(this.packageForm.value)
                .subscribe(result => {
                    // const message = 'Khách hàng đã được tạo.';
                    // this.closed.emit(true);
                    // this.alertService.success(message);
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
        console.log('this.invalidMessages', this.invalidMessages);
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
