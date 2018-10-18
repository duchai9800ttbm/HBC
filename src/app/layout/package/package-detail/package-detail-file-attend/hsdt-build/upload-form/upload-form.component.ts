import { Component, OnInit, OnChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../../package-detail.component';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertService, ConfirmationService, UserService } from '../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';
import { ListDocumentTypeIdGroup } from '../../../../../../shared/models/ho-so-du-thau/list-document-type.model';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';

@Component({
  selector: 'app-upload-form',
  templateUrl: './upload-form.component.html',
  styleUrls: ['./upload-form.component.scss']
})
export class UploadFormComponent implements OnInit, OnDestroy {
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
  danhSachUser: UserItemModel[];
  isTypeChildDoc = false;
  subscription: Subscription;
  listDocumentShowGroup: ListDocumentTypeIdGroup[];
  sum = 0;
  showPopupDetail = false;
  currentItem = {};
  showPopupViewImage = false;
  imageUrlArray = [];
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private confirmationService: ConfirmationService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.getDanhSachUser();
    this.getDanhSachLoaiHoSo();
    this.getDataDocumentOfType();
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = '';
    this.subscription = this.hoSoDuThauService.watchChangingRouter().subscribe(data => {
      this.getDanhSachUser();
      this.getDanhSachLoaiHoSo();
      this.getDataDocumentOfType();
      this.filterModel.status = '';
      this.filterModel.uploadedEmployeeId = '';
    });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  showDialogUploadFile(i) {
    this.dialog = this.dialogService.open({
      content: UploadFileHsdtComponent,
      width: 750,
      minWidth: 500
    });
    const instance = this.dialog.content.instance;
    instance.bidOpportunityId = this.packageId;
    instance.nameFile = this.nameOfTypeDocument;
    if (i) {
      instance.idFile = i;
    } else {
      instance.idFile = HoSoDuThauService.idTenderDocumentTypesData;
    }
    instance.childrenType = this.childrenOfTypeDocument;
    instance.callBack = this.closePopuup.bind(this);
  }
  closePopuup() {
    this.dialog.close();
    this.hoSoDuThauService.detectUploadFile(true);
    this.getDataDocumentOfType(false, false);
  }
  getDataDocumentOfType(alert = false, spiner = true) {
    if (spiner) { this.spinner.show(); }
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 1000)
      .subscribe(responseResultDocument => {
        this.spinner.hide();
        if (alert) {
          this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
        }
        this.rerender(responseResultDocument);
        this.dataDocumentOfType = responseResultDocument.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData ||
          item.tenderDocumentType.parentId === HoSoDuThauService.idTenderDocumentTypesData
        );
        this.listDocumentShowGroup = this.groupDocumentType(this.dataDocumentOfType);
        this.pagedResult = responseResultDocument;
        this.pagedResult.total = this.dataDocumentOfType.length;
        this.pagedResult.items = this.dataDocumentOfType;
        this.dtTrigger.next();
      }, err => {
        this.spinner.hide();
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
  }
  // Group Doc
  groupDocumentType(source: any): any {
    const groupedObj = source.reduce((prev, cur) => {
      if (!prev[cur['tenderDocumentTypeId']]) {
        prev[cur['tenderDocumentTypeId']] = [cur];
      } else {
        prev[cur['tenderDocumentTypeId']].push(cur);
      }
      return prev;
    }, {});
    const groupBeforeSort = Object.keys(groupedObj).map(tenderDocumentTypeId => (
      {
        tenderDocumentTypeId,
        items: groupedObj[tenderDocumentTypeId]
      }
    ));
    return groupBeforeSort;
  }
  renderIndex(i, k) {
    let dem = 0;
    let tam = -1;
    if (+i === 0) {
      this.sum = k + 1;
      return k + 1;
    } else {
      this.listDocumentShowGroup.forEach(ite => {
        if (tam < +i - 1) {
          ite.items.forEach(e => {
            dem++;
          });
        }
        tam++;
      });
      this.sum = dem + k + 1;
      return dem + k + 1;
    }
  }

  pagedResultChange(pagedResult: any) {
    this.spinner.show();
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(responseResultDocument => {
        this.spinner.hide();
        if (alert) {
          this.alertService.success(`Dữ liệu đã được cập nhật mới nhất!`);
        }
        this.rerender(responseResultDocument);
        this.dataDocumentOfType = responseResultDocument.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData ||
          item.tenderDocumentType.parentId === HoSoDuThauService.idTenderDocumentTypesData
        );
        this.listDocumentShowGroup = this.groupDocumentType(this.dataDocumentOfType);
        this.pagedResult = responseResultDocument;
        this.pagedResult.total = this.dataDocumentOfType.length;
        this.pagedResult.items = this.dataDocumentOfType;
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
        this.hoSoDuThauService.xoaMotHoSoDuThau(id).subscribe(res => {
          this.alertService.success('Đã xóa tài liệu!');
          this.hoSoDuThauService.detectUploadFile(true);
          this.refresh();
        }, err => {
          this.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
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
            this.hoSoDuThauService.detectUploadFile(true);
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
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 1000)
      .subscribe(responseResultBoHSDT => {
        this.spinner.hide();
        this.rerender(responseResultBoHSDT);
        this.dataDocumentOfType = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType.id === HoSoDuThauService.idTenderDocumentTypesData ||
          item.tenderDocumentType.parentId === HoSoDuThauService.idTenderDocumentTypesData
        );
        this.listDocumentShowGroup = this.groupDocumentType(this.dataDocumentOfType);
        this.pagedResult = responseResultBoHSDT;
        this.pagedResult.total = this.dataDocumentOfType.length;
        this.pagedResult.items = this.dataDocumentOfType;
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
    this.filterModel.interViewTimes = '';
    this.getDataDocumentOfType(false, false);
  }
  changeStatus(id, status) {
    if (status === 'Draft') {
      this.hoSoDuThauService.updateStatus(id, 'Official').subscribe(res => {
        this.getDataDocumentOfType(false, false);
        this.dtTrigger.next();
      }, err => {
        this.dtTrigger.next();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
    if (status === 'Official') {
      this.hoSoDuThauService.updateStatus(id, 'Draft').subscribe(res => {
        this.getDataDocumentOfType(false, false);
        this.dtTrigger.next();
      }, err => {
        this.dtTrigger.next();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
  }
  getDanhSachUser() {
    this.userService.getAllUser('').subscribe(res => {
      this.danhSachUser = res;
    });
  }
  getDanhSachLoaiHoSo() {
    this.packageId = +PackageDetailComponent.packageId;
    this.hoSoDuThauService.getDanhSachLoaiTaiLieu(this.packageId).subscribe(res => {
      this.danhSachLoaiTaiLieu = res;
      this.dataOfChildComponent = this.danhSachLoaiTaiLieu.filter(x => x.item.id === HoSoDuThauService.idTenderDocumentTypesData)[0];
      this.nameOfTypeDocument = (this.dataOfChildComponent && this.dataOfChildComponent.item) ? this.dataOfChildComponent.item.name : '';
      this.childrenOfTypeDocument = this.dataOfChildComponent ? this.dataOfChildComponent.children : [];
      this.isTypeChildDoc = (this.childrenOfTypeDocument.length) ? true : false;
    }, err => {
      this.alertService.error(`Đã có lỗi khi tải dữ liệu. Xin vui lòng thử lại!`);
    });
  }
  viewDetail(item) {
    this.currentItem = item;
    this.showPopupDetail = true;
  }

  closePopupDetail() {
    this.showPopupDetail = false;
  }
  viewFullScreenImage(listImage) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
  }
  closeView() {
    this.showPopupViewImage = false;
  }
}
