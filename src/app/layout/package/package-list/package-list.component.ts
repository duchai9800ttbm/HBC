import { Component, OnInit, OnChanges, AfterViewChecked, ViewChild, ElementRef } from '@angular/core';
import { Observable } from '../../../../../node_modules/rxjs/Observable';
import { DictionaryItem } from '../../../shared/models/dictionary-item.model';
import { Subject } from '../../../../../node_modules/rxjs/Subject';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../shared/configs/datatable.config';
import { ActivityFilter } from '../../../shared/models/activity/activity-filter.model';
import { PagedResult } from '../../../shared/models';
import { ActivityListItem } from '../../../shared/models/activity/activity-list-item.model';
import { DATETIME_PICKER_CONFIG } from '../../../shared/configs/datepicker.config';
import { FormGroup, FormBuilder, Validators } from '../../../../../node_modules/@angular/forms';
import { ActivityService, AlertService, DataService, ConfirmationService, UserService, SessionService } from '../../../shared/services';
import { Router } from '../../../../../node_modules/@angular/router';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService } from '../../../../../node_modules/@ngx-translate/core';
import { DownloadTemplateService } from '../../../shared/services/download-template.service';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';
import { BehaviorSubject } from '../../../../../node_modules/rxjs';
import DateTimeConvertHelper from '../../../shared/helpers/datetime-convert-helper';
import ValidationHelper from '../../../shared/helpers/validation.helper';
import * as moment from 'moment';
import { routerTransition } from '../../../router.animations';
import { FakePackageData } from '../../../shared/fake-data/package-data';
import { ClassifyCustomer } from '../../../shared/fake-data/classify-customer';
import { PhasePackage } from '../../../shared/fake-data/phase-package';
import { PresideHBC } from '../../../shared/fake-data/presideHBC';
import { NameProjectListPackage } from '../../../shared/fake-data/nameProject-listPackage';
import { PackageService } from '../../../shared/services/package.service';
import { PackageFilter } from '../../../shared/models/package/package-filter.model';
import { ObjectInforPackage } from '../../../shared/models/package/object-infoPackage';
import { UserItemModel } from '../../../shared/models/user/user-item.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { FieldModel } from '../../../shared/models/package/field.model';
@Component({
    selector: 'app-package-list',
    templateUrl: './package-list.component.html',
    styleUrls: ['./package-list.component.scss'],
    animations: [routerTransition()]

})
export class PackageListComponent implements OnInit, AfterViewChecked {
    @ViewChild('myDrop') myDrop: ElementRef;
    activityStatusList: Observable<DictionaryItem[]>;
    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG;
    dtTrigger: Subject<any> = new Subject();
    filterModel = new PackageFilter();
    pagedResult: PagedResult<ActivityListItem> = new PagedResult<
        ActivityListItem
        >();
    datePickerConfig = DATETIME_PICKER_CONFIG;
    activityForm: FormGroup;
    formErrors = {
        startDate: '',
        endDate: '',
    };
    min = 0;
    max = 500000000;
    isSubmitted: boolean;
    invalidMessages: string[];
    listClassifyCustomer: Observable<DictionaryItem[]>;
    listPhasePackage: Observable<DictionaryItem[]>;
    listPresideHBC = PresideHBC;
    listNameProjectListPackage = NameProjectListPackage;
    userListItem: UserItemModel[];
    user: UserModel;
    listField: FieldModel[];
    sum;
    isManageBidOpportunitys;
    isViewBidOpportunitys;
    isCreateBidOpportunity;
    isDeleteBidOpportunity;
    isEditBidOpportunity;
    isViewBidOpportunityDetail;
    userModel: UserModel;
    listPrivileges = [];
    constructor(
        private activityService: ActivityService,
        private alertService: AlertService,
        private dataService: DataService,
        private confirmationService: ConfirmationService,
        private router: Router,
        private excelService: ExcelService,
        private translateService: TranslateService,
        private downloadTemplate: DownloadTemplateService,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        private packageService: PackageService,
        private userService: UserService,
        private sessionService: SessionService
    ) { }
    someRange = [1000000, 10000000000];
    someKeyboardConfig: any = {
        behaviour: 'drag',
        connect: true,
        start: [0, 10000000000],
        keyboard: false,  // same as [keyboard]="true"
        // pips: {
        //     mode: 'count',
        //     density: 100,
        //     values: 2,
        //     stepped: true,
        //     format: {
        //         to: value => {
        //             if (value === 0) {
        //                 return '0 đồng';
        //             }
        //             if (value === 10000000000) {
        //                 return '10 tỷ đồng';
        //             }
        //             // return String(parseFloat(parseFloat(String(value)).toFixed(2))
        //             //     .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        //         },
        //         from: value => {
        //             return '10 tỷ';
        //             // return String(parseFloat(parseFloat(String(value)).toFixed(2))
        //             //     .toLocaleString('it-IT', { style: 'currency', currency: 'VND' }));
        //         }
        //     },
        // }
    };
    searchTerm$ = new BehaviorSubject<string>('');
    listPackage = [];
    get getUserId() {
        return this.sessionService.currentUser.userId;

    }
    ngOnInit() {
        window.scrollTo(0, 0);
        this.refreshPopupConfig();
        this.listClassifyCustomer = this.dataService.getListOpportunityClassifies();
        this.listPhasePackage = this.dataService.getListBidOpportunityStages();
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
        });
        this.filterModel.opportunityClassify = '';
        this.filterModel.stage = '';
        this.filterModel.chairEmployeeId = '';
        this.dtOptions = DATATABLE_CONFIG;

        setTimeout(() => {
            this.userModel = this.sessionService.userInfo;
            this.listPrivileges = this.userModel.privileges;
            if (this.listPrivileges) {
                this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
                this.isViewBidOpportunitys = this.listPrivileges.some(x => x === 'ViewBidOpportunitys');
                this.isCreateBidOpportunity = this.listPrivileges.some(x => x === 'CreateBidOpportunity');
                this.isDeleteBidOpportunity = this.listPrivileges.some(x => x === 'DeleteBidOpportunity');
                this.isEditBidOpportunity = this.listPrivileges.some(x => x === 'EditBidOpportunity');
                this.isViewBidOpportunityDetail = this.listPrivileges.some(x => x === 'ViewBidOpportunityDetail');
                if (!this.isManageBidOpportunitys) {
                    this.router.navigate(['/no-permission']);
                }
            }
        }, 300);
        this.spinner.show();
        this.packageService
            .instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10)
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
            }, err => {
                this.spinner.hide();
            });
    }
    ngAfterViewChecked() {

    }

    refreshPopupConfig() {
        this.packageService.getListFields(this.getUserId).subscribe(data => {
            this.listField = data;
            this.sum = [...this.listField].filter(x => x.hidden === true).length;
        });
    }

    changeValueRange(newValue) {
        this.filterModel.minCost = newValue[0];
        this.filterModel.maxCost = newValue[1];
    }


    pagedResultChange(pagedResult: any) {
        this.refresh(false);
    }

    delete(id: number) {
        const that = this;
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa gói thầu này?',
            () => {
                this.packageService.deleteOpportunity(id).subscribe(result => {

                    that.alertService.success('Đã xóa gói thầu!');
                    that.refresh();
                },
                    err => {
                        that.alertService.error('Đã gặp lỗi, chưa xóa được gói thầu!');
                    });
            }
        );
    }

    multiDelete() {
        const deleteIds = this.pagedResult.items
            .filter(x => x.checkboxSelected)
            .map(x => {
                return {
                    id: +x.id,
                    activityType: x.activityType ? x.activityType.toLowerCase() : ''
                };
            });
        if (deleteIds.length === 0) {
            this.alertService.error(
                'Bạn phải chọn ít nhất một đối tượng để xóa!'
            );
        } else {
            //  this.delete(deleteIds);
        }
    }

    filter(clear: boolean = false) {
        this.spinner.show();
        this.packageService
            .filterList(
                this.searchTerm$.value,
                this.filterModel,
                0,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
            }, err => this.spinner.hide());
    }

    clearFilter() {
        this.filterModel = new PackageFilter();
        this.filterModel.opportunityClassify = '';
        this.filterModel.stage = '';
        this.filterModel.chairEmployeeId = '';
        this.filterModel.minCost = null;
        this.filterModel.maxCost = null;
        this.someRange = [0, 10000000000];
        this.filter(true);
    }

    fileChange(event) {
        const fileList: FileList = event.target.files;
        const that = this;
        if (fileList.length > 0) {
            const file = fileList[0];
            this.activityService.importFile(file).subscribe(
                result => {
                    that.refresh();
                    this.alertService.success(
                        'Bạn đã nhập dữ liệu thành công!'
                    );
                },
                err => {
                    this.alertService.error(
                        'Bạn đã nhập dữ liệu thất bại, vui lòng nhập đúng template!'
                    );
                }
            );
        }
    }

    refresh(displayAlert: boolean = false): void {
        this.spinner.show();
        this.packageService
            .filterList(
                this.searchTerm$.value,
                this.filterModel,
                this.pagedResult.currentPage,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.spinner.hide();
                if (displayAlert) {
                    this.alertService.success(
                        'Dữ liệu đã được cập nhật mới nhất'
                    );
                }
            }, err => this.spinner.hide());
    }

    rerender(pagedResult: any) {
        this.checkboxSeclectAll = false;
        this.pagedResult = pagedResult;
        this.dtTrigger.next();
    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x.checkboxSelected = value));
    }

    downTemplate() {
        this.downloadTemplate
            .downloadTemplate('activity')
            .subscribe(result => result);
    }

    to(value) {
        return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }
    from(value) {
        return value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' });
    }


    resetDefaultState() {
        this.packageService.getListFieldsDefault()
            .subscribe(data => {
                this.listField = data;
            });
    }

    cancel(myDrop) {
        this.refreshPopupConfig();
        myDrop.close();
    }

    apply(myDrop) {
        this.packageService.updateFieldConfigs(this.listField, this.getUserId)
            .subscribe(result => {
                this.alertService.success('Đã cập nhật cấu hình thành công!');
                this.refreshPopupConfig();
                myDrop.close();
            }, err => {
                this.alertService.error('Cập nhật cấu hình thất bại, xin vui lòng thử lại!');
                this.refreshPopupConfig();
                myDrop.close();
            });
    }
}
