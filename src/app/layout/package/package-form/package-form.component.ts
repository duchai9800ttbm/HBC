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
import { UserFormComponent } from './user-form/user-form.component';
import { EvaluationModel } from '../../../shared/models/package/evaluation.model';
import { moment } from '../../../../../node_modules/ngx-bootstrap/chronos/test/chain';
@Component({
    selector: 'app-package-form',
    templateUrl: './package-form.component.html',
    styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent implements OnInit {
    @Input() package: PackageModel;
    packageForm: FormGroup;
    formErrors = {
        opportunityName: '',
        locationId: '',
        constructionCategoryId: '',
        constructionTypeId: '',
        amount: 0,
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
    showPopupAddUser = false;
    customersSearchResults: any[];
    contactsSearchResults: DictionaryItem[];
    assignSearchResults: DictionaryItem[];
    userListItem: UserItemModel[];
    dataEvaluation: EvaluationModel[];
    public min: Date = new Date(1917, 0, 1);
    public max: Date = new Date(2000, 11, 31);
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
        this.getDataEvaluation();

        this.createForm();
        window.scroll(0, 0);
    }

    createForm() {
        this.packageForm = this.fb.group({
            projectName: [this.package.projectName],
            projectNo: [this.package.projectNo],
            opportunityName: [this.package.opportunityName, Validators.required],
            job: [this.package.job],
            place: [this.package.place],
            locationId: [this.package.locationId, Validators.required],
            quarter: [this.package.quarter],
            customerId: [this.package.customerId],
            customerNewOldType: '',
            customerContactId: [this.package.customerContactId],
            consultantUnitCustomerId: [this.package.consultantUnitCustomerId],
            consultantAddress: [this.package.consultantAddress],
            consultantPhone: [this.package.consultantPhone],
            floorArea: [this.package.floorArea],
            magnitude: [this.package.magnitude],
            constructionTypeId: [this.package.constructionTypeId, Validators.required],
            constructionCategoryId: [this.package.constructionCategoryId, Validators.required],
            hbcRole: [this.package.hbcRole],
            documentLink: [this.package.documentLink],
            chairEmployeeId: [this.package.chairEmployeeId],
            //   bidStatusId: [this.package.bidStatusId, Validators.required],
            amount: [this.package.amount, [Validators.required, CustomValidator.totalValue]],
            evaluationId: [this.package.evaluationId],
            startTrackingDate: [this.package.startTrackingDate],
            submissionDate: [this.package.submissionDate],
            resultEstimatedDate: [this.package.resultEstimatedDate],
            projectEstimatedStartDate: [this.package.projectEstimatedStartDate],
            projectEstimatedEndDate: [this.package.projectEstimatedEndDate],
            totalTime: [this.package.totalTime],
            description: [this.package.description]
        });
        this.packageForm.valueChanges.subscribe(data => {
            this.onFormValueChanged(data);
        });
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm()) {
            this.spinner.show();
            this.packageService
                .createOpportunity(this.packageForm.value)
                .subscribe(response => {
                    this.spinner.hide();
                    this.router.navigate([`/package/detail/${response.result.bidOpportunityId}`]);
                    const message = 'Gói thầu đã được tạo.';
                    this.alertService.success(message);
                },
                    err => {
                        this.spinner.hide();
                        const message = 'Đã xảy ra lỗi. Gói thầu không được tạo.';
                        this.alertService.error(message);
                    });
        }
    }

    onFormValueChanged(data?: any) {
        if (this.isSubmitted) {
            this.validateForm();
        }
    }

    calculatedTotalTime() {
        if (this.packageForm.get('projectEstimatedEndDate').value && this.packageForm.get('projectEstimatedStartDate').value) {
            this.packageForm.get('totalTime').patchValue(((this.packageForm.get('projectEstimatedEndDate').value
                - this.packageForm.get('projectEstimatedStartDate').value) / (24 * 3600 * 1000)).toString() + ' ngày');
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
        this.showPopupAdd = false;
        if (agreed) {
            const message = 'Khách hàng đã được tạo.';
            this.alertService.success(message);

        }
    }

    createUser() {
        this.showPopupAddUser = true;
    }

    closePopupAddUser(agreed: boolean) {
        this.showPopupAddUser = false;
        if (agreed) {
            const message = 'Người dùng đã được tạo.';
            this.alertService.success(message);
        }
    }
    mapNewUser(employeeId) {
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
            this.packageForm.get('chairEmployeeId').patchValue(employeeId);
        });
    }

    mapNewCustomer(obj) {
        this.packageForm.get('customerId').patchValue(obj);
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

    customerSelectedChange(e) {
        this.packageForm.get('customerNewOldType').patchValue(e.customerNewOldType);
    }
    changeConsultant(e) {
        this.packageForm.get('consultantAddress').patchValue(e.customerAddress);
        this.packageForm.get('consultantPhone').patchValue(e.customerPhone);
    }

    searchAssigns(query) {
        this.userService.searchListUser(query)
            .subscribe(result => this.assignSearchResults = result);
    }
    getDataEvaluation() {
        this.packageService.getEvaluationValue().subscribe(data => {
            this.dataEvaluation = data;
        });
    }
    // openPopupCreateAssigner() {
    //     this.dialogAssigner = this.dialogService.open({
    //         title: 'TẠO MỚI USER',
    //         content: PopupCreateAssignerComponent,
    //         width: 600,
    //         minWidth: 250
    //     });
    //     // const saleOrder = this.dialog2.content.instance;
    //     // saleOrder.saleOrder = this.saleOrder;
    // }

    // openPopupCreateChair() {
    //     this.dialogChair = this.dialogService.open({
    //         title: 'TẠO MỚI USER',
    //         content: PopupCreateChairComponent,
    //         width: 600,
    //         minWidth: 250
    //     });
    // }

    nextTabIndex(e, nextE: HTMLInputElement) {
        if (e.charCode === 13) {
            nextE.focus();
            e.preventDefault();
        }
    }
}
