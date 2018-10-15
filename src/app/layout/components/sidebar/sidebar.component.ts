import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuditItem, PagedResult } from '../../../shared/models/index';
import {
    AuditService,
    SessionService,
    UserService,
    AlertService
} from '../../../shared/services/index';
import { UserModel } from '../../../shared/models/user/user.model';
import { CallCenterService } from '../../../shared/services/call-center.service';
import { CallCenterHistoryService } from '../../../shared/services/call-center-history.service';
import { slideInOut } from '../../../router.animations';
import { LayoutService } from '../../../shared/services/layout.service';
import { ChangeDactivitites } from '../../../shared/models/side-bar/change-dactivitites.model';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    animations: [slideInOut()],

})
export class SidebarComponent implements OnInit {
    isActive = false;
    showMenu = '';
    dem = 0;
    avatarSrc: string;
    listPhoneNumber = [];
    listPhoneNumberHistory = [];
    listPhoneNumberHistoryAway = [];
    audits$: Observable<AuditItem[]>;
    audits: any[];
    pagedResult: PagedResult<ChangeDactivitites> = new PagedResult<ChangeDactivitites>();
    @Input() state;

    constructor(
        private auditService: AuditService,
        private sessionService: SessionService,
        private userService: UserService,
        private callCenter: CallCenterService,
        private callCenterHistory: CallCenterHistoryService,
        private layoutService: LayoutService,
        private alertService: AlertService
    ) { }
    isCollapsedCall = false;
    isCollapsedCallAway = true;
    isCollapsedAudit = false;
    userInfo: UserModel;
    showSidebarContent = false;
    @Output() emitPhoneCall: EventEmitter<string> = new EventEmitter<string>();
    @Output()
    emitPhoneStatus: EventEmitter<string> = new EventEmitter<string>();
    @Output() listPhoneCall: EventEmitter<any> = new EventEmitter<any>();
    @Output() toggleMenuFromSidebar: EventEmitter<any> = new EventEmitter<any>();
    ngOnInit(): void {
        // this.auditService.getAudits(0, 5).subscribe(pagedResult => {
        //     this.pagedResult = pagedResult;
        //     this.audits = pagedResult.items;
        //     this.audits.forEach(element => {
        //         if (element.id) {
        //             this.userService
        //                 .getAvatarByUserId(element.id)
        //                 .subscribe(result => {
        //                     element.avatar = result.avatar
        //                         ? `data:image/jpeg;base64,${result.avatar}`
        //                         : null;
        //                 });
        //         } else {
        //             element.avatar = null;
        //         }
        //     });
        // });

        // IntervalObservable.create(3000).subscribe(() => {
        //     this.getListPhoneNumberIsCall();
        //     this.getListPhoneCallAway();
        // });
        this.getDataChangeRecently();
    }
    toggleSidebar() {
        const width = document.getElementById('sidebar').offsetWidth;
        const widthScreen = window.screen.width;
        if (widthScreen > 992) {
            if (width === 55) {
                this.toggleMenuFromSidebar.emit(false);
                this.layoutService.emitEvent(false);
                this.showSidebarContent = false;

            } if (width === 200) {
                this.toggleMenuFromSidebar.emit(true);
                this.layoutService.emitEvent(true);
                this.showSidebarContent = true;
                document.getElementById('logo').setAttribute('Width', '200');
            }
        }

    }

    onResize(e) {
        const width = document.getElementById('sidebar').offsetWidth;
        if (width < 200) {
            // document.getElementById('logo').setAttribute('Width', '55');
            // this.toggleMenuFromSidebar.emit(false);
            this.layoutService.emitEvent(true);
            // this.showSidebarContent = false;
        }
        if (width === 200) {
            // this.toggleMenuFromSidebar.emit(true);
            this.layoutService.emitEvent(false);
            // this.showSidebarContent = true;
            // document.getElementById('logo').setAttribute('Width', '200');
        }
    }
    getDataChangeRecently() {
        this.layoutService.getDataChangeRecently(0, 5).subscribe(data => {
            this.pagedResult = data;
        }, err => {
            this.alertService.error('Đã có lỗi khi tải nội dung thay đổi gần đây!');
        });
    }
    renderDataChangeRecently(action: string, target?: string, data?: any) {
        let resultpackage = '';
        if (data) {
            if (!data.acceptanceReason) {
                resultpackage = 'Trúng thầu';
            } else {
                if (!data.unacceptanceReason) {
                    resultpackage = 'Trật thầu';
                } else {
                    resultpackage = 'Hủy thầu';
                }
            }
        }

        switch (action) {
            case 'Delete': {
                switch (target) {
                    case 'LyDoTrungthau': return 'vừa xóa lý do trúng thầu';
                    case 'LyDoTratThau': return 'vừa xóa lý do trật thầu';
                    case 'LyDoHuyThau': return 'vừa xóa lý do huỷ thầu';
                    case 'KhuVuc': return 'vừa xóa khu vực';
                    case 'LoaiCongTrinh': return 'vừa xóa loại công trình';
                    case 'HangMucThiCongCongTrinh': return 'vừa xóa hạng mục công trình';
                    case 'ViTriChucVu': return 'vừa xóa vị trí/chức vụ';
                    case 'NhomNguoiDung': return 'vừa xóa nhóm người dùng';
                    case 'NguoiDung': return 'vừa xóa người dùng';
                    case 'GoiThau': return 'vừa xóa gói thầu';
                    case 'HSMT': return 'vừa upload HSMT ở gói thầu';
                    case 'DeNghiDuThau': return 'vừa xóa Đề nghị dự thầu ở gói thầu';
                    case 'BangTomTatDKDT': return 'vừa xóa Bảng tóm tắt ĐKDT ở gói thầu';
                    case 'YCBGVatTuThauPhu': return 'vừa upload YC BG vật tư, thầu phụ ở gói thầu';
                    case 'BaoCaoThamQuanCT': return 'vừa xóa Báo cáo tham quan CT ở gói thầu';
                    case 'BangTongHopDuToan': return 'vừa upload BOQ ở gói thầu';
                    case 'BangTinhChiPhiChung': return 'vừa upload Chi phí chung ở gói thầu';
                    case 'BangCauHoiLamRoHSMT': return 'vừa upload Bảng câu hỏi ở gói thầu';
                    case 'CacHKTCoLienQuan': return 'vừa upload HSKT ở gói thầu';
                    case 'HoSoPhapLy': return 'vừa upload HSPL ở gói thầu';
                    case 'HoSoKhac': return 'vừa upload Hồ sơ khác ở gói thầu';
                    case 'TrinhDuyetGia': return 'vừa xóa Trình duyệt giá ở gói thầu';
                    case 'LoiMoiPhongVan': return 'vừa xóa lời mời phỏng vấn ở gói thầu';
                    case 'BienBanPhongVan': return 'vừa upload biên bản phỏng vấn lần ở gói thầu';
                    case 'KetQuaDuThau': return 'vừa upload kết quả dự thầu cho gói thầu';
                    case 'HopDongKyKet': return 'vừa upload hợp đồng ký kết cho gói thầu';
                    case 'BienBanCuocHop': return 'vừa upload biên bản cuộc họp của gói thầu';
                    case 'FilePresentation': return 'vừa upload file presentation của gói thầu';
                }
                break;
            }
            case 'Edit': {
                switch (target) {
                    case 'LyDoTrungthau': return 'vừa chỉnh sửa lý do trúng thầu';
                    case 'LyDoTratThau': return 'vừa chỉnh sửa lý do trật thầu';
                    case 'LyDoHuyThau': return 'vừa chỉnh sửa lý do huỷ thầu';
                    case 'KhuVuc': return 'vừa chỉnh sửa khu vực';
                    case 'LoaiCongTrinh': return 'vừa chỉnh sửa loại công trình';
                    case 'HangMucThiCongCongTrinh': return 'vừa chỉnh sửa hạng mục công trình';
                    case 'ViTriChucVu': return 'vừa chỉnh sửa vị trí/chức vụ';
                    case 'NhomNguoiDung': return 'vừa chỉnh sửa nhóm người dùng';
                    case 'NguoiDung': return 'vừa chỉnh sửa người dùng';
                    case 'GoiThau': return 'vừa chỉnh sửa gói thầu';
                    case 'HSMT': return 'vừa upload HSMT ở gói thầu';
                    case 'DeNghiDuThau': return 'vừa chỉnh sửa Đề nghị dự thầu ở gói thầu';
                    case 'BangTomTatDKDT': return 'vừa chỉnh sửa Bảng tóm tắt ĐKDT ở gói thầu';
                    case 'YCBGVatTuThauPhu': return 'vừa upload YC BG vật tư, thầu phụ ở gói thầu';
                    case 'BaoCaoThamQuanCT': return 'vừa chỉnh sửa Báo cáo tham quan CT ở gói thầu';
                    case 'BangTongHopDuToan': return 'vừa upload BOQ ở gói thầu';
                    case 'BangTinhChiPhiChung': return 'vừa upload Chi phí chung ở gói thầu';
                    case 'BangCauHoiLamRoHSMT': return 'vừa upload Bảng câu hỏi ở gói thầu';
                    case 'CacHKTCoLienQuan': return 'vừa upload HSKT ở gói thầu';
                    case 'HoSoPhapLy': return 'vừa upload HSPL ở gói thầu';
                    case 'HoSoKhac': return 'vừa upload Hồ sơ khác ở gói thầu';
                    case 'TrinhDuyetGia': return 'vừa chỉnh sửa Trình duyệt giá ở gói thầu';
                    case 'LoiMoiPhongVan': return 'vừa chỉnh sửa lời mời phỏng vấn ở gói thầu';
                    case 'BienBanPhongVan': return 'vừa upload biên bản phỏng vấn lần ở gói thầu';
                    case 'KetQuaDuThau': return 'vừa upload kết quả dự thầu cho gói thầu';
                    case 'HopDongKyKet': return 'vừa upload hợp đồng ký kết cho gói thầu';
                    case 'BienBanCuocHop': return 'vừa upload biên bản cuộc họp của gói thầu';
                    case 'FilePresentation': return 'vừa upload file presentation của gói thầu';
                }
                break;
            }
            case 'Create': {
                switch (target) {
                    case 'LyDoTrungthau': return 'vừa tạo mới lý do trúng thầu';
                    case 'LyDoTratThau': return 'vừa tạo mới lý do trật thầu';
                    case 'LyDoHuyThau': return 'vừa tạo mới lý do huỷ thầu';
                    case 'KhuVuc': return 'vừa tạo mới khu vực';
                    case 'LoaiCongTrinh': return 'vừa tạo mới loại công trình';
                    case 'HangMucThiCongCongTrinh': return 'vừa tạo mới hạng mục công trình';
                    case 'ViTriChucVu': return 'vừa tạo mới vị trí/chức vụ';
                    case 'NhomNguoiDung': return 'vừa tạo mới nhóm người dùng';
                    case 'NguoiDung': return 'vừa tạo mới người dùng';
                    case 'GoiThau': return 'vừa tạo mới gói thầu';
                    case 'HSMT': return 'vừa upload HSMT ở gói thầu';
                    case 'DeNghiDuThau': return 'vừa tạo mới Đề nghị dự thầu ở gói thầu';
                    case 'BangTomTatDKDT': return 'vừa tạo mới Bảng tóm tắt ĐKDT ở gói thầu';
                    case 'YCBGVatTuThauPhu': return 'vừa upload YC BG vật tư, thầu phụ ở gói thầu';
                    case 'BaoCaoThamQuanCT': return 'vừa tạo mới Báo cáo tham quan CT ở gói thầu';
                    case 'BangTongHopDuToan': return 'vừa upload BOQ ở gói thầu';
                    case 'BangTinhChiPhiChung': return 'vừa upload Chi phí chung ở gói thầu';
                    case 'BangCauHoiLamRoHSMT': return 'vừa upload Bảng câu hỏi ở gói thầu';
                    case 'CacHKTCoLienQuan': return 'vừa upload HSKT ở gói thầu';
                    case 'HoSoPhapLy': return 'vừa upload HSPL ở gói thầu';
                    case 'HoSoKhac': return 'vừa upload Hồ sơ khác ở gói thầu';
                    case 'TrinhDuyetGia': return 'vừa tạo mới Trình duyệt giá ở gói thầu';
                    case 'LoiMoiPhongVan': return 'vừa tạo mới lời mời phỏng vấn ở gói thầu';
                    case 'BienBanPhongVan': return 'vừa upload biên bản phỏng vấn lần ở gói thầu';
                    case 'KetQuaDuThau': return 'vừa upload kết quả dự thầu cho gói thầu';
                    case 'HopDongKyKet': return 'vừa upload hợp đồng ký kết cho gói thầu';
                    case 'BienBanCuocHop': return 'vừa upload biên bản cuộc họp của gói thầu';
                    case 'FilePresentation': return 'vừa upload file presentation của gói thầu';
                }
                break;
            }
            case 'XacNhanDaDu': {
                switch (target) {
                    case 'DaDuHSMT': return 'vừa xác nhận đã đủ HSMT ở gói thầu';
                }
                break;
            }
            case 'GuiDuyet': {
                switch (target) {
                    case 'DeNghiDuThau': return 'vừa gửi duyệt Đề nghị dự thầu ở gói thầu';
                }
                break;
            }
            case 'ChapThuanKhongChapThuan': {
                switch (target) {
                    case 'DeNghiDuThau': return 'đã xem xét Đề nghị dự thầu ở gói thầu';
                }
                break;
            }
            case 'ThongBaoTrienKhai': {
                switch (target) {
                    case 'TrienKhaiVaPhanCongTienDo': return 'vừa thông báo triển khai cho gói thầu';
                }
                break;
            }
            case 'XacNhan': {
                switch (target) {
                    case 'PhanCongTienDo': return 'vừa phân công tiến độ cho gói thầu';
                }

                break;
            }
            case 'GuiPhanCongTienDo': {
                switch (target) {
                    case 'PhanCongTienDo': return 'vừa gửi phân công tiến độ cho gói thầu';
                }
                break;
            }
            case 'GuiDuyetGuiLaiTrinhDuyetGia': {
                switch (target) {
                    case 'TrinhDuyetGia': return 'vừa gửi duyệt Trình duyệt giá ở gói thầu';
                }
                break;
            }
            case 'BanTGDDuyetKhongDuyetTDG': {
                switch (target) {
                    case 'TrinhDuyetGia': return 'đã xem xét Trình duyệt giá cho gói thầu';
                }
                break;
            }
            case 'ChotHSDT': {
                switch (target) {
                    case 'ChotHSDT': return 'đã hoàn tất HSDT cho gói thầu';
                }
                break;
            }
            case 'NopHSDT': {
                switch (target) {
                    case 'NopHSDT': return 'đã nộp HSDT cho gói thầu';
                }
                break;
            }
            case 'ThongBaoPhongVan': {
                switch (target) {
                    case 'ThongBaoPhongVan': return 'đã thông báo phỏng vấn cho gói thầu';
                }
                break;
            }
            case 'ChotCongTacChuanBiPhongVan': {
                switch (target) {
                    case 'ChotCongTacChuanBiPhongVan': return 'đã chuẩn bị phỏng vấn cho gói thầu';
                }
                break;
            }
            case 'TrungTratHuyThau': {
                switch (target) {
                    case 'TrungTratHuyThau': return `đã xác nhận ${resultpackage} cho gói thầu`;
                }
                break;
            }
            case 'ChuyenGiaoTaiLeu': {
                switch (target) {
                    case 'ChuyenGiaoTaiLieu': return 'đã chuyển giao tài liệu của gói thầu';
                }
                break;
            }
        }
    }
}
