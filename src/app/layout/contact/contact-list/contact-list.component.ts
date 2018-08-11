import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService, DataService, ContactService, ConfirmationService } from '../../../shared/services/index';
import { ContactListItem, DictionaryItem } from '../../../shared/models/index';
import { PagedResult } from '../../../shared/models';
import { Subscription } from 'rxjs/Subscription';
import { ContactFilter } from '../../../shared/models/contact/contact-filter.model';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadTemplateService } from '../../../shared/services/download-template.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.scss'],
  animations: [routerTransition()]
})

export class ContactListComponent implements OnInit {
  dtElement: DataTableDirective;
  dtOptions: any = {};
  checkboxSeclectAll: boolean;
  dtTrigger: Subject<any> = new Subject();
  prospectSourceList: Observable<DictionaryItem[]>;
  pagedResult: PagedResult<ContactListItem> = new PagedResult<ContactListItem>();
  searchTerm$ = new BehaviorSubject<string>('');

  filterModel = new ContactFilter();

  constructor(
    private router: Router,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private contactService: ContactService,
    private excelService: ExcelService,
    private translateService: TranslateService,
    private downloadTemplate: DownloadTemplateService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.dtOptions = DATATABLE_CONFIG;

    this.prospectSourceList = this.dataService.getProspectSources();
    this.spinner.show();
    this.contactService.instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10).subscribe(result => {
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

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa liên hệ này?',
      () => {
        that.contactService.delete(deleteIds).subscribe(_ => {
          if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
            this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
          }
          that.alertService.success('Đã xóa liên hệ!');
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
  sendEmail(id: number | string) {

  }

  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.contactService
      .filter(this.searchTerm$.value, this.filterModel, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.spinner.hide();
      }, err => this.spinner.hide());
  }
  filter() {
    this.spinner.show();
    this.contactService
      .filter(this.searchTerm$.value, this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel = new ContactFilter();
    this.filter();

  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    const that = this;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.contactService.importFile(file)
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
        'Danh xưng': x.salutation ? x.salutation : '',
        'Họ': x.lastName ? x.lastName : '',
        'Tên': x.firstName ? x.firstName : '',
        'ĐT phòng': x.companyPhone ? x.companyPhone : '',
        'ĐT di động': x.mobilePhone ? x.mobilePhone : '',
        'Địa chỉ email': x.email ? x.email : '',
        'Tên khách hàng': x.companyName ? x.companyName : '',
        'Chức danh': x.jobTitle ? x.jobTitle : '',
        'Phân công cho': x.assignTo ? x.assignTo : ''
      };
    });
    this.excelService.exportAsExcelFile(exportItems, 'LienHe');
  }
  downTemplate() {
    this.downloadTemplate.downloadTemplate('contact')
      .subscribe(result => result);
  }
}
