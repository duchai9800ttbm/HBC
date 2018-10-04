
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
import { Subject } from 'rxjs';
import { HoSoDuThauService } from '../../../../../shared/services/ho-so-du-thau.service';
import { PagedResult } from '../../../../../shared/models';
import { DATATABLE_CONFIG2 } from '../../../../../shared/configs';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';
@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss']
})
export class HsdtBuildComponent implements OnInit {
    page: number;
    pageSize: number;
    pageIndex: number | string = 0;
    pagedResult: PagedResult<any> = new PagedResult<any>();
    items: PagedResult<ListUserItem>;
    dtOptions: any = DATATABLE_CONFIG2;
    dtTrigger: Subject<any> = new Subject();
    packageId: number;
    hideActionSiteReport: boolean;
    isShowSideMenu = false;
    isShowMenu = false;
    notShow = false;
    danhSachLoaiTaiLieu;

    constructor(
        private hoSoDuThauService: HoSoDuThauService,
        private alertService: AlertService,
        private packageService: PackageService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService,
        private groupUserService: GroupUserService
    ) { }

    ngOnInit() {
        this.getDanhSachLoaiHoSo();
        this.packageId = +PackageDetailComponent.packageId;
        this.packageService.isSummaryConditionForm$.subscribe(data => {
            this.isShowMenu = data;
        });
    }

    getDanhSachLoaiHoSo() {
        this.packageId = +PackageDetailComponent.packageId;
        this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
            this.danhSachLoaiTaiLieu = res;
        });
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
    onActivate(event) {
        this.hideActionSiteReport = (event.constructor.name === 'LiveformSiteReportComponent') ? true : false;
    }
    taiTemplateHSDT() {
        this.hoSoDuThauService.taiTemplateHSDT().subscribe(file => {
        }, err => {
            if (err.json().errorCode) {
                this.alertService.error('File không tồn tại hoặc đã bị xóa!');
            } else {
                this.alertService.error('Đã có lỗi xãy ra. Vui lòng thử lại!');
            }
        });
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
