import { Component, OnInit, OnChanges, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
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
import * as moment from 'moment';
import { routerTransition } from '../../../router.animations';
import { PresideHBC } from '../../../shared/fake-data/presideHBC';
import { NameProjectListPackage } from '../../../shared/fake-data/nameProject-listPackage';
import { PackageService } from '../../../shared/services/package.service';
import { PackageFilter } from '../../../shared/models/package/package-filter.model';
import { UserItemModel } from '../../../shared/models/user/user-item.model';
import { UserModel } from '../../../shared/models/user/user.model';
import { FieldModel } from '../../../shared/models/package/field.model';
import { LayoutService } from '../../../shared/services/layout.service';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { PackageListItem } from '../../../shared/models/package/package-list-item';
@Component({
    selector: 'app-package-list',
    templateUrl: './package-list.component.html',
    styleUrls: ['./package-list.component.scss'],
    animations: [routerTransition()],
    providers: [NgbDropdownConfig] // add NgbDropdownConfig to the component providers

})
export class PackageListComponent implements OnInit, AfterViewChecked {
    @ViewChild('myDrop') myDrop: ElementRef;
    @ViewChild('myDrop2') myDrop2: ElementRef;
    @ViewChild('DropTool') DropTool: ElementRef;
    @ViewChild('DropTool2') DropTool2: ElementRef;
    activityStatusList: Observable<DictionaryItem[]>;
    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG2;
    // dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    filterModel = new PackageFilter();
    pagedResult: PagedResult<PackageListItem> = new PagedResult<
        PackageListItem
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
    listFieldNomarlized = [];
    sum;
    isManageBidOpportunitys;
    isViewBidOpportunitys;
    isCreateBidOpportunity;
    isDeleteBidOpportunity;
    isEditBidOpportunity;
    isViewBidOpportunityDetail;
    userModel: UserModel;
    listPrivileges = [];
    isToggle = false;
    searchTerm$ = new BehaviorSubject<string>('');
    listPackage = [];
    someRange = [0, 1000000000000];
    someKeyboardConfig: any = {
        behaviour: 'drag',
        connect: true,
        start: [0, 1000000000000],
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
    tenDuAn = false; // ok
    maDuAn = false; // ok
    tenGoithau = false; // ok
    congViec = false; // ok
    diaDiem = false; // ok
    loaiKhachHang = false; // ok
    donViTuVan = false; // ok
    diaChiDVTV = false; // ok
    soDienThoaiDVTV = false; // ok
    quyMo = false; // ok
    quy = false; // ok
    lyDoTrungThau = false; // ok
    lyDoTratThau = false; // ok
    tongThoiGian = false; // ok
    ngayKetThucDuAn = false; // ok
    ngayKhoiCongDuAn = false; // ok
    linkTaiLieu = false; // ok
    vaiTro = false; // ok
    tienDoThucHien = false; // ok
    giaiDoan = false; // ok
    khuVuc = false; // ok
    tenKhachHang = false; // ok
    lienHe = false; // ok
    ngayBatDau = false; // ok
    ngayNhanHoSoMoiThau = false; // ok
    ngayDuKienKetQuaThau = false; // ok
    moTa = false; // ok
    chuTri = false; // ok
    loaiCongTrinh = false; // ok
    hangMucCongTrinh = false; // ok
    tongGiaTri = false; // ok
    danhGiaDuAn = false; // ok
    dienTichSan = false;
    trangThaiGoiThau = false;
    ngayBatDauTheoDoi = false;
    ngayNopHoSoMoiThau = false;
    phanloai = false;
    dientichsan = false;
    lydohuythau = false;
    orderBy = '';
    currentSort = '';
    isShowPopup = false;
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
        private sessionService: SessionService,
        private layoutService: LayoutService,
        private cdRef: ChangeDetectorRef,
        private zone: NgZone,
        config: NgbDropdownConfig
    ) {
        config.autoClose = false;
    }
    get getUserId() {
        return this.sessionService.currentUser.userId;
    }
    @HostListener('document:click', ['$event'])
    public documentClick(event: any): void {
        if (!this.contains(event.target)) {
            this.cancel(this.myDrop);
        }
        if (!this.containsDropTool(event.target)) {
            this.closeDropToll(this.DropTool);
        }
    }

    contains(target: any): boolean {
        return this.myDrop2.nativeElement.contains(target) ||
            (this.myDrop2 ? this.myDrop2.nativeElement.contains(target) : false);
    }

    containsDropTool(target: any): boolean {
        return this.DropTool2.nativeElement.contains(target) ||
            (this.DropTool2 ? this.DropTool2.nativeElement.contains(target) : false);
    }
    ngOnInit() {
        this.filterModel.opportunityClassify = '';
        this.filterModel.stage = '';
        this.filterModel.chairEmployeeId = '';
        this.dtOptions = DATATABLE_CONFIG;
        this.filterModel.minCost = 0;
        this.filterModel.maxCost = 1000000000000;
        this.filterModel.sorting = '';
        window.scrollTo(0, 0);
        this.refreshPopupConfig();
        this.listClassifyCustomer = this.dataService.getListOpportunityClassifies();
        this.listPhasePackage = this.dataService.getListBidOpportunityStages();
        this.userService.getAllUser('').subscribe(data => {
            this.userListItem = data;
        });
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
        // this.packageService
        //     .instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10)
        //     .subscribe(result => {
        //         this.rerender(result);
        //         this.spinner.hide();
        //     }, err => {
        //         this.spinner.hide();
        //     });
        // this.filter(false);
        // this.layoutService.watchLayoutSubject().subscribe(data => {
        //     if (data) {
        //         this.isToggle = true;
        //     } else {
        //         this.isToggle = false;
        //     }
        // });
        this.searchTerm$.debounceTime(600)
        .distinctUntilChanged()
        .subscribe(term => {
            console.log(term);
            this.filter(false);
            // return Observable.create(x => x.next(''));
        });
        // this.dtOptions = {
        //     scrollX:        true,
        //     fixedColumns:   {
        //         leftColumns: 1,
        //         rightColumns: 1
        //     }
        // };
        // this.dtOptions['fixedColumns'] = {
        //     leftColumns: 1,
        //     rightColumns: 1
        // };
        // this.dtOptions['scrollX'] = true;
        // this.dtOptions['scrollCollapse'] = true;

    }
    ngAfterViewChecked() {

    }

    orderByField(fieldName: string) {
        if (fieldName !== this.currentSort) {
            this.currentSort = fieldName;
            this.orderBy = 'NoSort';
        }
        if (fieldName === this.currentSort && this.orderBy === 'NoSort') {
            this.orderBy = 'Asc';
        } else if (fieldName === this.currentSort && this.orderBy === 'Asc') {
            this.orderBy = 'Desc';
        }  else if (fieldName === this.currentSort && this.orderBy === 'Desc') {
            this.orderBy = 'NoSort';
        }
        if ( this.orderBy !== 'NoSort') {
            this.filterModel.sorting = fieldName + this.orderBy;
        } else {
            this.filterModel.sorting = '';
        }
        this.refresh(false);
    }

    refreshPopupConfig() {
        this.packageService.getListFields(this.getUserId).subscribe(data => {
            console.log('data', data);
            this.listField = data;
            this.listFieldNomarlized = [...this.listField].filter(x => x.hidden === true).map(x => x.fieldName);
            this.sum = [...this.listField].filter(x => x.hidden === true).length;
            this.tenDuAn = this.listFieldNomarlized.includes('ARBidOpportunityProjectName');
            this.maDuAn = this.listFieldNomarlized.includes('ARBidOpportunityNo');
            this.tenGoithau = this.listFieldNomarlized.includes('ARBidOpportunityName');
            this.congViec = this.listFieldNomarlized.includes('ARBidOpportunityJob');
            this.maDuAn = this.listFieldNomarlized.includes('ARBidOpportunityNo');
            this.diaDiem = this.listFieldNomarlized.includes('ARBidOpportunityPlace');
            this.loaiKhachHang = this.listFieldNomarlized.includes('ARBidOpportunityCustomerType');
            this.donViTuVan = this.listFieldNomarlized.includes('ARBidOpportunityConsultantUnit');
            this.diaChiDVTV = this.listFieldNomarlized.includes('ARBidOpportunityConsultantAddress');
            this.soDienThoaiDVTV = this.listFieldNomarlized.includes('ARBidOpportunityConsultantPhone');
            this.quyMo = this.listFieldNomarlized.includes('ARBidOpportunityMagnitude');
            this.quy = this.listFieldNomarlized.includes('ARBidOpportunityQuarter');
            this.lyDoTrungThau = this.listFieldNomarlized.includes('ARBidOpportunityAcceptanceReason');
            this.lyDoTratThau = this.listFieldNomarlized.includes('ARBidOpportunityUnacceptanceReason');
            this.tongThoiGian = this.listFieldNomarlized.includes('ARBidOpportunityActualTotalTime');
            this.ngayKetThucDuAn = this.listFieldNomarlized.includes('ARBidOpportunityEstimatedProjectEndDate');
            this.ngayKhoiCongDuAn = this.listFieldNomarlized.includes('ARBidOpportunityEstimatedProjectStartDate');
            this.linkTaiLieu = this.listFieldNomarlized.includes('ARBidOpportunityDocumentLink');

            this.chuTri = this.listFieldNomarlized.includes('ARBidOpportunityHBCChair');
            this.giaiDoan = this.listFieldNomarlized.includes('ARBidOpportunityStage');
            this.tienDoThucHien = this.listFieldNomarlized.includes('ARBidOpportunityProgress');
            this.khuVuc = this.listFieldNomarlized.includes('FK_ARBidLocationID');
            // this.tenKhachHang = this.listFieldNomarlized.includes('FK_HREmployeeID');
            this.tenKhachHang = this.listFieldNomarlized.includes('ARCustomerName');
            this.lienHe = this.listFieldNomarlized.includes('FK_ARCustomerContactID');
            this.ngayBatDauTheoDoi = this.listFieldNomarlized.includes('ARBidOpportunityStartTrackingDate');
            this.ngayNopHoSoMoiThau = this.listFieldNomarlized.includes('ARBidOpportunityBidSubmissionDate');
            this.ngayDuKienKetQuaThau = this.listFieldNomarlized.includes('ARBidOpportunityEstimatedResultDate');
            this.loaiCongTrinh = this.listFieldNomarlized.includes('FK_ARBidConstructionTypeID');
            this.hangMucCongTrinh = this.listFieldNomarlized.includes('FK_ARBidConstructionCategoryID');
            this.vaiTro = this.listFieldNomarlized.includes('ARBidOpportunityHBCChair');
            this.tienDoThucHien = this.listFieldNomarlized.includes('ARBidOpportunityProgress');
            this.giaiDoan = this.listFieldNomarlized.includes('ARBidOpportunityStage');
            this.khuVuc = this.listFieldNomarlized.includes('FK_ARBidLocationID');
            // this.tenKhachHang = this.listFieldNomarlized.includes('FK_HREmployeeID');
            this.lienHe = this.listFieldNomarlized.includes('FK_ARCustomerContactID');
            this.ngayBatDau = this.listFieldNomarlized.includes('ARBidOpportunityStartTrackingDate');
            this.ngayNhanHoSoMoiThau = this.listFieldNomarlized.includes('ARBidOpportunityBidSubmissionDate');
            this.ngayDuKienKetQuaThau = this.listFieldNomarlized.includes('ARBidOpportunityEstimatedResultDate');
            this.moTa = this.listFieldNomarlized.includes('ARBidOpportunityProjectInfo');
            this.chuTri = this.listFieldNomarlized.includes('FK_ChairEmployeeID');
            this.loaiCongTrinh = this.listFieldNomarlized.includes('FK_ARBidConstructionTypeID');
            this.hangMucCongTrinh = this.listFieldNomarlized.includes('FK_ARBidConstructionCategoryID');
            this.tongGiaTri = this.listFieldNomarlized.includes('ARBidOpportunitys');

            this.danhGiaDuAn = this.listFieldNomarlized.includes('ARBidOpportunityEvaluation');
            this.dientichsan = this.listFieldNomarlized.includes('ARBidOpportunityFloorArea');
            this.lydohuythau = this.listFieldNomarlized.includes('ARBidOpportunityCancelReason');
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
        this.filterModel.minCost = 0;
        this.filterModel.maxCost = 1000000000000;
        this.someRange = [0, 1000000000000];
        this.filterModel.sorting = '';
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
        // this.filterModel.sorting = '';
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

    refreshGlobal(displayAlert: boolean = false): void {
        this.filterModel.sorting = '';
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
        // if (!(this.pagedResult.items && this.pagedResult.items.length > 1)
        //     || document.getElementsByClassName('dataTables_empty')[0]) {
        //     document.getElementsByClassName('dataTables_empty')[0].remove();
        // }
        setTimeout(() => {
            this.dtTrigger.next();
            const table = document.getElementById('tableId') as HTMLTableElement;
            table.style.width = 'auto';
        });
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
        this.spinner.show();
        this.packageService.getListFieldsDefault()
            .subscribe(data => {
                this.listField = data;
                this.sum = [...this.listField].filter(x => x.hidden === true).length;
                this.apply(this.myDrop);
                this.spinner.hide();
                this.dtTrigger.next();
            });
    }

    closeDropToll(DropTool) {
        DropTool.close();
    }

    cancel(myDrop) {
        myDrop.close();
        this.packageService.getListFields(this.getUserId).subscribe(data => {
            this.listField = data;
            this.listFieldNomarlized = [...this.listField].filter(x => x.hidden === true).map(x => x.fieldName);
            this.sum = [...this.listField].filter(x => x.hidden === true).length;
            this.tenGoithau = this.listFieldNomarlized.includes('ARBidOpportunityName');
            this.dtTrigger.next();
        });
    }

    apply(myDrop) {
        this.spinner.show();
        this.packageService.updateFieldConfigs(this.listField, this.getUserId)
            .subscribe(result => {
                this.alertService.success('Đã cập nhật cấu hình thành công!');
                this.refresh();

                this.refreshPopupConfig();
                myDrop.close();
                this.spinner.hide();
                this.dtTrigger.next();
            }, err => {
                this.alertService.error('Cập nhật cấu hình thất bại, xin vui lòng thử lại!');
                this.refresh();

                this.refreshPopupConfig();
                myDrop.close();
                this.spinner.hide();

            });
    }

    inputChange() {
        this.sum = [...this.listField].filter(x => x.hidden === true).length;
    }

    inputChange2(id: number) {
        this.listField.forEach(item => {
            if (item.id === id) {
                item.hidden = !item.hidden;
            }
        });
        this.sum = [...this.listField].filter(x => x.hidden === true).length;
    }

    exportFileExcel() {
        this.packageService.exportExcel(this.searchTerm$.value, this.filterModel)
            .subscribe(result => {
                // result;
                this.closeDropToll(this.DropTool);
            });
    }

    chooseAll() {
        this.listField.forEach(x => (x.hidden = true));
        this.sum = [...this.listField].filter(x => x.hidden === true).length;
    }

    openLinkDocument(linkDocument) {
        window.open(linkDocument, '_blank');
    }
}
