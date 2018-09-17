import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../../shared/models';
import { EmailItemModel, EmailFilter, MultipeDelete } from '../../../../../shared/models/email/email-item.model';
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs/BehaviorSubject';
import { EmailService } from '../../../../../shared/services/email.service';
import { AlertService, ConfirmationService } from '../../../../../shared/services';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
import { Router } from '../../../../../../../node_modules/@angular/router';
import { PackageEmailComponent } from '../../package-email.component';

@Component({
  selector: 'app-important-list',
  templateUrl: './important-list.component.html',
  styleUrls: ['./important-list.component.scss']
})
export class ImportantListComponent implements OnInit {

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
    this.filterModel.category = 'ImportantEmails';
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
      this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value, this.filterModel, +this.pagedResult.currentPage - 1, 5)
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
      this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value, this.filterModel, +this.pagedResult.currentPage + 1, 5)
        .subscribe(result => {
          this.rerender(result);
          this.spinner.hide();
        }, err => this.spinner.hide());
    } else {
      this.alertService.error('Bạn đang ở trang cuối cùng!');
    }
  }

  refresh() {
    this.filterModel.category = 'ImportantEmails';
    this.spinner.show();
    this.emailService.searchWithFilter(this.packageId, this.searchTerm$.value,
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
    this.router.navigate([`package/email/${this.packageId}/important/detail`], { queryParams: { page: 'important', itemId: id } });
  }


}
