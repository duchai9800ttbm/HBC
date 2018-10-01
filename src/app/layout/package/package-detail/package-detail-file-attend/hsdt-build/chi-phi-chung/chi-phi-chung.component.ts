import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject } from 'rxjs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { AlertService, ConfirmationService, UserService, DataService } from '../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DocumentService } from '../../../../../../shared/services/document.service';
import { OpportunityHsmtService } from '../../../../../../shared/services/opportunity-hsmt.service';
import { PackageService } from '../../../../../../shared/services/package.service';

@Component({
  selector: 'app-chi-phi-chung',
  templateUrl: './chi-phi-chung.component.html',
  styleUrls: ['./chi-phi-chung.component.scss']
})
export class ChiPhiChungComponent implements OnInit {
  isShowMenu = false;
  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();
  searchTerm;
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
  tableEmpty: boolean;
  sum = 0;
  showTable = false;
  danhSachChiPhiChung;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.filterModel.status = '';
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType === 'Bảng tính chi phí chung'
        );
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
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
  filter() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType === 'Bảng tính chi phí chung'
        );
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
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
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType === 'Bảng tính chi phí chung'
        );
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }

  refresh() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType === 'Bảng tính chi phí chung'
        );
        this.spinner.hide();
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
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
    const listId = this.danhSachChiPhiChung.filter(x => x.checkboxSelected).map(x => x.id);
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
  printDocument(id) {
    console.log(`Chưa có API`);
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.hoSoDuThauService
          .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
          .subscribe(responseResultChiPhiChung => {
            this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
              item.tenderDocumentType === 'Bảng tính chi phí chung'
            );
            this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
            this.sum = this.danhSachChiPhiChung.length;
            this.refresh();
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => {
        this.dtTrigger.next();
        this.spinner.hide();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    } else {
      this.hoSoDuThauService.updateStatus(id, 'Draft').subscribe(res => {
        this.hoSoDuThauService
          .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
          .subscribe(responseResultChiPhiChung => {
            this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
              item.tenderDocumentType === 'Bảng tính chi phí chung'
            );
            this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
            this.sum = this.danhSachChiPhiChung.length;
            this.refresh();
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
        this.showTable = (this.danhSachChiPhiChung.length > 0) ? true : false;
        this.sum = this.danhSachChiPhiChung.length;
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
}
