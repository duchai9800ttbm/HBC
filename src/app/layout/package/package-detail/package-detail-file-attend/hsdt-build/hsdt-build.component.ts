
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewChecked } from '@angular/core';
import { DialogService } from '../../../../../../../node_modules/@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from './upload-file-hsdt/upload-file-hsdt.component';
import { PackageService } from '../../../../../shared/services/package.service';
import { Route } from '@angular/compiler/src/core';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
// tslint:disable-next-line:import-blacklist
import { Subject, Subscription } from 'rxjs';
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
    // hideActionSiteReport: boolean;
    isShowSideMenu = false;
    isShowMenu = false;
    notShow = false;
    danhSachLoaiTaiLieu;
    routerName;
    isHighlight = 0;
    subscription: Subscription;

    constructor(
        private hoSoDuThauService: HoSoDuThauService,
        private alertService: AlertService,
        private packageService: PackageService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit() {
        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.hoSoDuThauService.watchChangingUpload().subscribe(signal => {
            this.getDanhSachLoaiHoSo(false);
        });
        // setTimeout(() => {
        //     this.packageService.isSummaryConditionForm$.subscribe(data => {
        //         this.isShowMenu = data;
        //     });
        // });
    }

    getDanhSachLoaiHoSo(spinner: boolean) {
        this.packageId = +PackageDetailComponent.packageId;
        this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
            this.danhSachLoaiTaiLieu = res;
            if (spinner) {
                this.spinner.hide();
                this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
            }
        }, err => {
            this.alertService.error('Tải thông tin Loại tài liệu không thành công.');
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
        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.hoSoDuThauService.watchChangingUpload().subscribe(signal => {
            this.spinner.hide();
            this.getDanhSachLoaiHoSo(false);
        });
        this.dtTrigger.next();
    }
    onActivate(event) {
        this.routerName = event.constructor.name;
        // this.hideActionSiteReport = (this.routerName === 'LiveformSiteReportComponent') ? true : false;
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
        this.confirmationService.confirm(
            `Bạn có chắc chắn muốn chốt Hồ sơ dự thầu?`,
            () => {
                this.hoSoDuThauService.chotHoSoDuThau(this.packageId).subscribe(res => {
                    this.alertService.success(`Đã chốt Hồ sơ dự thầu thành công!`);
                    this.spinner.hide();
                    this.refresh();
                }, err => {
                    this.alertService.error(`Đã có lỗi. Chốt Hồ sơ dự thầu không thành công.`);
                });
            }
        );
    }
    emitData(id, checkliveform) {
        if (id !== 21) {
            this.isHighlight = id - 1;
        } else {
            // id loại Hồ Sơ Khác
            this.isHighlight = id - 13;
        }
        if (checkliveform) {
            if (id === 1) {
                this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
            } else {
                this.router.navigate([`/package/detail/${this.packageId}/attend/build/liveformsite`]);
            }
        } else {
            this.hoSoDuThauService.detectChangingRouter(id);
            this.hoSoDuThauService.transporterData(id);
            this.router.navigate([`/package/detail/${this.packageId}/attend/build/uploadform`]);
        }
    }
}
