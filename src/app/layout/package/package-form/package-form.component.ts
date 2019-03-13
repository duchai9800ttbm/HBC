import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
import { GroupChaired } from '../../../shared/models/package/group-chaired.model';
import { CustomerConsultant } from '../../../shared/models/package/customer-consultant';
@Component({
    selector: 'app-package-form',
    templateUrl: './package-form.component.html',
    styleUrls: ['./package-form.component.scss']
})
export class PackageFormComponent implements OnInit, OnDestroy {
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
    customersSearchResults: CustomerConsultant[];
    consultantSearchResults: CustomerConsultant[];
    contactsSearchResults: DictionaryItem[];
    assignSearchResults: DictionaryItem[];
    userListItem: GroupChaired[];
    dataEvaluation: EvaluationModel[];
    public min: Date = new Date(1917, 0, 1);
    public max: Date = new Date(2000, 11, 31);
    isDisabledButSave = false;
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
        // this.userService.getAllUser('').subscribe(data => {
        //     this.userListItem = data;
        // });
        this.packageService.getListGroupChaired(0, 100, '').subscribe(data => this.userListItem = data.items);
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

    ngOnDestroy() {
        this.isDisabledButSave = false;
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
        if (this.validateForm() && this.validateDate()) {
            this.spinner.show();
            this.isDisabledButSave = true;
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
                        this.isDisabledButSave = false;
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
    // mapNewUser(employeeId) {
    //     this.userService.getAllUser('').subscribe(data => {
    //         this.userListItem = data;
    //         this.packageForm.get('chairEmployeeId').patchValue(employeeId);
    //     });
    // }

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
            }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'));
    }
    searchConsultants(query) {
        this.packageService.getListConsultant(query)
            .subscribe(result => {
                this.consultantSearchResults = result;
            }, err => this.alertService.error('Đã có lỗi. Xin vui lòng thử lại.'));
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

    validateDate(): boolean {
        const startTrackingDate = moment(this.packageForm.get('startTrackingDate').value).unix(); // ngày bắt đầu
        const submissionDate = moment(this.packageForm.get('submissionDate').value).unix(); // ngày nộp hồ sơ mời thầu
        const resultEstimatedDate = moment(this.packageForm.get('resultEstimatedDate').value).unix(); // ngày dự kiến kết quả thầu
        // tslint:disable-next-line:max-line-length
        const projectEstimatedStartDate = moment(this.packageForm.get('projectEstimatedStartDate').value).unix(); // ngày khởi công dự án
        const projectEstimatedEndDate = moment(this.packageForm.get('projectEstimatedEndDate').value).unix(); // ngày kết thúc dự án
        if (startTrackingDate && submissionDate && startTrackingDate > submissionDate) {
            this.alertService.error('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày nộp hồ sơ mời thầu');
            return false;
        } else if (submissionDate && resultEstimatedDate && submissionDate > resultEstimatedDate) {
            this.alertService.error('Ngày nộp hồ sơ mời thầu phải nhỏ hơn hoặc bằng ngày dự kiến kết quả thầu');
            return false;
        } else if (projectEstimatedStartDate && projectEstimatedEndDate && projectEstimatedStartDate > projectEstimatedEndDate) {
            this.alertService.error('Ngày khởi công dự án phải nhỏ hơn hoặc bằng ngày kết thúc dự án');
            return false;
        }
        // else if (resultEstimatedDate && projectEstimatedStartDate && resultEstimatedDate > projectEstimatedStartDate) {
        //     this.alertService.error('Ngày dự kiến kết quả thầu phải nhỏ hơn hoặc bằng ngày khởi công dự án');
        //     return false;
        // }
        return true;
    }
}
