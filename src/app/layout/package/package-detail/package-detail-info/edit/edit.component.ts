import { Component, OnInit } from '@angular/core';
import ValidationHelper from '../../../../../shared/helpers/validation.helper';
import { FakePackageData } from '../../../../../shared/fake-data/package-data';
import DateTimeConvertHelper from '../../../../../shared/helpers/datetime-convert-helper';
import { Validators, FormBuilder, FormGroup } from '../../../../../../../node_modules/@angular/forms';
import { AlertService, DataService, UserService, SessionService } from '../../../../../shared/services';
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
import { UserItemModel } from '../../../../../shared/models/user/user-item.model';
import CustomValidator from '../../../../../shared/helpers/custom-validator.helper';
import { EvaluationModel } from '../../../../../shared/models/package/evaluation.model';
import { moment } from '../../../../../../../node_modules/ngx-bootstrap/chronos/test/chain';
import { GroupChaired } from '../../../../../shared/models/package/group-chaired.model';
import { CustomerConsultant } from '../../../../../shared/models/package/customer-consultant';
import { AdministeredPackageList } from '../../../../../shared/constants/administered-package';
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
        amount: 0,
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
    showPopupAddUser = false;
    packageId: number;
    contactsSearchResults: DictionaryItem[];
    editPackage: any;
    assignSearchResults: DictionaryItem[];
    customersSearchResults: CustomerConsultant[];
    consultantSearchResults: CustomerConsultant[];
    userListItem: GroupChaired[];
    dataEvaluation: EvaluationModel[];
    listPrivileges = [];
    administeredPackageList = AdministeredPackageList;
    isEditBidOpportunity;
    isViewBidOpportunityDetail;
    constructor(
        private fb: FormBuilder,
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private packageService: PackageService,
        private spinner: NgxSpinnerService,
        private dataService: DataService,
        private userService: UserService,
        private sessionService: SessionService
    ) { }

    ngOnInit() {
        this.listPrivileges = this.sessionService.userInfo && this.sessionService.userInfo.privileges;
        if (this.listPrivileges) {
            this.isEditBidOpportunity = this.listPrivileges.some(x => x === 'EditBidOpportunity');
            this.isViewBidOpportunityDetail = this.listPrivileges.some(x => x === 'ViewBidOpportunityDetail');
            if (!this.isEditBidOpportunity) {
                this.router.navigate(['/no-permission']);
            }
        }

        this.getDataEvaluation();
        // this.userService.getAllUser('').subscribe(data => this.userListItem = data);
        this.packageService.getListGroupChaired(0, 100, '').subscribe(data => this.userListItem = data.items);
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
            customerId: this.package.customer,
            customerNewOldType: [this.package.customer && this.package.customer.customerNewOldType],
            customerContactId: [this.package.customerContact],
            consultantUnitCustomerId: [this.package.consultantUnitCustomer],
            consultantAddress: [this.package.consultantAddress],
            consultantPhone: [this.package.consultantPhone],
            floorArea: [this.package.floorArea],
            magnitude: [this.package.magnitude],
            constructionTypeId: [this.package.projectType && this.package.projectType.id, Validators.required],
            constructionCategoryId: [this.package.mainBuildingCategory && this.package.mainBuildingCategory.id, Validators.required],
            hbcRole: [this.package.hbcRole ? this.package.hbcRole.id : ''],
            documentLink: [this.package.documentLink],
            chairEmployeeId: [this.package.chairEmployee && this.package.chairEmployee.id],
            //  bidStatusId: [this.package.status && this.package.status.id, Validators.required],
            amount: [this.package.amount, [Validators.required, CustomValidator.totalValue]],
            evaluationId: [this.package.evaluation && this.package.evaluation.id],
            startTrackingDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.startTrackingDate * 1000
            )],
            submissionDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.submissionDate * 1000
            )],
            resultEstimatedDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.resultEstimatedDate * 1000
            )],
            projectEstimatedStartDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.projectEstimatedStartDate * 1000
            )],
            projectEstimatedEndDate: [DateTimeConvertHelper.fromTimestampToDtObject(
                this.package.projectEstimatedEndDate * 1000
            )],
            totalTime: [this.package.totalTime],
            description: [this.package.description],
            acceptanceReason: [this.package.acceptanceReason],
            unacceptanceReason: this.package.unacceptanceReason,
            cancelReason: [this.package.cancelReason],
            progress: this.package.progress,
            receiveWinResultDate: this.package.receiveWinResultDate,
            receiveLoseResultDate: this.package.receiveLoseResultDate,
            receiveCancelResultDate: this.package.receiveCancelResultDate,
        });
        this.packageForm.valueChanges.subscribe(data => {
            this.onFormValueChanged(data);
        });
    }

    submitForm() {
        this.isSubmitted = true;
        if (this.validateForm() && this.validateDate()) {
            this.packageService
                .EditOpportunity(this.packageForm.value)
                .subscribe(result => {
                    const message = 'Gói thầu đã chỉnh sửa thành công';
                    this.router.navigate([`/package/detail/${this.package.id}/infomation`]);
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
    searchCustomers(query) {
        this.packageService.getListCustomer(query)
            .subscribe(result => {
                this.customersSearchResults = result;
            });
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
    getDataEvaluation() {
        this.packageService.getEvaluationValue().subscribe(data => {
            this.dataEvaluation = data;
        });
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
