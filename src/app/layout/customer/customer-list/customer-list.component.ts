import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { CustomerListItem, DictionaryItem, PagedResult } from '../../../shared/models';
import { Subject, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { AlertService, DataService, CustomerService, ConfirmationService } from '../../../shared/services/index';
import { Router } from '@angular/router';
import { CustomerFilter } from '../../../shared/models/customer/customer-filter.model';
import { TranslateService } from '@ngx-translate/core';
import { ExcelService } from '../../../shared/services/excel.service';
import { DownloadTemplateService } from '../../../shared/services/download-template.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  animations: [routerTransition()]
})

export class CustomerListComponent implements OnInit {
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ratingRange = [1, 2, 3, 4, 5];
  checkboxSeclectAll: boolean;
  businessList: Observable<DictionaryItem[]>;
  customerGroupList: Observable<DictionaryItem[]>;
  pagedResult: PagedResult<CustomerListItem> = new PagedResult<CustomerListItem>();
  filterModel = new CustomerFilter();
  searchTerm$ = new BehaviorSubject<string>('');


  constructor(
    private router: Router,
    private alertService: AlertService,
    private dataService: DataService,
    private confirmationService: ConfirmationService,
    private customerService: CustomerService,
    private translateService: TranslateService,
    private excelService: ExcelService,
    private downloadTemplate: DownloadTemplateService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dtOptions = DATATABLE_CONFIG;

    this.businessList = this.dataService.getBusiness();
    this.customerGroupList = this.dataService.getCustomerGroups();
    this.spinner.show();
    this.customerService.instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10).subscribe(result => {
      this.rerender(result);
      this.spinner.hide();
    }, err => this.spinner.hide());
    this.refresh();

  }

  pagedResultChange(pagedResult: any) {
    this.refresh();
  }

  delete(ids: number | number[]) {
    const that = this;

    let deleteIds = [];
    if (!(ids instanceof Array)) {
      deleteIds = [ids];
    } else {
      deleteIds = ids;
    }

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa khách hàng này?',
      () => {
        that.customerService.delete(deleteIds).subscribe(_ => {
          if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
            this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
          }
          that.alertService.success('Đã xóa khách hàng!');
          that.refresh();
        });
      });
  }

  multiDelete() {
    const deleteIds = this.pagedResult.items
      .filter(x => x.checkboxSelected)
      .map(x => +x.id);

    if (deleteIds.length === 0) {
      this.alertService.error('Bạn phải chọn ít nhất một đối tượng để xóa!');
    } else {
      this.delete(deleteIds);
    }


  }

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.customerService
      .filter(this.searchTerm$.value, this.filterModel, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(data => {
        this.rerender(data);
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  filter() {
    this.spinner.show();
    this.customerService
      .filter(this.searchTerm$.value, this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel = new CustomerFilter();
    this.filter();

  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    const that = this;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.customerService.importFile(file)
        .subscribe(result => {
          that.refresh();
          this.alertService.success('Bạn đã nhập dữ liệu thành công!');
        }, err => {
          this.alertService.error('Bạn đã nhập dữ liệu thất bại, vui lòng nhập đúng template!');
        });
    }
  }

  rerender(pagedResult: any) {
    this.checkboxSeclectAll = false;
    this.pagedResult = pagedResult;
    this.dtTrigger.next();
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => x.checkboxSelected = value);
  }

  exportFileExcel() {
    const exportItems = this.pagedResult.items.map(x => {
      return {
        'Tên khách hàng': x.customerName ? x.customerName : '',
        'ĐT chính': x.customerPhone ? x.customerPhone : '',
        'Website': x.website ? x.website : '',
        'Email chính': x.email ? x.email : '',
        'Nhóm': this.translateService.instant(x.group || 'null'),
        'Đánh giá': x.rating ? x.rating : 0,
        'Doanh thu/năm': x.revenue ? x.revenue : 0,
        'Phân công cho': x.assignTo ? x.assignTo : '',
      };
    });
    this.excelService.exportAsExcelFile(exportItems, 'KhachHang');
  }
  downTemplate() {
    this.downloadTemplate.downloadTemplate('customer')
      .subscribe(result => result);
  }
}
