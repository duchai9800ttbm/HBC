import { Component, OnInit } from '@angular/core';
import { AlertService } from '../../shared/services';
import { PagedResult } from '../../shared/models';
import { LayoutService } from '../../shared/services/layout.service';
import { ChangeDactivitites } from '../../shared/models/side-bar/change-dactivitites.model';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-change-list',
  templateUrl: './change-list.component.html',
  styleUrls: ['./change-list.component.scss']
})
export class ChangeListComponent implements OnInit {

  constructor(
    private layoutService: LayoutService,
    private alertService: AlertService
  ) { }

  loading = false;
  audits: ChangeDactivitites[];
  pagedResult: PagedResult<ChangeDactivitites>;
  showButton = true;
  iconDisplay = {
    createIcon: 'assets/images/Icon-Change-History/ChangeCreate.png',
    updateIcon: 'assets/images/Icon-Change-History/ChangeUpdate.png',
    deleteIcon: 'assets/images/Icon-Change-History/ChangeDelete.png',
    announcementIcon: 'assets/images/Icon-Change-History/ChangeAnnouncement.png',
    confirmIcon: 'assets/images/Icon-Change-History/ChangeConfirm.png',
    expertiseIcon: 'assets/images/Icon-Change-History/ChangeExpertise.png',
    assignmentIcon: 'assets/images/Icon-Change-History/ChangeAssignment.png',
    considerIcon: 'assets/images/Icon-Change-History/ChangeConsider.png',
    doneIcon: 'assets/images/Icon-Change-History/ChangeDone.png',
    sentIcon: 'assets/images/Icon-Change-History/ChangeSent.png',
    preparedIcon: 'assets/images/Icon-Change-History/ChangePrepared.png',
    transferIcon: 'assets/images/Icon-Change-History/ChangeTransfer.png'
  };
  ngOnInit() {
    this.layoutService.getDataChangeRecently(0, 10)
      .subscribe(pagedResult => {
        this.pagedResult = pagedResult;
        this.audits = pagedResult.items;
        this.showButton = pagedResult.pageCount !== 1;
      }, err => {
        this.alertService.error(`Đã xảy ra lỗi khi tải danh sách thay đổi gần đây!`);
      });
  }
  onLoadMore() {
    this.loading = true;
    this.layoutService.getDataChangeRecently(+this.pagedResult.currentPage + 1, +this.pagedResult.pageSize)
    .pipe(debounceTime(1000))
      .subscribe(pagedResult => {
        this.showButton = (pagedResult.items.length > 0) && (+pagedResult.currentPage + 1 < pagedResult.pageCount);
        this.pagedResult = pagedResult;
        this.audits = this.audits.concat(pagedResult.items);
        this.loading = false;
      }, err => {
        this.alertService.error(`Đã xảy ra lỗi khi tải danh sách thay đổi gần đây!`);
        this.loading = false;
      });
  }
  renderDataChangeRecently(action: string, target?: string, data?: any, typereturn?: any) {
    let sourceImage = 'assets/images/change-action-icon.png';
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
          case 'LyDoTrungthau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa lý do trúng thầu';
            }
          }
          case 'LyDoTratThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa lý do trật thầu';
            }
          }
          case 'LyDoHuyThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa lý do huỷ thầu';
            }
          }
          case 'KhuVuc': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa khu vực';
            }
          }
          case 'LoaiCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa loại công trình';
            }
          }
          case 'HangMucThiCongCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa hạng mục công trình';
            }
          }
          case 'ViTriChucVu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa vị trí/chức vụ';
            }
          }
          case 'NhomNguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa nhóm người dùng';
            }
          }
          case 'NguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa người dùng';
            }
          }
          case 'GoiThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa gói thầu';
            }
          }
          case 'HSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa HSMT ở gói thầu';
            }
          }
          case 'DeNghiDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Đề nghị dự thầu ở gói thầu';
            }
          }
          case 'BangTomTatDKDT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Bảng tóm tắt ĐKDT ở gói thầu';
            }
          }
          case 'YCBGVatTuThauPhu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa YC BG vật tư, thầu phụ ở gói thầu';
            }
          }
          case 'BaoCaoThamQuanCT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Báo cáo tham quan CT ở gói thầu';
            }
          }
          case 'BangTongHopDuToan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa BOQ ở gói thầu';
            }
          }
          case 'BangTinhChiPhiChung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Chi phí chung ở gói thầu';
            }
          }
          case 'BangCauHoiLamRoHSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Bảng câu hỏi ở gói thầu';
            }
          }
          case 'CacHKTCoLienQuan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa HSKT ở gói thầu';
            }
          }
          case 'HoSoPhapLy': {
            return sourceImage = 'assets/images/change-xóa-icon.png';
          }
          case 'HoSoKhac': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Hồ sơ khác ở gói thầu';
            }
          }
          case 'TrinhDuyetGia': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa Trình duyệt giá ở gói thầu';
            }
          }
          case 'LoiMoiPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa lời mời phỏng vấn ở gói thầu';
            }
          }
          case 'BienBanPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa biên bản phỏng vấn lần ở gói thầu';
            }
          }
          case 'KetQuaDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa kết quả dự thầu cho gói thầu';
            }
          }
          case 'HopDongKyKet': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa hợp đồng ký kết cho gói thầu';
            }
          }
          case 'BienBanCuocHop': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa biên bản cuộc họp của gói thầu';
            }
          }
          case 'FilePresentation': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.deleteIcon;
            } else {
              return 'vừa xóa file presentation của gói thầu';
            }
          }
        }
        break;
      }
      case 'Edit': {
        switch (target) {
          case 'LyDoTrungthau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật lý do trúng thầu';
            }
          }
          case 'LyDoTratThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật lý do trật thầu';
            }
          }
          case 'LyDoHuyThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật lý do huỷ thầu';
            }
          }
          case 'KhuVuc': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật khu vực';
            }
          }
          case 'LoaiCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật loại công trình';
            }
          }
          case 'HangMucThiCongCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật hạng mục công trình';
            }
          }
          case 'ViTriChucVu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật vị trí/chức vụ';
            }
          }
          case 'NhomNguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật nhóm người dùng';
            }
          }
          case 'NguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật người dùng';
            }
          }
          case 'GoiThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật gói thầu';
            }
          }
          case 'HSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật HSMT ở gói thầu';
            }
          }
          case 'DeNghiDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Đề nghị dự thầu ở gói thầu';
            }
          }
          case 'BangTomTatDKDT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Bảng tóm tắt ĐKDT ở gói thầu';
            }
          }
          case 'YCBGVatTuThauPhu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật YC BG vật tư, thầu phụ ở gói thầu';
            }
          }
          case 'BaoCaoThamQuanCT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Báo cáo tham quan CT ở gói thầu';
            }
          }
          case 'BangTongHopDuToan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật BOQ ở gói thầu';
            }
          }
          case 'BangTinhChiPhiChung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Chi phí chung ở gói thầu';
            }
          }
          case 'BangCauHoiLamRoHSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Bảng câu hỏi ở gói thầu';
            }
          }
          case 'CacHKTCoLienQuan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật HSKT ở gói thầu';
            }
          }
          case 'HoSoPhapLy': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật HSPL ở gói thầu';
            }
          }
          case 'HoSoKhac': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Hồ sơ khác ở gói thầu';
            }
          }
          case 'TrinhDuyetGia': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật Trình duyệt giá ở gói thầu';
            }
          }
          case 'LoiMoiPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật lời mời phỏng vấn ở gói thầu';
            }
          }
          case 'BienBanPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật biên bản phỏng vấn lần ở gói thầu';
            }
          }
          case 'KetQuaDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật kết quả dự thầu cho gói thầu';
            }
          }
          case 'HopDongKyKet': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật hợp đồng ký kết cho gói thầu';
            }
          }
          case 'BienBanCuocHop': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật biên bản cuộc họp của gói thầu';
            }
          }
          case 'FilePresentation': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.updateIcon;
            } else {
              return 'vừa cập nhật file presentation của gói thầu';
            }
          }
        }
        break;
      }
      case 'Create': {
        switch (target) {
          case 'LyDoTrungthau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới lý do trúng thầu';
            }
          }
          case 'LyDoTratThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới lý do trật thầu';
            }
          }
          case 'LyDoHuyThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới lý do huỷ thầu';
            }
          }
          case 'KhuVuc': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới khu vực';
            }
          }
          case 'LoaiCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới loại công trình';
            }
          }
          case 'HangMucThiCongCongTrinh': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới hạng mục công trình';
            }
          }
          case 'ViTriChucVu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới vị trí/chức vụ';
            }
          }
          case 'NhomNguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới nhóm người dùng';
            }
          }
          case 'NguoiDung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới người dùng';
            }
          }
          case 'GoiThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới gói thầu';
            }
          }
          case 'HSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload HSMT ở gói thầu';
            }
          }
          case 'DeNghiDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới Đề nghị dự thầu ở gói thầu';
            }
          }
          case 'BangTomTatDKDT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới Bảng tóm tắt ĐKDT ở gói thầu';
            }
          }
          case 'YCBGVatTuThauPhu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload YC BG vật tư, thầu phụ ở gói thầu';
            }
          }
          case 'BaoCaoThamQuanCT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới Báo cáo tham quan CT ở gói thầu';
            }
          }
          case 'BangTongHopDuToan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload BOQ ở gói thầu';
            }
          }
          case 'BangTinhChiPhiChung': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload Chi phí chung ở gói thầu';
            }
          }
          case 'BangCauHoiLamRoHSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload Bảng câu hỏi ở gói thầu';
            }
          }
          case 'CacHKTCoLienQuan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload HSKT ở gói thầu';
            }
          }
          case 'HoSoPhapLy': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload HSPL ở gói thầu';
            }
          }
          case 'HoSoKhac': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload Hồ sơ khác ở gói thầu';
            }
          }
          case 'TrinhDuyetGia': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới Trình duyệt giá ở gói thầu';
            }
          }
          case 'LoiMoiPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa tạo mới lời mời phỏng vấn ở gói thầu';
            }
          }
          case 'BienBanPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload biên bản phỏng vấn lần ở gói thầu';
            }
          }
          case 'KetQuaDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload kết quả dự thầu cho gói thầu';
            }
          }
          case 'HopDongKyKet': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload hợp đồng ký kết cho gói thầu';
            }
          }
          case 'BienBanCuocHop': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload biên bản cuộc họp của gói thầu';
            }
          }
          case 'FilePresentation': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.createIcon;
            } else {
              return 'vừa upload file presentation của gói thầu';
            }
          }
        }
        break;
      }
      case 'XacNhanDaDu': {
        switch (target) {
          case 'DaDuHSMT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.confirmIcon;
            } else {
              return 'vừa xác nhận đã đủ HSMT ở gói thầu';
            }
          }
        }
        break;
      }
      case 'GuiDuyet': {
        switch (target) {
          case 'DeNghiDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.expertiseIcon;
            } else {
              return 'vừa gửi duyệt Đề nghị dự thầu ở gói thầu';
            }

          }
        }
        break;
      }
      case 'ChapThuanKhongChapThuan': {
        switch (target) {
          case 'DeNghiDuThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.considerIcon;
            } else {
              return 'đã xem xét Đề nghị dự thầu ở gói thầu';
            }

          }
        }
        break;
      }
      case 'ThongBaoTrienKhai': {
        switch (target) {
          case 'TrienKhaiVaPhanCongTienDo': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.announcementIcon;
            } else {
              return 'vừa thông báo triển khai cho gói thầu';
            }

          }
        }
        break;
      }
      case 'XacNhan': {
        switch (target) {
          case 'PhanCongTienDo': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.assignmentIcon;
            } else {
              return 'vừa phân công tiến độ cho gói thầu';
            }

          }
        }

        break;
      }
      case 'GuiPhanCongTienDo': {
        switch (target) {
          case 'PhanCongTienDo': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.assignmentIcon;
            } else {
              return 'vừa gửi phân công tiến độ cho gói thầu';
            }

          }
        }
        break;
      }
      case 'GuiDuyetGuiLaiTrinhDuyetGia': {
        switch (target) {
          case 'TrinhDuyetGia': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.expertiseIcon;
            } else {
              return 'vừa gửi duyệt Trình duyệt giá ở gói thầu';
            }

          }
        }
        break;
      }
      case 'BanTGDDuyetKhongDuyetTDG': {
        switch (target) {
          case 'TrinhDuyetGia': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.considerIcon;
            } else {
              return 'đã xem xét Trình duyệt giá cho gói thầu';
            }

          }
        }
        break;
      }
      case 'ChotHSDT': {
        switch (target) {
          case 'ChotHSDT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.doneIcon;
            } else {
              return 'đã hoàn tất HSDT cho gói thầu';
            }

          }
        }
        break;
      }
      case 'NopHSDT': {
        switch (target) {
          case 'NopHSDT': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.sentIcon;
            } else {
              return 'đã nộp HSDT cho gói thầu';
            }

          }
        }
        break;
      }
      case 'ThongBaoPhongVan': {
        switch (target) {
          case 'ThongBaoPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.announcementIcon;
            } else {
              return 'đã thông báo phỏng vấn cho gói thầu';
            }

          }
        }
        break;
      }
      case 'ChotCongTacChuanBiPhongVan': {
        switch (target) {
          case 'ChotCongTacChuanBiPhongVan': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.preparedIcon;
            } else {
              return 'đã chuẩn bị phỏng vấn cho gói thầu';
            }

          }
        }
        break;
      }
      case 'TrungTratHuyThau': {
        switch (target) {
          case 'TrungTratHuyThau': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.confirmIcon;
            } else {
              return `đã xác nhận ${resultpackage} cho gói thầu`;
            }

          }
        }
        break;
      }
      case 'ChuyenGiaoTaiLeu': {
        switch (target) {
          case 'ChuyenGiaoTaiLieu': {
            if (typereturn === 'iconImage') {
              return sourceImage = this.iconDisplay.transferIcon;
            } else {
              return 'đã chuyển giao tài liệu của gói thầu';
            }

          }
        }
        break;
      }
    }
  }
}
