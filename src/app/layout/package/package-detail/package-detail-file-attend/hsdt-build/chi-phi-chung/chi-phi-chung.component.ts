import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG2, DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject } from 'rxjs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { PackageDetailComponent } from '../../../package-detail.component';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageService } from '../../../../../../shared/services/package.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';

@Component({
  selector: 'app-chi-phi-chung',
  templateUrl: './chi-phi-chung.component.html',
  styleUrls: ['./chi-phi-chung.component.scss']
})
export class ChiPhiChungComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject();
  dtOptions: any = DATATABLE_CONFIG;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  packageId;
  bidOpportunityId: number;
  page: number;
  pageSize: number;
  pageIndex: number | string = 0;
  pagedResult: PagedResult<DanhSachBoHsdtItem> = new PagedResult<DanhSachBoHsdtItem>();
  dialog;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new HsdtFilterModel();
  checkboxSeclectAll: boolean;
  danhSachLoaiTaiLieu;
  danhSachUser;
  danhSachChiPhiChung;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private dialogService: DialogService
  ) { }

  ngOnInit() {
    this.getDanhSachLoaiHoSo();
    this.getDataTypeCPC();
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = null;
  }
  showDialogUploadFile() {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = 'Bảng tính chi phí chung';
    instance.idFile = 5;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.getDataTypeCPC();
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.getDanhSachUser();
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
    });
  }
  getDataTypeCPC() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType.id === 5
        );
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }
  rerender(pagedResult: any) {
    this.checkboxSeclectAll = false;
    this.pagedResult = pagedResult;

  }
  filter() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultChiPhiChung => {
        this.rerender(responseResultChiPhiChung);
        this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
          item.tenderDocumentType.id === 5
        );
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
          item.tenderDocumentType.id === 5
        );
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
          item.tenderDocumentType.id === 5
        );
        this.spinner.hide();
        this.dtTrigger.next();
      }, err => {
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }
  onSelectAll(value: boolean) {
    this.danhSachChiPhiChung.forEach(x => (x.checkboxSelected = value));
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
          that.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          that.spinner.hide();
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
          this.spinner.show();
          this.hoSoDuThauService.xoaNhieuHoSoDuThau(listId).subscribe(res => {
            that.spinner.hide();
            that.alertService.success('Đã xóa tài liệu!');
            that.refresh();
          }, err => {
            that.spinner.hide();
            that.alertService.error(`Đã có lỗi. Vui lòng thử lại!`);
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
  changeStatus(id, status) {
    this.spinner.show();
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.hoSoDuThauService
          .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
          .subscribe(responseResultChiPhiChung => {
            this.danhSachChiPhiChung = responseResultChiPhiChung.items.filter(item =>
              item.tenderDocumentType.id === 5
            );
            this.refresh();
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
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
              item.tenderDocumentType.id === 5
            );
            this.refresh();
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
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
  getDanhSachUser() {
    this.spinner.show();
    this.hoSoDuThauService.getDataUser(0, 40).subscribe(res => {
      this.spinner.hide();
      this.danhSachUser = res.items;
    }, err => {
      this.spinner.hide();
      this.alertService.error(`Đã có lỗi. Tải danh sách người dùng thất bại`);
    });
  }
}
