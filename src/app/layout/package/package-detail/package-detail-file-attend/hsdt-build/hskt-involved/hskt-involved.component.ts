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

@Component({
  selector: 'app-hskt-involved',
  templateUrl: './hskt-involved.component.html',
  styleUrls: ['./hskt-involved.component.scss']
})
export class HsktInvolvedComponent implements OnInit {
  isShowMenu = false;

  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG2;
  dtTrigger: Subject<any> = new Subject();
  filterModel = new BidDocumentFilter();
  searchTerm;
  pagedResultUser: PagedResult<UserModel> = new PagedResult<UserModel>();
  datePickerConfig = DATETIME_PICKER_CONFIG;
  packageId;
  showPopupAdd = false;
  showPopupDetail = false;

  typeFileUpload = {
    id: '2',
    text: 'Quyển HSMT',
  };
  currentItem = {};
  userListItem: UserItemModel[];
  ListItem: BidDocumentModel[];
  majorTypeListItem: DictionaryItemHightLight[];
  bidDocumentGroupListItem: BidDocumentGroupModel[];
  bidDocumentGroupListItemSearchResult: BidDocumentGroupModel[];
  packageData: PackageInfoModel;
  tableEmpty: boolean;
  currentMajorTypeId = 1;
  currentMajorTypeText = '';
  sum = 0;
  showTable = false;
  danhSachHoSoKT;
  get titleStr() {
    if (this.majorTypeListItem && this.majorTypeListItem.length > 0) {
      return this.majorTypeListItem.find(i => i.id === this.currentMajorTypeId).text;
    }
  }
  constructor(
    private hoSoDuThauService: HoSoDuThauService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private documentService: DocumentService,
    private userService: UserService,
    private opportunityHsmtService: OpportunityHsmtService,
    private packageService: PackageService,
    private dataService: DataService
  ) {
  }
  ngOnInit() {
    this.packageId = +PackageDetailComponent.packageId;
    this.getDanhSachBoHoSo_KT();
    this.packageService.getInforPackageID(this.packageId).subscribe(result => {
      this.packageData = result;
      switch (this.packageData.hsmtStatus.id) {
        case 'DaDuHSMT': {
          this.router.navigate([`/package/detail/${this.packageId}/invitation/full-file`]);
          break;
        }
        default: {
          break;
        }
      }
    });
  }
  getDanhSachBoHoSo_KT() {
    this.hoSoDuThauService.danhSachBoHoSoDuThau(this.packageId, 0, 10)
      .subscribe(responseResultBoHSDT => {
        this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
          item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
        );
        this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
        this.sum = this.danhSachHoSoKT.length;
        this.dtTrigger.next();
        this.spinner.hide();
      }, err => {
        this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
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
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }

  deleteDocument(id) {
    const that = this;
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa tài liệu này?',
      () => {
        this.hoSoDuThauService.xoaMotHoSoDuThau(id).subscribe(res => {
          that.alertService.success('Đã xóa tài liệu!');
          that.refresh();
        }, err => this.spinner.hide());
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
        this.hoSoDuThauService.danhSachBoHoSoDuThau(this.packageId, 0, 10)
          .subscribe(responseResultBoHSDT => {
            this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
              item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
            );
            this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
            this.sum = this.danhSachHoSoKT.length;
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
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
        this.hoSoDuThauService.danhSachBoHoSoDuThau(this.packageId, 0, 10)
          .subscribe(responseResultBoHSDT => {
            this.danhSachHoSoKT = responseResultBoHSDT.items.filter(item =>
              item.tenderDocumentType === 'Các hồ sơ kỹ thuật khác'
            );
            this.showTable = (this.danhSachHoSoKT.length > 0) ? true : false;
            this.sum = this.danhSachHoSoKT.length;
            this.dtTrigger.next();
            this.spinner.hide();
          }, err => {
            this.alertService.error(`Đã xảy ra lỗi khi load danh sách bộ Hồ sơ.`);
          });
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
}
