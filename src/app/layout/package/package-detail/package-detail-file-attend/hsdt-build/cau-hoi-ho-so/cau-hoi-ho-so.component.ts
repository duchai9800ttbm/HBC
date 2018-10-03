import { Component, OnInit } from '@angular/core';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertService, ConfirmationService } from '../../../../../../shared/services';
import { PackageService } from '../../../../../../shared/services/package.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { PackageDetailComponent } from '../../../package-detail.component';
// tslint:disable-next-line:import-blacklist
import { BehaviorSubject, Subject } from 'rxjs';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';

@Component({
  selector: 'app-cau-hoi-ho-so',
  templateUrl: './cau-hoi-ho-so.component.html',
  styleUrls: ['./cau-hoi-ho-so.component.scss']
})
export class CauHoiHoSoComponent implements OnInit {
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
  danhSachCHHS;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private packageService: PackageService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getDanhSachLoaiHoSo();
    this.getDataTypeCHHS();
  }
  showDialogUploadFile() {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = 'Bảng câu hỏi làm rõ HSMT';
    instance.idFile = 6;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.getDataTypeCHHS();
    // this.getDanhSachBoHoSo();
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
    });
  }
  getDataTypeCHHS() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultBGVT => {
        this.rerender(responseResultBGVT);
        this.danhSachCHHS = responseResultBGVT.items.filter(item =>
          item.tenderDocumentType === 'Bảng câu hỏi làm rõ HSMT'
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
  onSelectAll(value: boolean) {
    this.danhSachCHHS.forEach(x => (x.checkboxSelected = value));
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
    const listId = this.danhSachCHHS.filter(x => x.checkboxSelected).map(x => x.id);
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
    this.getDataTypeCHHS();
    this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
  }
  filter() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.rerender(responseResultBoHSDT);
        this.danhSachCHHS = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Bảng câu hỏi làm rõ HSMT'
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
    this.getDataTypeCHHS();
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.getDataTypeCHHS();
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
        this.getDataTypeCHHS();
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
