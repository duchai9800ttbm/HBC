import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AuditItem, PagedResult } from '../../../shared/models/index';
import {
    SessionService,
    UserService,
    AlertService
} from '../../../shared/services/index';
import { UserModel } from '../../../shared/models/user/user.model';
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
        private sessionService: SessionService,
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

        this.getDataChangeRecently();
        this.getActivites();
    }
    toggleSidebar() {
        const width = document.getElementById('sidebar').offsetWidth;
        const widthScreen = window.screen.width;
        const heightScreen = window.screen.height;
        // check PORTRAIT or LANDSCAPE
        // với mobile/tablet, PORTRAIT thì so sánh width, LANDSCAPE thì so sánh height
        const widthPortrait = window.matchMedia("(orientation: landscape)").matches && this.checkMobileOrTablet() ? heightScreen : widthScreen;
        if (widthPortrait > 992) {
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

    checkMobileOrTablet(): boolean {
        var check = false;
        (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window['opera']);
        return check;
    }

    onResize(e) {
        const width = document.getElementById('sidebar').offsetWidth;
        if (width < 200) {
            this.layoutService.emitEvent(true);
        }
        if (width === 200) {
            this.layoutService.emitEvent(false);
        }
    }
    getDataChangeRecently() {
        this.layoutService.getDataChangeRecently(0, 5).subscribe(data => {
            this.pagedResult = data;
        }, err => {
            this.alertService.error('Đã có lỗi khi tải nội dung thay đổi gần đây!');
        });



    }
    getActivites() {
        const self = this;

        setInterval(function () {

            if (!self.sessionService.currentUser) {
                return;
            }
            self.layoutService.getDataChangeRecently(0, 5).subscribe(data => {
                self.pagedResult = data;
            }, err => {
                self.alertService.error('Đã có lỗi khi tải nội dung thay đổi gần đây!');
            });
        }, 1 * 60 * 1000);
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
                    case 'HSMT': return 'vừa xóa HSMT ở gói thầu';
                    case 'DeNghiDuThau': return 'vừa xóa Đề nghị dự thầu ở gói thầu';
                    case 'BangTomTatDKDT': return 'vừa xóa Bảng tóm tắt ĐKDT ở gói thầu';
                    case 'YCBGVatTuThauPhu': return 'vừa xóa YC BG vật tư, thầu phụ ở gói thầu';
                    case 'BaoCaoThamQuanCT': return 'vừa xóa Báo cáo tham quan CT ở gói thầu';
                    case 'BangTongHopDuToan': return 'vừa xóa BOQ ở gói thầu';
                    case 'BangTinhChiPhiChung': return 'vừa xóa Chi phí chung ở gói thầu';
                    case 'BangCauHoiLamRoHSMT': return 'vừa xóa Bảng câu hỏi ở gói thầu';
                    case 'CacHKTCoLienQuan': return 'vừa xóa HSKT ở gói thầu';
                    case 'HoSoPhapLy': return 'vừa xóa HSPL ở gói thầu';
                    case 'HoSoKhac': return 'vừa xóa Hồ sơ khác ở gói thầu';
                    case 'TrinhDuyetGia': return 'vừa xóa Trình duyệt giá ở gói thầu';
                    case 'LoiMoiPhongVan': return 'vừa xóa lời mời phỏng vấn ở gói thầu';
                    case 'BienBanPhongVan': return 'vừa xóa biên bản phỏng vấn lần ở gói thầu';
                    case 'KetQuaDuThau': return 'vừa xóa kết quả dự thầu cho gói thầu';
                    case 'HopDongKyKet': return 'vừa xóa hợp đồng ký kết cho gói thầu';
                    case 'BienBanCuocHop': return 'vừa xóa biên bản cuộc họp của gói thầu';
                    case 'FilePresentation': return 'vừa xóa file presentation của gói thầu';
                }
                break;
            }
            case 'Edit': {
                switch (target) {
                    case 'LyDoTrungthau': return 'vừa cập nhật lý do trúng thầu';
                    case 'LyDoTratThau': return 'vừa cập nhật lý do trật thầu';
                    case 'LyDoHuyThau': return 'vừa cập nhật lý do huỷ thầu';
                    case 'KhuVuc': return 'vừa cập nhật khu vực';
                    case 'LoaiCongTrinh': return 'vừa cập nhật loại công trình';
                    case 'HangMucThiCongCongTrinh': return 'vừa cập nhật hạng mục công trình';
                    case 'ViTriChucVu': return 'vừa cập nhật vị trí/chức vụ';
                    case 'NhomNguoiDung': return 'vừa cập nhật nhóm người dùng';
                    case 'NguoiDung': return 'vừa cập nhật người dùng';
                    case 'GoiThau': return 'vừa cập nhật gói thầu';
                    case 'HSMT': return 'vừa cập nhật HSMT ở gói thầu';
                    case 'DeNghiDuThau': return 'vừa cập nhật Đề nghị dự thầu ở gói thầu';
                    case 'BangTomTatDKDT': return 'vừa cập nhật Bảng tóm tắt ĐKDT ở gói thầu';
                    case 'YCBGVatTuThauPhu': return 'vừa cập nhật YC BG vật tư, thầu phụ ở gói thầu';
                    case 'BaoCaoThamQuanCT': return 'vừa cập nhật Báo cáo tham quan CT ở gói thầu';
                    case 'BangTongHopDuToan': return 'vừa cập nhật BOQ ở gói thầu';
                    case 'BangTinhChiPhiChung': return 'vừa cập nhật Chi phí chung ở gói thầu';
                    case 'BangCauHoiLamRoHSMT': return 'vừa cập nhật Bảng câu hỏi ở gói thầu';
                    case 'CacHKTCoLienQuan': return 'vừa cập nhật HSKT ở gói thầu';
                    case 'HoSoPhapLy': return 'vừa cập nhật HSPL ở gói thầu';
                    case 'HoSoKhac': return 'vừa cập nhật Hồ sơ khác ở gói thầu';
                    case 'TrinhDuyetGia': return 'vừa cập nhật Trình duyệt giá ở gói thầu';
                    case 'LoiMoiPhongVan': return 'vừa cập nhật lời mời phỏng vấn ở gói thầu';
                    case 'BienBanPhongVan': return 'vừa cập nhật biên bản phỏng vấn lần ở gói thầu';
                    case 'KetQuaDuThau': return 'vừa cập nhật kết quả dự thầu cho gói thầu';
                    case 'HopDongKyKet': return 'vừa cập nhật hợp đồng ký kết cho gói thầu';
                    case 'BienBanCuocHop': return 'vừa cập nhật biên bản cuộc họp của gói thầu';
                    case 'FilePresentation': return 'vừa cập nhật file presentation của gói thầu';
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
