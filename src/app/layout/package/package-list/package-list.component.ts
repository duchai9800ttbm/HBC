import { Component, OnInit, AfterViewChecked, ViewChild, ElementRef, ChangeDetectorRef, NgZone, HostListener } from '@angular/core';
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
import { AdministeredPackageList } from '../../../shared/constants/administered-package';
import { EvaluationModel } from '../../../shared/models/package/evaluation.model';
import { GroupChaired } from '../../../shared/models/package/group-chaired.model';
@Component({
    selector: 'app-package-list',
    templateUrl: './package-list.component.html',
    styleUrls: ['./package-list.component.scss'],
    // // animations: [routerTransition()],
    providers: [NgbDropdownConfig] // add NgbDropdownConfig to the component providers

})
export class PackageListComponent implements OnInit, AfterViewChecked {
    @ViewChild('myDrop') myDrop: ElementRef;
    @ViewChild('myDrop2') myDrop2: ElementRef;
    @ViewChild('DropTool') DropTool: ElementRef;
    @ViewChild('DropTool2') DropTool2: ElementRef;
    @ViewChild('tablePin') tablePin: ElementRef;
    @ViewChild('fakeScrollBar') fakeScrollBar: ElementRef;

    loading: boolean = false;
    activityStatusList: Observable<DictionaryItem[]>;
    checkboxSeclectAll: boolean;
    dtOptions: any = DATATABLE_CONFIG2;
    // dtOptions: any = {};
    dtTrigger: Subject<any> = new Subject();
    filterModel = new PackageFilter();
    pagedResult: PagedResult<PackageListItem> = new PagedResult<PackageListItem>();
    datePickerConfig = DATETIME_PICKER_CONFIG;
    activityForm: FormGroup;
    formErrors = {
        startDate: '',
        endDate: '',
    };
    min = 0;
    maxValue = 1000000000000;
    isSubmitted: boolean;
    invalidMessages: string[];
    listClassifyCustomer: Observable<DictionaryItem[]>;
    listPhasePackage: Observable<DictionaryItem[]>;
    listPresideHBC = PresideHBC;
    listNameProjectListPackage = NameProjectListPackage;
    userListItem: GroupChaired[];
    user: UserModel;
    listField: FieldModel[];
    listFieldTemp;
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
        keyboard: false,
    };
    tenDuAn = false;
    maDuAn = false;
    tenGoithau = false;
    congViec = false;
    diaDiem = false;
    loaiKhachHang = false;
    donViTuVan = false;
    diaChiDVTV = false;
    soDienThoaiDVTV = false;
    quyMo = false;
    quy = false;
    lyDoTrungThau = false;
    lyDoTratThau = false;
    tongThoiGian = false;
    ngayKetThucDuAn = false;
    ngayKhoiCongDuAn = false;
    linkTaiLieu = false;
    vaiTro = false;
    tienDoThucHien = false;
    giaiDoan = false;
    khuVuc = false;
    tenKhachHang = false;
    lienHe = false;
    ngayBatDau = false;
    ngayNhanHoSoMoiThau = false;
    ngayDuKienKetQuaThau = false;
    moTa = false;
    chuTri = false;
    loaiCongTrinh = false;
    hangMucCongTrinh = false;
    tongGiaTri = false;
    danhGiaDuAn = false;
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
    userProfile: UserModel;
    administeredPackageList = AdministeredPackageList;
    closeMyDrop = true;
    dataEvaluation: EvaluationModel[];
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
        this.dataService.getMaxopporunityamount().subscribe(response => {
            this.maxValue = response;
            this.someRange = [0, this.maxValue];
        });
        this.filterModel.opportunityClassify = '';
        this.filterModel.stage = '';
        this.filterModel.chairEmployeeId = '';
        this.filterModel.evaluation = '';
        this.dtOptions = DATATABLE_CONFIG;
        this.filterModel.minCost = 0;
        this.filterModel.maxCost = 1000000000000;
        this.filterModel.sorting = '';
        window.scrollTo(0, 0);
        this.refreshPopupConfig();
        this.listClassifyCustomer = this.dataService.getListOpportunityClassifies();
        this.listPhasePackage = this.dataService.getListBidOpportunityStages();
        // this.userService.getAllUser('').subscribe(data => {
        //     this.userListItem = data;
        // });
        this.packageService.getListGroupChaired(0, 100, '').subscribe( data => this.userListItem = data.items);
        setTimeout(() => {
            this.userModel = this.sessionService.userInfo;
            this.listPrivileges = this.userModel.privileges;
            if (this.listPrivileges) {
                // this.isManageBidOpportunitys = this.listPrivileges.some(x => x === 'ManageBidOpportunitys');
                this.isManageBidOpportunitys = this.administeredPackageList.some(r => this.listPrivileges.includes(r));
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
        this.loading = true;
        this.searchTerm$.debounceTime(600)
            .distinctUntilChanged()
            .subscribe(term => {
                this.filter(false);
            });
        this.getDataEvaluation();
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
        } else if (fieldName === this.currentSort && this.orderBy === 'Desc') {
            this.orderBy = 'NoSort';
        }
        if (this.orderBy !== 'NoSort') {
            this.filterModel.sorting = fieldName + this.orderBy;
        } else {
            this.filterModel.sorting = '';
        }
        this.refresh(false);
    }

    refreshPopupConfig() {
        this.packageService.getListFields(this.getUserId).subscribe(data => {
            this.listField = data;
            console.log('this.listField-this.listField', this.listField);
            this.listFieldTemp = JSON.parse(JSON.stringify(data));
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
        this.loading = true;
        this.packageService
            .filterList(
                this.searchTerm$.value,
                this.filterModel,
                0,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.loading = false;
            });
    }

    clearFilter() {
        this.filterModel = new PackageFilter();
        this.filterModel.opportunityClassify = '';
        this.filterModel.stage = '';
        this.filterModel.chairEmployeeId = '';
        this.filterModel.evaluation = '';
        this.filterModel.minCost = 0;
        this.filterModel.maxCost = 1000000000000;
        this.someRange = [0, this.maxValue];
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
        this.loading = true;
        this.packageService
            .filterList(
                this.searchTerm$.value,
                this.filterModel,
                this.pagedResult.currentPage,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.loading = false;
                if (displayAlert) {
                    this.alertService.success(
                        'Dữ liệu đã được cập nhật mới nhất'
                    );
                }
            }, err => this.loading = false);
    }

    refreshGlobal(displayAlert: boolean = false): void {
        this.filterModel.sorting = '';
        this.loading = true;
        this.packageService
            .filterList(
                this.searchTerm$.value,
                this.filterModel,
                this.pagedResult.currentPage,
                this.pagedResult.pageSize
            )
            .subscribe(result => {
                this.rerender(result);
                this.loading = false;
                if (displayAlert) {
                    this.alertService.success(
                        'Dữ liệu đã được cập nhật mới nhất'
                    );
                }
            }, err => this.loading = false);
    }

    rerender(pagedResult: any) {
        this.checkboxSeclectAll = false;
        this.pagedResult = pagedResult;
        setTimeout(() => {
            this.dtTrigger.next();
            const table = this.tablePin.nativeElement as HTMLElement;
            const scrollBar = this.fakeScrollBar.nativeElement as HTMLElement;
            scrollBar.style.width = table.offsetWidth + 'px';
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
        this.packageService.getListFieldsDefault()
            .subscribe(data => {
                this.listField = data;
                this.listFieldTemp = JSON.parse(JSON.stringify(data));
                this.sum = [...this.listField].filter(x => x.hidden === true).length;
                this.apply(this.myDrop);
                this.dtTrigger.next();
            });
    }

    closeDropToll(DropTool) {
        DropTool.close();
    }

    renderListField() {

    }

    cancel(myDrop) {
        myDrop.close();
        if (this.listFieldTemp) {
            this.listField = JSON.parse(JSON.stringify(this.listFieldTemp));
            this.listFieldNomarlized = [...this.listField].filter(x => x.hidden === true).map(x => x.fieldName);
            this.sum = [...this.listField].filter(x => x.hidden === true).length;
            this.tenGoithau = this.listFieldNomarlized.includes('ARBidOpportunityName');
            this.dtTrigger.next();
        }
    }

    apply(myDrop) {
        this.closeMyDrop = false;
        this.packageService.updateFieldConfigs(this.listField, this.getUserId)
            .subscribe(result => {
                this.alertService.success('Đã cập nhật cấu hình thành công!');
                this.refresh();
                this.refreshPopupConfig();
                myDrop.close();
                this.dtTrigger.next();
            }, err => {
                this.alertService.error('Cập nhật cấu hình thất bại, xin vui lòng thử lại!');
                this.refresh();

                this.refreshPopupConfig();
                myDrop.close();

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
        this.userProfile = this.sessionService.userInfo;
        this.packageService.exportExcel(this.userProfile.id, this.searchTerm$.value, this.filterModel)
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

    syncScroll1(wrap1: HTMLElement, wrap2: HTMLElement) {
        wrap2.scrollLeft = wrap1.scrollLeft;
    }

    syncScroll2(wrap1: HTMLElement, wrap2: HTMLElement) {
        wrap1.scrollLeft = wrap2.scrollLeft;
    }
    redirectToCRM(detail: string, id: number) {
        if (detail === 'tenKhachHang' || detail === 'donViTuVan') {
            return `http://demo.bys.vn/hbc/crm/#/customer/detail/${id}/overview`;
        }
        if (detail === 'lienHe') {
            return `http://demo.bys.vn/hbc/crm/#/contact/detail/${id}/overview`;
        }
        return null;
    }
    getDataEvaluation() {
        this.packageService.getEvaluationValue().subscribe(data => {
            this.dataEvaluation = data;
            console.log(this.dataEvaluation);
        });
    }
}
