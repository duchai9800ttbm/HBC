import { Component, OnInit, OnChanges } from '@angular/core';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
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
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject();
  datePickerConfig = DATETIME_PICKER_CONFIG;
  dtOptions: any = DATATABLE_CONFIG;
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
  dataOfChildComponent;
  nameOfTypeDocument;
  childrenOfTypeDocument;
  dataDocumentOfType;
  danhSachUser;
  isHSKT = false;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.getDanhSachUser();
    this.getDanhSachLoaiHoSo();
    this.getDataDocumentOfType();
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = '';
    this.hoSoDuThauService.watchChangingRouter().subscribe(data => {
      this.getDanhSachUser();
      this.getDanhSachLoaiHoSo();
      this.getDataDocumentOfType();
      this.filterModel.status = '';
      this.filterModel.uploadedEmployeeId = '';
    });
  }
  showDialogUploadFile() {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = this.nameOfTypeDocument;
    instance.idFile = HoSoDuThauService.idTenderDocumentTypesData;
    instance.childrenType = this.childrenOfTypeDocument;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.getDataDocumentOfType();
  }
  getDataDocumentOfType(alert = false, spiner = true) {
    if (spiner) { this.spinner.show(); }
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 10)
      .subscribe(responseResultDocument => {
        this.pagedResult = responseResultDocument;
        this.spinner.hide();
        if (alert) {
          this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
        }
        this.rerender(responseResultDocument);
        this.dataDocumentOfType = responseResultDocument.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData
        );
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }
  pagedResultChange(pagedResult: any) {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(responseResultDocument => {
        this.spinner.hide();
        this.pagedResult = responseResultDocument;
        this.pageIndex = responseResultDocument.currentPage;
        this.rerender(responseResultDocument);
        this.dataDocumentOfType = responseResultDocument.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData
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
    this.dataDocumentOfType.forEach(x => (x.checkboxSelected = value));
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
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này?',
      () => {
        this.spinner.show();
        this.hoSoDuThauService.xoaMotHoSoDuThau(id).subscribe(res => {
          this.spinner.hide();
          this.alertService.success('Đã xóa tài liệu!');
          this.refresh();
        }, err => {
          this.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          this.spinner.hide();
        });
      }
    );
  }
  multiDelete() {
    const listId = this.dataDocumentOfType.filter(x => x.checkboxSelected).map(x => x.id);
    if (listId && listId.length === 0) {
      this.alertService.error('Bạn phải chọn ít nhất một tài liệu để xóa!');
    } else {
      this.confirmationService.confirm('Bạn có chắc chắn muốn xóa những tài liệu này?',
        () => {
          this.spinner.show();
          this.hoSoDuThauService.xoaNhieuHoSoDuThau(listId).subscribe(res => {
            this.spinner.hide();
            this.alertService.success('Đã xóa tài liệu!');
            this.refresh();
          }, err => {
            this.spinner.hide();
            this.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          });
        });
    }
  }
  refresh() {
    this.getDataDocumentOfType(true, true);
  }
  filter() {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.spinner.hide();
        this.rerender(responseResultBoHSDT);
        this.dataDocumentOfType = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData
        );
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.dtTrigger.next();
  }
  clearFilter() {
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = '';
    this.filterModel.createdDate = null;
    this.getDataDocumentOfType(false, false);
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.getDataDocumentOfType(true, false);
        this.dtTrigger.next();
      }, err => {
        this.dtTrigger.next();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
    if (status === 'Official') {
      this.hoSoDuThauService.updateStatus(id, 'Draft').subscribe(res => {
        this.getDataDocumentOfType(true, false);
        this.dtTrigger.next();
      }, err => {
        this.dtTrigger.next();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
  }
  getDanhSachUser() {
    this.hoSoDuThauService.getDataUser(0, 40).subscribe(res => {
      this.danhSachUser = res.items;
    });
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.spinner.show();
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.spinner.hide();
      this.danhSachLoaiTaiLieu = res;
      this.dataOfChildComponent = this.danhSachLoaiTaiLieu.filter(x => x.item.id === HoSoDuThauService.idTenderDocumentTypesData)[0];
      this.nameOfTypeDocument = (this.dataOfChildComponent && this.dataOfChildComponent.item) ? this.dataOfChildComponent.item.name : '';
      this.childrenOfTypeDocument = this.dataOfChildComponent ? this.dataOfChildComponent.children : [];
    }, err => {
      this.spinner.hide();
      this.alertService.error(`Đã có lỗi khi tải dữ liệu. Xin vui lòng thử lại!`);
    });
  }
}
