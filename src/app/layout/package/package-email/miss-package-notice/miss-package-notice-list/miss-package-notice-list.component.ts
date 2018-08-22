import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../../shared/models';
import { EmailItemModel, EmailFilter, MultipeDelete } from '../../../../../shared/models/email/email-item.model';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs/BehaviorSubject';
import { EmailService } from '../../../../../shared/services/email.service';
import { AlertService } from '../../../../../shared/services/alert.service';
import { ConfirmationService } from '../../../../../shared/services';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { PackageEmailComponent } from '../../package-email.component';

@Component({
  selector: 'app-miss-package-notice-list',
  templateUrl: './miss-package-notice-list.component.html',
  styleUrls: ['./miss-package-notice-list.component.scss']
})
export class MissPackageNoticeListComponent implements OnInit {

  pagedResult: PagedResult<EmailItemModel> = new PagedResult<EmailItemModel>();
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new EmailFilter();
  checkboxSeclectAll: boolean;
  packageId;
  isShowButtonUp: boolean;
  isShowButtonDown: boolean;
  isShowEmpty = false;
  constructor(
    private emailService: EmailService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {

  }
  ngOnInit() {
    this.packageId = +PackageEmailComponent.packageId;
    this.filterModel.category = 'AnnounceFailBidOpportunity';
    this.spinner.show();
    this.emailService.instantSearchWithFilter(this.packageId, this.searchTerm$, this.filterModel, 0, 5)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());

  }

  down() {
    if (+this.pagedResult.currentPage > 0) {
      this.spinner.show();
      this.emailService.instantSearchWithFilter(this.packageId, this.searchTerm$, this.filterModel, +this.pagedResult.currentPage - 1, 5)
        .subscribe(result => {
          this.rerender(result);
          this.spinner.hide();
        }, err => this.spinner.hide());
    } else {
      this.alertService.error('Bạn đang ở trang đầu tiên!');
    }
  }

  up() {
    if (+this.pagedResult.pageCount > (+this.pagedResult.currentPage + 1)) {
      this.spinner.show();
      this.emailService.instantSearchWithFilter(this.packageId, this.searchTerm$, this.filterModel, +this.pagedResult.currentPage + 1, 5)
        .subscribe(result => {
          this.rerender(result);
          this.spinner.hide();
        }, err => this.spinner.hide());
    } else {
      this.alertService.error('Bạn đang ở trang cuối cùng!');
    }
  }

  refresh() {
    this.filterModel.category = 'AnnounceFailBidOpportunity';
    this.spinner.show();
    this.emailService.instantSearchWithFilter(this.packageId, this.searchTerm$,
      this.filterModel, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
        this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
      }, err => this.spinner.hide());
  }

  rerender(pagedResult: any) {
    this.checkboxSeclectAll = false;
    this.pagedResult = pagedResult;
    this.checkButtonUpDown();

  }

  changeImportant(id) {
    this.emailService.maskAsImportant(id).subscribe(data => {
      this.emailService.instantSearchWithFilter(
        this.packageId,
        this.searchTerm$,
        this.filterModel,
        this.pagedResult.currentPage,
        this.pagedResult.pageSize
      )
        .subscribe(result => {
          this.rerender(result);
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
            .delete(obj)
            .subscribe(_ => {
              if (this.pagedResult.items.length === obj.ids.length && +this.pagedResult.currentPage > 0) {
                this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
              }
              that.alertService.success('Đã xóa email thành công!');
              that.refresh();
            });
        });
    } else {
      this.alertService.error('Vui lòng chọn ít nhất 1 email để xóa!');
    }
  }

  goToDetail(id) {
    this.router.navigate([`package/email/${this.packageId}/miss/detail`], { queryParams: { page: 'miss', itemId: id } });
  }


}
