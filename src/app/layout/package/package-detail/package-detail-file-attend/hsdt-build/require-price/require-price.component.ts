import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject } from 'rxjs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../../package-detail.component';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';

@Component({
  selector: 'app-require-price',
  templateUrl: './require-price.component.html',
  styleUrls: ['./require-price.component.scss']
})
export class RequirePriceComponent implements OnInit {
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
  danhSachBGVT;
  danhSachUser;
  lanPhongVan;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getDanhSachLoaiHoSo();
    this.getDataTypeBGVT();
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.interViewTimes = null;
  }
  showDialogUploadFile() {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = 'Yêu cầu báo giá vật tư, thầu phụ';
    instance.idFile = 2;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.getDataTypeBGVT();
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.getDanhSachUser();
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
    }, err => {
      this.alertService.error(`Đã có lỗi xảy ra. Vui lòng thử lại!`);
    });
  }
  getDataTypeBGVT() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultBGVT => {
        this.spinner.hide();
        this.rerender(responseResultBGVT);
        this.danhSachBGVT = responseResultBGVT.items.filter(item =>
          item.tenderDocumentType.id === 2
        );
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
    this.danhSachBGVT.forEach(x => (x.checkboxSelected = value));
  }

  downloadDocument(id) {
    this.hoSoDuThauService.taiHoSoDuThau(id).subscribe(data => {
    }, err => {
      if (err.json().errorCode) {
        this.alertService.error('File không tồn tại hoặc đã bị xóa!');
      } else {
        this.alertService.error('Đã có lỗi xãy ra. Vui lòng thử lại!');
      }
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
          that.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          that.spinner.hide();
        });
      }
    );
  }
  multiDelete() {
    const that = this;
    const listId = this.danhSachBGVT.filter(x => x.checkboxSelected).map(x => x.id);
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
            that.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          });
        });
    }
  }
  refresh() {
    this.getDataTypeBGVT();
    this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
  }
  filter() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.spinner.hide();
        this.rerender(responseResultBoHSDT);
        this.danhSachBGVT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType.id === 2
        );
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.dtTrigger.next();
  }
  clearFilter() {
    this.filterModel = new HsdtFilterModel();
    this.filterModel.createdDate = null;
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = null;
    this.filterModel.interViewTimes = null;
    this.getDataTypeBGVT();
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.spinner.show();
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.getDataTypeBGVT();
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
        this.getDataTypeBGVT();
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
    this.hoSoDuThauService.getDataUser(0, 40).subscribe(res => {
      this.danhSachUser = res.items;
    });
  }
}
