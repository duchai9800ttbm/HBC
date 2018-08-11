import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { SessionService, AlertService, DataService, ConfirmationService } from '../../../shared/services/index';
import { OpportunityService } from '../../../shared/services/opportunity.service';
import { OpportunityListItem } from '../../../shared/models/opportunity/opportunity-list-item.model';
import { DictionaryItem } from '../../../shared/models/index';
import { Router } from '@angular/router';
import { PagedResult } from '../../../shared/models';
import { Subscription } from 'rxjs/Subscription';
import { OpportunityFilter } from '../../../shared/models/opportunity/opportunity-filter.model';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-opportunity-list',
  templateUrl: './opportunity-list.component.html',
  styleUrls: ['./opportunity-list.component.scss'],
  animations: [routerTransition()]
})

export class OpportunityListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  ratingRange = [1, 2, 3, 4, 5];
  pagedResult: PagedResult<OpportunityListItem> = new PagedResult<OpportunityListItem>();
  filterModel = new OpportunityFilter();
  opportunityClassifyList: Observable<DictionaryItem[]>;
  opportunityStepList: Observable<DictionaryItem[]>;
  checkboxSeclectAll: boolean;
  searchTerm$ = new BehaviorSubject<string>('');
  isLeader: boolean;
  constructor(
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private opportunityService: OpportunityService,
    private excelService: ExcelService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService
  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dtOptions = DATATABLE_CONFIG;

    this.opportunityClassifyList = this.dataService.getOpportunityClassifies();
    this.opportunityStepList = this.dataService.getOpportunitySteps();
    this.spinner.show();
    this.opportunityService.instantSearchWithFilter(this.searchTerm$, this.filterModel, 0, 10).subscribe(result => {
      this.rerender(result);
      this.spinner.hide();
    }, err => this.spinner.hide());

    this.refresh();
    const session = JSON.parse(window.localStorage.getItem('session'));
    const leaders = session.isLeaders;
    this.isLeader = leaders.some(x => x.isLeader === true);

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

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa cơ hội này?',
      () => {
        that.opportunityService.delete(deleteIds).subscribe(_ => {
          if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
            this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
          }
          that.alertService.success('Đã xóa cơ hội!');
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
    this.opportunityService
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
    this.opportunityService
      .filter(this.searchTerm$.value, this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel = new OpportunityFilter();
    this.filter();
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
      const contactName = x.contact ? `${x.contact.lastName} ${x.contact.firstName}` : '';
      return {
        'Tên cơ hội': x.opportunityName ? x.opportunityName : '',
        'Khách hàng': x.customerName ? x.customerName : '',
        'Liên hệ': contactName,
        'Phân loại': this.translateService.instant(x.category || 'null'),
        'Giá trị dự kiến': x.expectedValue ? x.expectedValue : 0,
        'Giai đoạn': this.translateService.instant(x.phase || 'null'),
        'Xác suất': x.probability ? x.probability : 0,
        'Phân công cho': x.assignTo ? x.assignTo : ''
      };
    });
    this.excelService.exportAsExcelFile(exportItems, 'CoHoi');
  }


}


