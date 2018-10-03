
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from './upload-file-hsdt/upload-file-hsdt.component';
import { PackageService } from '../../../../../shared/services/package.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject } from 'rxjs';
import { HoSoDuThauService } from '../../../../../shared/services/ho-so-du-thau.service';
import { PagedResult } from '../../../../../shared/models';
import { DATATABLE_CONFIG2 } from '../../../../../shared/configs';
import { DanhSachBoHsdtItem } from '../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    bidOpportunityId: number;
    page: number;
    pageSize: number;
    pageIndex: number | string = 0;
    pagedResult: PagedResult<DanhSachBoHsdtItem> = new PagedResult<DanhSachBoHsdtItem>();
    danhSachBoHoSoDuThau;
    dtOptions: any = DATATABLE_CONFIG2;
    dtTrigger: Subject<any> = new Subject();
    dialog;
    packageId: number;
    hideActionSiteReport: boolean;
    isShowSideMenu = false;
    isShowMenu = false;
    notShow = false;
    searchTerm$ = new BehaviorSubject<string>('');
    filterModel = new HsdtFilterModel();
    checkboxSeclectAll: boolean;
    isShowButtonUp: boolean;
    isShowButtonDown: boolean;
    isShowEmpty = false;
    danhSachLoaiTaiLieu;
    constructor(
        private hoSoDuThauService: HoSoDuThauService,
        private dialogService: DialogService,
        private alertService: AlertService,
        private packageService: PackageService,
        private cdr: ChangeDetectorRef,
        private router: Router,
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.packageService.isSummaryConditionForm$.subscribe(data => {
            this.isShowMenu = data;
            this.cdr.detectChanges();
            // this.cdr.detach();
        });
    }

    getDanhSachLoaiHoSo() {
        this.packageId = +PackageDetailComponent.packageId;
        this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
            this.danhSachLoaiTaiLieu = res;
        });
    }
    rerender(pagedResult: any) {
        this.checkboxSeclectAll = false;
        this.pagedResult = pagedResult;
        this.checkButtonUpDown();

    }
    checkButtonUpDown() {
        this.isShowButtonUp = +this.pagedResult.pageCount > (+this.pagedResult.currentPage + 1);
        this.isShowButtonDown = +this.pagedResult.currentPage > 0;
        this.isShowEmpty = !(this.pagedResult.total > 0);
    }

    toggleClick() {
        this.isShowSideMenu = !this.isShowSideMenu;
        $('.toggle-menu-item').toggleClass('resize');
        $('.iconN1').toggleClass('iconN01');
        $('.iconN2').toggleClass('iconN02');
        $('.iconN3').toggleClass('iconN03');
        $('.line').toggleClass('resize');
        $('#toggle-menu-item').toggleClass('hidden');
        $('#toggle-menu-item').toggleClass('resize');
    }


    refresh(): void {
        this.spinner.show();
        this.dtTrigger.next();
        this.spinner.show();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
    }

    showDialogUploadFile(name: string, id: number) {
        this.dialog = this.dialogService.open({
            content: UploadFileHsdtComponent,
            width: 500,
            minWidth: 250
        });
        const instance = this.dialog.content.instance;
        instance.bidOpportunityId = this.packageId;
        instance.nameFile = name;
        instance.idFile = id;
        instance.callBack = this.closePopuup.bind(this);
    }

    closePopuup() {
        this.dialog.close();
        // this.getDanhSachBoHoSo();
    }
    onActivate(event) {
        this.hideActionSiteReport = (event.constructor.name === 'LiveformSiteReportComponent') ? true : false;
    }
    taiTemplateHSDT() {
        this.hoSoDuThauService.taiTemplateHSDT().subscribe();
    }

    chotHSDT(event) {
        const thiss = this;
        this.confirmationService.confirm(
            `Bạn có chắc chắn muốn chốt Hồ sơ dự thầu?`,
            () => {
                this.hoSoDuThauService.chotHoSoDuThau(this.packageId).subscribe(res => {
                    thiss.alertService.success(`Đã chốt Hồ sơ dự thầu thành công!`);
                    this.spinner.hide();
                    thiss.refresh();
                }, err => {
                    thiss.alertService.error(`Đã có lỗi. Chốt Hồ sơ dự thầu không thành công.`);
                });
            }
        );
    }
}
