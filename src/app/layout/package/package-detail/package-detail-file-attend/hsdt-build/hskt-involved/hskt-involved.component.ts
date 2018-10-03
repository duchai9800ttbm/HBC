import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG2, DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject } from 'rxjs/Subject';
import { BidDocumentFilter } from '../../../../../../shared/models/document/bid-document-filter.model';
import { PagedResult, DictionaryItemHightLight } from '../../../../../../shared/models';
import { UserModel } from '../../../../../../shared/models/user/user.model';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';
import { BidDocumentModel } from '../../../../../../shared/models/document/bid-document.model';
import { BidDocumentGroupModel } from '../../../../../../shared/models/document/bid-document-group.model';
import { PackageInfoModel } from '../../../../../../shared/models/package/package-info.model';
import { AlertService, ConfirmationService, UserService, DataService } from '../../../../../../shared/services';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { OpportunityHsmtService } from '../../../../../../shared/services/opportunity-hsmt.service';
import { PackageService } from '../../../../../../shared/services/package.service';
import { PackageDetailComponent } from '../../../package-detail.component';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject } from 'rxjs';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';

@Component({
  selector: 'app-hskt-involved',
  templateUrl: './hskt-involved.component.html',
  styleUrls: ['./hskt-involved.component.scss']
})
export class HsktInvolvedComponent implements OnInit {
  isShowMenu = false;
  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();
  searchTerm;
  pagedResultUser: PagedResult<UserModel> = new PagedResult<UserModel>();
  datePickerConfig = DATETIME_PICKER_CONFIG;
  packageId;
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  pageIndex: number | string = 0;
  pagedResult: PagedResult<DanhSachBoHsdtItem> = new PagedResult<DanhSachBoHsdtItem>();
  danhSachBoHoSoDuThau;
  dialog;
  hideActionSiteReport: boolean;
  isShowSideMenu = false;
  notShow = false;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new HsdtFilterModel();
  checkboxSeclectAll: boolean;
  isShowButtonUp: boolean;
  isShowButtonDown: boolean;
  isShowEmpty = false;
  danhSachLoaiTaiLieu;
  showPopupAdd = false;
  showPopupDetail = false;
  currentItem = {};
  userListItem: UserItemModel[];
  ListItem: BidDocumentModel[];
  packageData: PackageInfoModel;
  tableEmpty: boolean;
  sum = 0;
  showTable = false;
  danhSachHoSoKT;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService
  ) {
  }
  ngOnInit() {
    this.filterModel.status = '';
    this.packageId = +PackageDetailComponent.packageId;
    this.getDataTypeHSKT();
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
  filter() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.rerender(responseResultBoHSDT);
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.dtTrigger.next();
  }

  clearFilter() {
    this.filterModel = new HsdtFilterModel();
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.createdDate = null;
    this.filterModel.uploadedEmployeeId = null;
    this.getDataTypeHSKT();
  }
  getDataTypeHSKT() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.rerender(responseResultBoHSDT);
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }

  toggleClick() {
    this.isShowMenu = !this.isShowMenu;
    $('.toggle-menu-item').toggleClass('resize');
    $('.line').toggleClass('resize');
    $('#toggle-menu-item').toggleClass('hidden');
    $('#toggle-menu-item').toggleClass('resize');
    $('.iconN1').toggleClass('iconN01');
    $('.iconN2').toggleClass('iconN02');
    $('.iconN3').toggleClass('iconN03');
  }


  refresh() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => {
        this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
      });
  }

  deleteDocument(id) {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này?',
      () => {
        this.spinner.show();
        this.hoSoDuThauService.xoaMotHoSoDuThau(id).subscribe(res => {
          that.alertService.success('Đã xóa tài liệu!');
          that.refresh();
        }, err => {
          this.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          this.spinner.hide();
        });
      }
    );
  }
  multiDelete() {
    const that = this;
    const listId = this.danhSachHoSoKT.filter(x => x.checkboxSelected).map(x => x.id);
    if (listId && listId.length === 0) {
      this.alertService.error('Bạn phải chọn ít nhất một tài liệu để xóa!');
    } else {
      this.confirmationService.confirm('Bạn có chắc chắn muốn xóa những tài liệu này?',
        () => {
          this.hoSoDuThauService.xoaNhieuHoSoDuThau(listId).subscribe(res => {
            that.alertService.success('Đã xóa tài liệu!');
            that.refresh();
          });
        });
    }
  }
  onSelectAll(value: boolean) {
    this.danhSachHoSoKT.forEach(x => (x.checkboxSelected = value));
  }

  downloadDocument(id) {
    this.hoSoDuThauService.taiHoSoDuThau(id).subscribe(data => {
    }, err => {
      if (err.json().errorCode) {
        this.alertService.error('File không tồn tại hoặc đã bị xóa!');
      } else {
        this.alertService.error('Đã có lỗi xãy ra!');
      }
    });
  }

  changeStatus(id, status) {
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.searchInstant();
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => {
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
    if (status === 'Official') {
      this.hoSoDuThauService.updateStatus(id, 'Draft').subscribe(res => {
        this.searchInstant();
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => {
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
  }
  searchInstant() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.refresh();
        this.dtTrigger.next();
        this.spinner.hide();
      }, err => {
        this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
      });
  }
}
