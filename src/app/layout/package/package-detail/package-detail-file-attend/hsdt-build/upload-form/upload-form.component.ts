import { Component, OnInit, OnDestroy } from '@angular/core';
import { DATATABLE_CONFIG, DATATABLE_CONFIG2 } from '../../../../../../shared/configs';
// tslint:disable-next-line:import-blacklist
import { Subject, BehaviorSubject, Subscription } from 'rxjs';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { PackageDetailComponent } from '../../../package-detail.component';
import { HoSoDuThauService } from '../../../../../../shared/services/ho-so-du-thau.service';
import { DialogService } from '@progress/kendo-angular-dialog';
import { AlertService, ConfirmationService, UserService } from '../../../../../../shared/services';
import { PagedResult } from '../../../../../../shared/models';
import { DanhSachBoHsdtItem } from '../../../../../../shared/models/ho-so-du-thau/danh-sach-bo-hsdt-item.model';
import { HsdtFilterModel } from '../../../../../../shared/models/ho-so-du-thau/hsdt-filter.model';
import { UploadFileHsdtComponent } from '../upload-file-hsdt/upload-file-hsdt.component';
import { ListDocumentTypeIdGroup } from '../../../../../../shared/models/ho-so-du-thau/list-document-type.model';
import { UserItemModel } from '../../../../../../shared/models/user/user-item.model';
import { PermissionService } from '../../../../../../shared/services/permission.service';
import { PermissionModel } from '../../../../../../shared/models/permission/permission.model';
import { DocumentTypeId } from '../../../../../../shared/constants/document-type-id';
import { ScrollToTopService } from '../../../../../../shared/services/scroll-to-top.service';

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
  isChotHoSo: boolean;

  listPermission: Array<PermissionModel>;

  listPerTomTatDK = [];
  listPerYeuCauBaoGiaVatTu = [];
  listPerBaoCaoThamQuanCongTrinh = [];
  listPerBangTinhChiPhiChung = [];
  listPerCauHoiLamRo = [];

  currentDocumentTypeId = 0;
  listPermissionScreen3 = [];
  documentTypeId = DocumentTypeId;
  ChotHSDT = false;

  BangTomTatDKTemplate = false;
  YeuCauBaoGiaVatTuTemplate = false;
  BaoCaoThamQuanCongTrinhTemplate = false;
  BangTinhChiPhiChungTemplate = false;
  BangCauHoiLamRoTemplate = false;


  XoaFile = false;
  UploadFile = false;
  DownLoadFile = false;
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private dialogService: DialogService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private userService: UserService,
    private permissionService: PermissionService,
    private scrollTopService: ScrollToTopService
  ) { }

  ngOnInit() {
    this.scrollTopService.isScrollTop = false;

    this.subscription = this.hoSoDuThauService.watchChangingRouter().subscribe(data => {
      this.getDanhSachUser();
      this.getDanhSachLoaiHoSo();
      this.getDataDocumentOfType();
      this.filterModel.status = '';
      this.filterModel.uploadedEmployeeId = '';
    });

    const permission$ = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPerTomTatDK = [];
        this.listPerYeuCauBaoGiaVatTu = [];
        this.listPerBaoCaoThamQuanCongTrinh = [];
        this.listPerBangTinhChiPhiChung = [];
        this.listPerCauHoiLamRo = [];
        this.listPermissionScreen3 = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauFile')[0];
        if (!screen) {
          this.listPerTomTatDK = [];
          this.listPerYeuCauBaoGiaVatTu = [];
          this.listPerBaoCaoThamQuanCongTrinh = [];
          this.listPerBangTinhChiPhiChung = [];
          this.listPerCauHoiLamRo = [];
        }
        if (screen) {
          this.listPermissionScreen3 = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.currentDocumentTypeId).map(z => z.value);
          this.listPerTomTatDK = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTomTatDK).map(z => z.value);
          this.listPerYeuCauBaoGiaVatTu = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.YeuCauBaoGiaVatTu).map(z => z.value);
          this.listPerBaoCaoThamQuanCongTrinh = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BaoCaoThamQuanCongTrinh).map(z => z.value);
          this.listPerBangTinhChiPhiChung = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTinhChiPhiChung).map(z => z.value);
          this.listPerCauHoiLamRo = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangCauHoiLamRo).map(z => z.value);
        }
      }
      this.BangTomTatDKTemplate = this.listPerTomTatDK.includes('TaiTemplate');
      this.YeuCauBaoGiaVatTuTemplate = this.listPerYeuCauBaoGiaVatTu.includes('TaiTemplate');
      this.BaoCaoThamQuanCongTrinhTemplate = this.listPerBaoCaoThamQuanCongTrinh.includes('TaiTemplate');
      this.BangTinhChiPhiChungTemplate = this.listPerBangTinhChiPhiChung.includes('TaiTemplate');
      this.BangCauHoiLamRoTemplate = this.listPerCauHoiLamRo.includes('TaiTemplate');
      console.log(this.listPerCauHoiLamRo);
      this.XoaFile = this.listPermissionScreen3.includes('XoaFile');
      this.UploadFile = this.listPermissionScreen3.includes('UploadHSDT');
      this.DownLoadFile = this.listPermissionScreen3.includes('DownloadFile');

    });

    const statusPackage$ = this.hoSoDuThauService.watchStatusPackage().subscribe(status => {
      this.isChotHoSo = status;
    });
    this.subscription.add(permission$);
    this.subscription.add(statusPackage$);
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  showError() {
    if (this.isChotHoSo) {
      return this.alertService.error('Bạn không thể upload file khi đã chốt hồ sơ');
    }
    return null;
  }
  showDialogUploadFile(i) {
    if (this.isChotHoSo) {
      return this.alertService.error('Bạn không thể upload file khi đã chốt hồ sơ');
    }
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
    this.getDataDocumentOfType(false);
  }
  getDataDocumentOfType(alert = false) {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, 0, 1000)
      .subscribe(responseResultDocument => {
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
    this.hoSoDuThauService
      .danhSachBoHoSoDuThauInstantSearch(this.packageId, this.searchTerm$, this.filterModel, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(responseResultDocument => {
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
          this.hoSoDuThauService.xoaNhieuHoSoDuThau(listId).subscribe(res => {
            this.alertService.success('Đã xóa tài liệu!');
            this.hoSoDuThauService.detectUploadFile(true);
            this.refresh();
          }, err => {
            this.alertService.error(`Đã có lỗi. Tài liệu chưa được xóa!`);
          });
        });
    }
  }
  refresh() {
    this.getDataDocumentOfType(true);
  }
  filter() {
    this.hoSoDuThauService
      .danhSachBoHoSoDuThau(this.packageId, this.searchTerm$.value, this.filterModel, 0, 1000)
      .subscribe(responseResultBoHSDT => {
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
        this.alertService.error(`Đã có lỗi xảy ra. Xin vui lòng thử lại!`);
      });
    this.dtTrigger.next();
  }
  clearFilter() {
    this.filterModel.status = '';
    this.filterModel.uploadedEmployeeId = '';
    this.filterModel.createdDate = null;
    this.filterModel.interViewTimes = '';
    this.getDataDocumentOfType(false);
  }
  changeStatus(hoso) {
    if (hoso.status === 'Draft') {
      this.hoSoDuThauService.updateStatus(hoso.id, 'Official').subscribe(res => {
        hoso.status = 'Official';
      }, err => {
        this.dtTrigger.next();
        this.alertService.error('Đã có lỗi. Dữ liệu chưa được cập nhật!');
      });
    }
    if (hoso.status === 'Official') {
      this.hoSoDuThauService.updateStatus(hoso.id, 'Draft').subscribe(res => {
        hoso.status = 'Draft';
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
      this.currentDocumentTypeId = HoSoDuThauService.idTenderDocumentTypesData;

      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPerTomTatDK = [];
        this.listPerYeuCauBaoGiaVatTu = [];
        this.listPerBaoCaoThamQuanCongTrinh = [];
        this.listPerBangTinhChiPhiChung = [];
        this.listPerCauHoiLamRo = [];
        this.listPermissionScreen3 = [];
      }
      if (hsdt) {
        const screen = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'LapHoSoDuThauFile')[0];
        if (!screen) {
          this.listPerTomTatDK = [];
          this.listPerYeuCauBaoGiaVatTu = [];
          this.listPerBaoCaoThamQuanCongTrinh = [];
          this.listPerBangTinhChiPhiChung = [];
          this.listPerCauHoiLamRo = [];
        }
        if (screen) {
          this.listPermissionScreen3 = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.currentDocumentTypeId).map(z => z.value);
          this.listPerTomTatDK = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTomTatDK).map(z => z.value);
          this.listPerYeuCauBaoGiaVatTu = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.YeuCauBaoGiaVatTu).map(z => z.value);
          this.listPerBaoCaoThamQuanCongTrinh = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BaoCaoThamQuanCongTrinh).map(z => z.value);
          this.listPerBangTinhChiPhiChung = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangTinhChiPhiChung).map(z => z.value);
          this.listPerCauHoiLamRo = screen.permissions
            .filter(t => t.tenderDocumentTypeId === this.documentTypeId.BangCauHoiLamRo).map(z => z.value);
        }
      }
      this.BangTomTatDKTemplate = this.listPerTomTatDK.includes('TaiTemplate');
      this.YeuCauBaoGiaVatTuTemplate = this.listPerYeuCauBaoGiaVatTu.includes('TaiTemplate');
      this.BaoCaoThamQuanCongTrinhTemplate = this.listPerBaoCaoThamQuanCongTrinh.includes('TaiTemplate');
      this.BangTinhChiPhiChungTemplate = this.listPerBangTinhChiPhiChung.includes('TaiTemplate');
      this.BangCauHoiLamRoTemplate = this.listPerCauHoiLamRo.includes('TaiTemplate');

      this.XoaFile = this.listPermissionScreen3.includes('XoaFile');
      this.UploadFile = this.listPermissionScreen3.includes('UploadHSDT');
      this.DownLoadFile = this.listPermissionScreen3.includes('DownloadFile');



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
