import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { Observable } from 'rxjs/Observable';
import { ProspectService, AlertService, DataService } from '../../../shared/services';
import { ProspectListItem, DictionaryItem, PagedResult, ProspectFilter } from '../../../shared/models';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { Subject, BehaviorSubject } from 'rxjs';
import { ConfirmationService } from '../../../shared/services';
import { COMMON_CONSTANTS } from '../../../shared/configs/common.config';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { DownloadTemplateService } from '../../../shared/services/download-template.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-prospect-list',
  templateUrl: './prospect-list.component.html',
  styleUrls: ['./prospect-list.component.scss'],
  animations: [routerTransition()]
})

export class ProspectListComponent implements OnInit {
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  pagedResult: PagedResult<ProspectListItem> = new PagedResult<ProspectListItem>();

  prospectSourceList: Observable<DictionaryItem[]>;

  vd: Observable<DictionaryItem[]>;
  businessList: Observable<DictionaryItem[]>;
  evaluationList: Observable<DictionaryItem[]>;

  term: string;
  searchTerm$ = new BehaviorSubject<string>('');
  filterModel = new ProspectFilter();

  checkboxSeclectAll: boolean;

  constructor(
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private prospectService: ProspectService,
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
    this.businessList = this.dataService.getBusiness();
    this.evaluationList = this.dataService.getProspectEvaluations();
    this.spinner.show();

    this.searchTerm$
      .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term => {
        this.prospectService
          .filter(term, this.filterModel, 0, 10)
          .subscribe(result => {
            this.spinner.hide();
            this.rerender(result);
          }, err => this.spinner.hide());
      });

    // this.refresh();
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

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa tiềm năng này?',
      () => {
        that.prospectService
          .delete(deleteIds)
          .subscribe(_ => {
            if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
              this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
            }
            that.alertService.success('Đã xóa tiềm năng!');
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

  refresh(displayAlert: boolean = false) {
    this.spinner.show();
    this.prospectService
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
    this.prospectService
      .filter(this.searchTerm$.value, this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel = new ProspectFilter();
    this.filter();

  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    const that = this;
    if (fileList.length > 0) {
      const file = fileList[0];
      this.prospectService.importFile(file)
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
        'Danh xưng': this.translateService.instant(x.salutation || 'null'),
        'Họ': x.lastName ? x.lastName : '',
        'Tên': x.firstName ? x.firstName : '',
        'Đánh giá': this.translateService.instant(x.evaluation || 'null'),
        'Điện thoại chính': x.companyPhone ? x.companyPhone : '',
        'Điện thoại di động': x.mobilePhone ? x.mobilePhone : '',
        'Địa chỉ email': x.email ? x.email : '',
        'Nguồn tiềm năng': this.translateService.instant(x.source || 'null'),
        'Lĩnh vực hoạt động': this.translateService.instant(x.business || 'null'),
        'Tên công ty': x.companyName ? x.companyName : '',
        'Phân công cho': x.assignTo ? x.assignTo : '',
      };
    });
    this.excelService.exportAsExcelFile(exportItems, 'TiemNang');
  }

  downTemplate() {
    this.downloadTemplate.downloadTemplate('prospect')
      .subscribe(result => result);
  }

}
