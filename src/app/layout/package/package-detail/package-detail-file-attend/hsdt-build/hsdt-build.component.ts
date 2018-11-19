
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewChecked, AfterViewInit } from '@angular/core';
import { PackageService } from '../../../../../shared/services/package.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PackageDetailComponent } from '../../package-detail.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
// tslint:disable-next-line:import-blacklist
import { Subject, Subscription, Observable } from 'rxjs';
import { HoSoDuThauService } from '../../../../../shared/services/ho-so-du-thau.service';
import { PagedResult } from '../../../../../shared/models';
import { DATATABLE_CONFIG2 } from '../../../../../shared/configs';
import { ListUserItem } from '../../../../../shared/models/user/user-list-item.model';
import { PackageInfoModel } from '../../../../../shared/models/package/package-info.model';
import { BidStatus } from '../../../../../shared/constants/bid-status';
import { slideToLeft } from '../../../../../router.animations';
import { PermissionService } from '../../../../../shared/services/permission.service';
import { SiteSurveyReportService } from '../../../../../shared/services/site-survey-report.service';
import { PermissionModel } from '../../../../../shared/models/permission/permission.model';
import { DocumentTypeId } from '../../../../../shared/constants/document-type-id';
import { ScrollToTopService } from '../../../../../shared/services/scroll-to-top.service';

import { forkJoin } from 'rxjs/observable/forkJoin';
@Component({
    selector: 'app-hsdt-build',
    templateUrl: './hsdt-build.component.html',
    styleUrls: ['./hsdt-build.component.scss'],
    animations: [slideToLeft()]
})
export class HsdtBuildComponent implements OnInit, AfterViewChecked, OnDestroy {
    page: number;
    pageSize: number;
    pageIndex: number | string = 0;
    pagedResult: PagedResult<any> = new PagedResult<any>();
    items: PagedResult<ListUserItem>;
    dtOptions: any = DATATABLE_CONFIG2;
    dtTrigger: Subject<any> = new Subject();
    packageId: number;
    isShowSideMenu = false;
    isShowMenu = false;
    notShow = false;
    danhSachLoaiTaiLieu;
    routerName;
    isHighlight = 0;
    subscription: Subscription;
    package = new PackageInfoModel();
    bidStatus = BidStatus;
    currentURL;
    checkLiveformRefresh = true;
    idRefresh = 1;

    listTemplateHSDT = [
        {
            id: 0,
            key: 'HuongDanLapHSDT',
            value: 'Hướng dẫn lập hồ sơ dự thầu'
        },
        {
            id: 1,
            key: 'BangTomTatDKDT',
            value: 'Bảng tóm tắt điều kiện dự thầu'
        },
        {
            id: 2,
            key: 'BangDanhSachCungUngThauPhu',
            value: 'Bảng danh sách nhà cung ứng và thầu phụ mời chào giá cho gói thầu'
        },
        {
            id: 3,
            key: 'BaoCaoThamQuanCongTrinh',
            value: 'Báo cáo tham quan công trình'
        },
        {
            id: 5,
            key: 'BangTinhChiPhuChungVaCongTac',
            value: 'Bảng tính chi phí chung và công tác tạm phục vụ thi công'
        },
        {
            id: 6,
            key: 'BangLamRoHSMT',
            value: 'Bảng làm rõ hồ sơ mời thầu'
        },
    ];
    checkTenderSummary: boolean;
    checkSiteSurvey: boolean;
    checkDocFile: boolean;

    listPermission: Array<PermissionModel>;

    listPerTomTatDK = [];
    listPerYeuCauBaoGiaVatTu = [];
    listPerBaoCaoThamQuanCongTrinh = [];
    listPerBangTongHopDuToan = [];
    listPerBangTinhChiPhiChung = [];
    listPerCauHoiLamRo = [];
    listPerCacHSKTCoLienQuan = [];
    listPerHoSoPhapLy = [];
    listPerHoSoKhac = [];

    listPermissionScreen2 = [];

    documentTypeId = DocumentTypeId;
    ChotHSDT = false;

    BangTomTatDKTemplate = false;
    YeuCauBaoGiaVatTuTemplate = false;
    BaoCaoThamQuanCongTrinhTemplate = false;
    BangTinhChiPhiChungTemplate = false;
    BangCauHoiLamRoTemplate = false;

    BangTomTatDKDownload = false;
    YeuCauBaoGiaVatTuDownload = false;
    BaoCaoThamQuanCongTrinhDownload = false;
    BangTongHopDuToanDownload = false;
    BangTinhChiPhiChungDownload = false;
    BangCauHoiLamRoDownload = false;
    CacHSKTCoLienQuanDownload = false;
    HoSoPhapLyDownload = false;
    HoSoKhacDownload = false;

    constructor(
        private hoSoDuThauService: HoSoDuThauService,
        private siteSurveyReportService: SiteSurveyReportService,
        private alertService: AlertService,
        private packageService: PackageService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService,
        private permissionService: PermissionService,
        private scrollTopService: ScrollToTopService
    ) { }

    ngOnInit() {
        this.checkUrl();
        this.scrollTopService.isScrollTop = false;

        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.permissionService.get().subscribe(data => {
            this.listPermission = data;
            const hsdt = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
            if (!hsdt) {
                //   this.listPerTomTatDK = [];
                this.listPerYeuCauBaoGiaVatTu = [];
                //     this.listPerBaoCaoThamQuanCongTrinh = [];
                this.listPerBangTongHopDuToan = [];
                this.listPerBangTinhChiPhiChung = [];
                this.listPerCauHoiLamRo = [];
                this.listPerCacHSKTCoLienQuan = [];
                this.listPerHoSoPhapLy = [];
                this.listPerHoSoKhac = [];
            }
            if (hsdt) {
                const screen = hsdt.userPermissionDetails.length
                    && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauFile')[0];
                if (!screen) {
                    //  this.listPerTomTatDK = [];
                    this.listPerYeuCauBaoGiaVatTu = [];
                    //  this.listPerBaoCaoThamQuanCongTrinh = [];
                    this.listPerBangTongHopDuToan = [];
                    this.listPerBangTinhChiPhiChung = [];
                    this.listPerCauHoiLamRo = [];
                    this.listPerCacHSKTCoLienQuan = [];
                    this.listPerHoSoPhapLy = [];
                    this.listPerHoSoKhac = [];
                }
                if (screen) {
                    this.listPerYeuCauBaoGiaVatTu = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.YeuCauBaoGiaVatTu).map(z => z.value);
                    this.listPerBangTongHopDuToan = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTongHopDuToan).map(z => z.value);
                    this.listPerBangTinhChiPhiChung = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTinhChiPhiChung).map(z => z.value);
                    this.listPerCauHoiLamRo = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangCauHoiLamRo).map(z => z.value);
                    this.listPerCacHSKTCoLienQuan = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.CacHSKTCoLienQuan).map(z => z.value);
                    this.listPerHoSoPhapLy = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.HoSoPhapLy).map(z => z.value);
                    this.listPerHoSoKhac = screen.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.HoSoKhac).map(z => z.value);
                }
            }
            this.YeuCauBaoGiaVatTuTemplate = this.listPerYeuCauBaoGiaVatTu.includes('TaiTemplate');
            this.BangTinhChiPhiChungTemplate = this.listPerBangTinhChiPhiChung.includes('TaiTemplate');
            this.BangCauHoiLamRoTemplate = this.listPerCauHoiLamRo.includes('TaiTemplate');

            this.YeuCauBaoGiaVatTuDownload = this.listPerYeuCauBaoGiaVatTu.includes('DownloadFile');
            this.BangTongHopDuToanDownload = this.listPerBangTongHopDuToan.includes('DownloadFile');
            this.BangTinhChiPhiChungDownload = this.listPerBangTinhChiPhiChung.includes('DownloadFile');
            this.BangCauHoiLamRoDownload = this.listPerCauHoiLamRo.includes('DownloadFile');
            this.CacHSKTCoLienQuanDownload = this.listPerCacHSKTCoLienQuan.includes('DownloadFile');
            this.HoSoPhapLyDownload = this.listPerHoSoPhapLy.includes('DownloadFile');
            this.HoSoKhacDownload = this.listPerHoSoKhac.includes('DownloadFile');


            const hsdt2 = this.listPermission.length &&
                this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
            if (!hsdt2) {
                this.listPermissionScreen2 = [];
            }
            if (hsdt2) {
                const screen2 = hsdt2.userPermissionDetails.length
                    && hsdt2.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauLiveForm')[0];
                if (!screen2) {
                    this.listPermissionScreen2 = [];
                }
                if (screen2) {
                    this.listPermissionScreen2 = screen2.permissions.map(z => z.value);
                    this.listPerTomTatDK = screen2.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTomTatDK).map(z => z.value);
                    this.listPerBaoCaoThamQuanCongTrinh = screen2.permissions
                        .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BaoCaoThamQuanCongTrinh).map(z => z.value);
                }
            }
            this.BangTomTatDKTemplate = this.listPerTomTatDK.includes('TaiTemplate');
            this.BaoCaoThamQuanCongTrinhTemplate = this.listPerBaoCaoThamQuanCongTrinh.includes('TaiTemplate');

            this.BangTomTatDKDownload = this.listPerTomTatDK.includes('XemLiveForm');
            this.BaoCaoThamQuanCongTrinhDownload = this.listPerBaoCaoThamQuanCongTrinh.includes('XemLiveForm');

            this.ChotHSDT = this.listPermissionScreen2.includes('ChotHSDT');
        });

        const changingUpload$ = this.hoSoDuThauService.watchChangingUpload().subscribe(signal => {
            this.getDanhSachLoaiHoSo();
        });
        this.subscription.add(changingUpload$);
        const conditionApproval$ = this.hoSoDuThauService.watchCondition().subscribe(signal => {
            this.checkConditionApproval();
        });
        this.subscription.add(conditionApproval$);
        this.packageService.getInforPackageID(this.packageId).subscribe(result => {
            this.package = result;
            this.hoSoDuThauService.detectStatusPackage(this.package.isChotHoSo);
            // Pass Data to LiveForm
            this.siteSurveyReportService.detectPackageData(result);
        }, err => {
        });
    }
    ngAfterViewChecked() {
        setTimeout(() => {
            this.packageService.isSummaryConditionForm$.subscribe(data => {
                this.isShowMenu = data;
            });
        });
    }
    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    downloadTemplate(typeTemplate) {
        let key = '';
        switch (typeTemplate) {
            case 'HuongDanLapHSDT': {
                key = 'guideline';
                break;
            }
            case 'BangTomTatDKDT': {
                key = 'tenderconditionalsummary';
                break;
            }
            case 'BangDanhSachCungUngThauPhu': {
                key = 'supplier';
                break;
            }
            case 'BaoCaoThamQuanCongTrinh': {
                key = 'tendersitesurveyingreport';
                break;
            }
            case 'BangTinhChiPhuChungVaCongTac': {
                key = 'generalcost';
                break;
            }
            case 'BangLamRoHSMT': {
                key = 'clarification';
                break;
            }
            default: break;
        }
        this.hoSoDuThauService.downloadTemplateHSDT(key).subscribe(() => {
        }, err => {
            if (err.json().errorCode) {
                this.alertService.error('File không tồn tại hoặc đã bị xóa!');
            } else {
                this.alertService.error('Đã có lỗi xãy ra. Vui lòng thử lại!');
            }
        });
    }

    getDanhSachLoaiHoSo() {
        this.packageId = +PackageDetailComponent.packageId;
        this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
            this.danhSachLoaiTaiLieu = res;
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
        this.emitData(this.idRefresh, this.checkLiveformRefresh, true);
        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.hoSoDuThauService.watchChangingUpload().subscribe(signal => {
            this.getDanhSachLoaiHoSo();
        });
        this.dtTrigger.next();
    }

    refresh2(): void {
        this.packageId = +PackageDetailComponent.packageId;
        this.subscription = this.hoSoDuThauService.watchChangingUpload().subscribe(signal => {
            this.getDanhSachLoaiHoSo();
        });
        this.dtTrigger.next();
    }

    onActivate(event) {
        this.routerName = event.constructor.name;
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
    // Check the condition of approval
    checkConditionApproval() {
        this.hoSoDuThauService
            .getFileNoSearch(this.packageId)
            .subscribe(responseResultDocument => {
                const checkDocUpload = responseResultDocument.items;
                this.checkDocFile = checkDocUpload.some(item => item.status == 'Official');
            });
        this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId).subscribe(result => {
            this.checkTenderSummary = (result) ? result.isDraftVersion : true;
        });
        this.siteSurveyReportService.tenderSiteSurveyingReport(this.packageId).subscribe(result => {
            this.checkSiteSurvey = (result) ? result.isDraft : true;
        });
    }
    // End check

    chotHSDT(event) {
        forkJoin(
            this.hoSoDuThauService.getFileNoSearch(this.packageId),
            this.hoSoDuThauService.getInfoTenderConditionalSummary(this.packageId),
            this.siteSurveyReportService.tenderSiteSurveyingReport(this.packageId)
        ).subscribe(([responseResultDocument, tenderConditional, siteSurveying]) => {
            const checkDocUpload = responseResultDocument.items;
            this.checkDocFile = checkDocUpload.some(item => item.status == 'Official');
            this.checkTenderSummary = (tenderConditional) ? tenderConditional.isDraftVersion : true;
            this.checkSiteSurvey = (siteSurveying) ? siteSurveying.isDraft : true;

            if (this.checkDocFile || !this.checkTenderSummary || !this.checkSiteSurvey) {
                this.confirmationService.confirm(
                    `Bạn có chắc chắn muốn chốt Hồ sơ dự thầu?`,
                    () => {
                        this.hoSoDuThauService.chotHoSoDuThau(this.packageId).subscribe(res => {
                            this.alertService.success(`Đã chốt Hồ sơ dự thầu thành công!`);
                            this.spinner.hide();
                            this.packageService.getInforPackageID(this.packageId).subscribe(result => {
                                this.package = result;
                                this.hoSoDuThauService.detectStatusPackage(this.package.isChotHoSo);
                            }, err => {
                            });
                            this.refresh2();
                        }, err => {
                            this.alertService.error(`Đã có lỗi. Chốt Hồ sơ dự thầu không thành công.`);
                        });
                    }
                );
            } else {
                this.alertService.error('Bạn chưa có tài liệu dự thầu chính thức nào.');
            }
        }
        );
    }
    emitData(id, checkliveform, alert?: boolean) {
        this.idRefresh = id;
        this.checkLiveformRefresh = checkliveform;
        if (id !== 21) {
            this.isHighlight = id - 1;
        } else {
            // id loại Hồ Sơ Khác
            this.isHighlight = id - 13;
        }
        if (checkliveform) {
            if (alert) { this.alertService.success('Dữ liệu đã được cập nhật.'); }
            if (id === 1) {
                this.router.navigate([`/package/detail/${this.packageId}/attend/build/summary`]);
            } else {
                this.router.navigate([`/package/detail/${this.packageId}/attend/build/liveformsite`]);
            }
        } else {
            if (alert) { this.alertService.success('Dữ liệu đã được cập nhật.'); }
            this.hoSoDuThauService.detectChangingRouter(id);
            this.hoSoDuThauService.transporterData(id);
            this.router.navigate([`/package/detail/${this.packageId}/attend/build/uploadform`, id]);
        }
    }
    checkUrl() {
        const res = window.location.href.split('/');
        if (res[res.length - 1] === 'summary') {
            return this.isHighlight = 0;
        }
        if (res[res.length - 1] === 'liveformsite') {
            return this.isHighlight = 2;
        } else {
            return this.isHighlight = +res[res.length - 1];
        }
    }
}
