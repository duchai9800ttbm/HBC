import { Component, OnInit, OnDestroy } from '@angular/core';
import { PagedResult } from '../../../../../shared/models';
import { EmailItemModel, EmailFilter, MultipeDelete } from '../../../../../shared/models/email/email-item.model';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs/BehaviorSubject';
import { EmailService } from '../../../../../shared/services/email.service';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { PackageEmailComponent } from '../../package-email.component';
import { Subscription } from '../../../../../../../node_modules/rxjs/Subscription';
import { PermissionModel } from '../../../../../shared/models/permission/permission.model';
import { PermissionService } from '../../../../../shared/services/permission.service';

@Component({
  selector: 'app-interview-notice-list',
  templateUrl: './interview-notice-list.component.html',
  styleUrls: ['./interview-notice-list.component.scss']
})
export class InterviewNoticeListComponent implements OnInit, OnDestroy {
  loading = false;
  pagedResult: PagedResult<EmailItemModel> = new PagedResult<EmailItemModel>();
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new EmailFilter();
  checkboxSeclectAll: boolean;
  packageId;
  isShowButtonUp: boolean;
  isShowButtonDown: boolean;
  isShowEmpty = false;

  subscription: Subscription;
  listPermission: Array<PermissionModel>;
  listPermissionScreen = [];
  listPermissionScreen2 = [];
  listPermissionScreenKQ = [];
  listPermissionScreenKQ2 = [];

  XemEmail = false;
  XemEmailTBPV = false;
  XemEmailPhanHoi = false;
  XemMailThongBaoTrungThau = false;
  XemMailChuyenGiao = false;
  XemDanhSachEmailDaGui = false;
  constructor(
    private emailService: EmailService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private permissionService: PermissionService

  ) {

  }
  ngOnInit() {
    this.packageId = +PackageEmailComponent.packageId;

    this.subscription = this.permissionService.get().subscribe(data => {
      this.listPermission = data;
      const hsdt = this.listPermission.length &&
        this.listPermission.filter(x => x.bidOpportunityStage === 'HSDT')[0];
      if (!hsdt) {
        this.listPermissionScreen2 = [];
      }
      if (hsdt) {
        const screen2 = hsdt.userPermissionDetails.length
          && hsdt.userPermissionDetails.filter(y => y.permissionGroup.value === 'QuanLyPhongVanThuongThao')[0];
        if (!screen2) {
          this.listPermissionScreen2 = [];
        }
        if (screen2) {
          this.listPermissionScreen2 = screen2.permissions.map(z => z.value);
        }
      }
      this.XemEmailTBPV = this.listPermissionScreen2.includes('XemEmailTBPV');
      setTimeout(() => {
        if (!this.XemEmailTBPV) {
          this.router.navigate(['not-found']);
        }
      }, 300);
    });

    this.filterModel.category = 'AnnounceInterview';
    this.loading = true;
    this.emailService.instantSearchWithFilter(this.packageId, this.searchTerm$, this.filterModel, 0, 5)
      .subscribe(result => {
        this.rerender(result);
        this.loading = false;
      }, err => this.loading = false);

  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  down() {
    if (+this.pagedResult.currentPage > 0) {
      this.loading = true;
      this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value, this.filterModel, +this.pagedResult.currentPage - 1, 5)
        .subscribe(result => {
          this.rerender(result);
          this.loading = false;
        }, err => this.loading = false);
    } else {
      this.alertService.error('Bạn đang ở trang đầu tiên!');
    }
  }

  up() {
    if (+this.pagedResult.pageCount > (+this.pagedResult.currentPage + 1)) {
      this.loading = true;
      this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value, this.filterModel, +this.pagedResult.currentPage + 1, 5)
        .subscribe(result => {
          this.rerender(result);
          this.loading = false;
        }, err => this.loading = false);
    } else {
      this.alertService.error('Bạn đang ở trang cuối cùng!');
    }
  }

  refresh() {
    this.filterModel.category = 'AnnounceInterview';
    this.loading = true;
    this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value,
      this.filterModel, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.loading = false;
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => this.loading = false);
  }

  rerender(pagedResult: any) {
    this.checkboxSeclectAll = false;
    this.pagedResult = pagedResult;
    this.checkButtonUpDown();

  }

  important(id) {
    this.emailService.important(id).subscribe(data => {
      this.emailService.searchWithFilter(
        this.packageId,
        this.searchTerm$.value,
        this.filterModel,
        this.pagedResult.currentPage,
        this.pagedResult.pageSize
      )
        .subscribe(result => {
          this.rerender(result);
          this.emailService.emitEvent();

        }, err => {
          this.alertService.error('Đã có lỗi sảy ra, xin vui lòng thử lại sau!');
        });
    });
  }
  unImportant(id) {
    this.emailService.unImportant(id).subscribe(data => {
      this.emailService.searchWithFilter(
        this.packageId,
        this.searchTerm$.value,
        this.filterModel,
        this.pagedResult.currentPage,
        this.pagedResult.pageSize
      )
        .subscribe(result => {
          this.rerender(result);
          this.emailService.emitEvent();

        }, err => {
          this.alertService.error('Đã có lỗi sảy ra, xin vui lòng thử lại sau!');
        });
    });
  }


  onSelectAll(value: boolean) {
    this.checkboxSeclectAll = value;
    this.pagedResult.items.forEach(x => x.checkboxSelected = value);
  }

  checkButtonUpDown() {
    this.isShowButtonUp = +this.pagedResult.pageCount > (+this.pagedResult.currentPage + 1);
    this.isShowButtonDown = +this.pagedResult.currentPage > 0;
    this.isShowEmpty = !(this.pagedResult.total > 0);
  }

  delete() {
    const that = this;
    const obj = new MultipeDelete();
    obj.ids = [...this.pagedResult.items].filter(x => x.checkboxSelected === true).map(x => x.id);
    if (obj.ids.length > 0) {
      this.confirmationService.confirm('Bạn có chắc chắn muốn xóa những email này?',
        () => {
          that.spinner.show();
          that.emailService
            .moveToTrash(obj)
            .subscribe(_ => {
              if (this.pagedResult.items.length === obj.ids.length && +this.pagedResult.currentPage > 0) {
                this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
              }
              that.emailService.emitEvent();
              that.alertService.success('Đã xóa email thành công!');
              that.refresh();
            });
        });
    } else {
      this.alertService.error('Vui lòng chọn ít nhất 1 email để xóa!');
    }
  }

  goToDetail(id) {
    this.router.navigate([`package/email/${this.packageId}/interview/detail`], { queryParams: { page: 'interview', itemId: id } });
  }

}
