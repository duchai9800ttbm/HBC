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
import { DialogService } from '@progress/kendo-angular-dialog';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';

@Component({
  selector: 'app-hskt-involved',
  templateUrl: './hskt-involved.component.html',
  styleUrls: ['./hskt-involved.component.scss']
})
export class HsktInvolvedComponent implements OnInit {
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
  sum = 0;
  danhSachLoaiTaiLieu;
  danhSachHoSoKT;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) {
  }
  ngOnInit() {
    this.filterModel.status = '';
    this.packageId = +PackageDetailComponent.packageId;
    this.getDataTypeHSKT();
  }
  showDialogUploadFile() {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = 'Các hồ sơ kỹ thuật khác';
    instance.idFile = 16;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.getDataTypeHSKT();
    // this.getDanhSachBoHoSo();
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
    }, err => {
      this.alertService.error(`Đã có lỗi. Vui lòng thử lại!`);
    });
  }
  getDataTypeHSKT() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseHS => {
        this.spinner.hide();
        this.rerender(responseHS);
        this.danhSachHoSoKT = responseHS.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }

  rerender(pagedResult: any) {
    this.checkboxSeclectAll = false;
    this.pagedResult = pagedResult;

  }
  onSelectAll(value: boolean) {
    this.danhSachHoSoKT.forEach(x => (x.checkboxSelected = value));
  }

  deleteDocument(id) {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này?',
      () => {
        this.spinner.show();
        this.hoSoDuThauService.xoaMotHoSoDuThau(id).subscribe(res => {
          that.spinner.hide();
          that.alertService.success('Đã xóa tài liệu!');
          that.refresh();
        }, err => {
          that.spinner.hide();
          that.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
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
          this.spinner.show();
          this.hoSoDuThauService.xoaNhieuHoSoDuThau(listId).subscribe(res => {
            that.spinner.hide();
            that.alertService.success('Đã xóa tài liệu!');
            that.refresh();
          }, err => {
            that.spinner.hide();
            that.alertService.error('Đã có lỗi. Xóa không thành công!');
            that.refresh();
          });
        });
    }
  }
  refresh() {
    this.getDataTypeHSKT();
    this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
  }
  filter() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.spinner.hide();
        this.rerender(responseResultBoHSDT);
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.dtTrigger.next();
  }
  clearFilter() {
    this.filterModel = new HsdtFilterModel();
    console.log(this.filterModel);
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.createdDate = null;
    this.filterModel.uploadedEmployeeId = null;
    this.getDataTypeHSKT();
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.spinner.show();
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.getDataTypeHSKT();
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
      this.spinner.show();
      this.hoSoDuThauService.updateStatus(id, 'Draft').subscribe(res => {
        this.getDataTypeHSKT();
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
}
