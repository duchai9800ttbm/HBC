import { DataTableDirective } from 'angular-datatables';
import { Component, OnInit, ViewChild } from '@angular/core';
import { routerTransition } from '../../../router.animations';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { CampaignService } from '../../../shared/services/campaign.service';
import { SessionService } from '../../../shared/services/session.service';
import { AlertService } from '../../../shared/services/alert.service';
import { CampaignModel, DictionaryItem, CampaignListItem } from '../../../shared/models/index';
import { DataService, ConfirmationService } from '../../../shared/services/index';
import { Router } from '@angular/router';
import { PagedResult } from '../../../shared/models';
import { Subscription } from 'rxjs/Subscription';
import { CampaignFilter } from '../../../shared/models/campaign/campaign-filter.model';
import { ExcelService } from '../../../shared/services/excel.service';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-campaign-list',
  templateUrl: './campaign-list.component.html',
  styleUrls: ['./campaign-list.component.scss'],
  animations: [routerTransition()]
})

export class CampaignListComponent implements OnInit {
  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  pagedResult: PagedResult<CampaignListItem> = new PagedResult<CampaignListItem>();
  checkboxSeclectAll: boolean;
  campaignStatusList: Observable<DictionaryItem[]>;
  campaignTypeList: Observable<DictionaryItem[]>;
  filterModel = new CampaignFilter();
  searchTerm$ = new BehaviorSubject<string>('');

  constructor(
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private dataService: DataService,
    private campaignService: CampaignService,
    private excelService: ExcelService,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService

  ) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);

    this.dtOptions = DATATABLE_CONFIG;

    this.campaignStatusList = this.dataService.getCampaignStatus();
    this.campaignTypeList = this.dataService.getCampaignTypes();
    this.spinner.show();
    this.campaignService.instantSearch(this.searchTerm$, 0, 10).subscribe(result => {
      this.rerender(result);
      this.spinner.hide();
    }, err => this.spinner.hide());

    this.campaignService.search(this.searchTerm$.value, 0, 10).subscribe(result => {
      this.rerender(result);
    });


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

    this.confirmationService.confirm('Bạn có chắc chắn muốn xóa chiến dịch này?',
      () => {
        that.campaignService.delete(deleteIds).subscribe(_ => {
          if (this.pagedResult.items.length === deleteIds.length && +this.pagedResult.currentPage > 0) {
            this.pagedResult.currentPage = +this.pagedResult.currentPage - 1;
          }
          that.alertService.success('Đã xóa chiến dịch!');
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
  filter() {
    this.spinner.show();
    this.campaignService
      .filter(this.searchTerm$.value, this.filterModel, 0, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.spinner.hide();
      }, err => this.spinner.hide());
  }

  clearFilter() {
    this.filterModel = new CampaignFilter();
    this.filter();

  }
  refresh(displayAlert: boolean = false): void {
    this.spinner.show();
    this.campaignService
      .search(this.searchTerm$.value, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        if (displayAlert) {
          this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
        }
        this.spinner.hide();
      }, err => this.spinner.hide());
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
        'Tên chiến dịch': this.translateService.instant(x.category || 'null'),
        'Loại chiến dịch': this.translateService.instant(x.category || 'null'),
        'Trạng thái': this.translateService.instant(x.status || 'null'),
        'Ngày bắt đầu': moment(x.campaignDateStart).format('L'),
        'Ngày dự kiến xong': moment(x.campaignDateStop).format('L'),
        'Mục tiêu chiến dịch': x.target ? x.target : '',
        'Số lượng': x.numberOfParticipants ? x.numberOfParticipants : 0,
        'Phân công cho': x.assignTo ? x.assignTo : '',
      };
    });
    this.excelService.exportAsExcelFile(exportItems, 'ChienDich');
  }
}
