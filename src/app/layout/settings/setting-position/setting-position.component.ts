import { Component, OnInit } from '@angular/core';
import { PackageFilter } from '../../../shared/models/package/package-filter.model';
import { PagedResult, DictionaryItem } from '../../../shared/models';
import {
  DataService,
  ConfirmationService,
  AlertService
} from '../../../shared/services';
import { Observable, BehaviorSubject, Subject } from '../../../../../node_modules/rxjs';
import { SettingService } from '../../../shared/services/setting.service';
import { LocationListItem } from '../../../shared/models/setting/location-list-item';
import { COMMON_CONSTANTS } from '../../../shared/configs/common.config';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';
@Component({
  selector: 'app-setting-position',
  templateUrl: './setting-position.component.html',
  styleUrls: ['./setting-position.component.scss']
})
export class SettingPositionComponent implements OnInit {
  dtTrigger: Subject<any> = new Subject();
  searchTerm$ = new BehaviorSubject<string>('');
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  gridLoading = true;
  pagedResult: PagedResult<LocationListItem> = new PagedResult<
    LocationListItem
    >();
  mySelection: number[] = [];
  constructor(
    private settingService: SettingService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.spinner.show();
    this.searchTerm$
      .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term =>
        // this.prospectService
        //   .filter(term, this.filterModel, 0, 10)
        //   .subscribe(result => this.rerender(result)));
        this.refresh(0, this.pagedResult.pageSize)
      );
    //   this.refresh(0, this.pagedResult.pageSize);
  }

  public onSelectedKeysChange(e) {
  }

  deleteLocation(item) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa khu vực này?',
      () => {
        this.settingService.deleteLocation(item.id).subscribe(
          result => {
            this.alertService.success(`Đã xóa thành công khu vực ${item.locationName}!`);
            this.refresh(0, this.pagedResult.pageSize);
          },
          err => {
            this.alertService.error(
              'Đã gặp lỗi, chưa xóa được khu vực!'
            );
          }
        );
      }
    );
  }

  pagedResultChange(pagedResult: any) {
    this.refresh(pagedResult.currentPage, pagedResult.pageSize);
  }

  refresh(page: string | number, pageSize: string | number) {
    this.settingService.readLocation(this.searchTerm$.value, page, pageSize).subscribe(data => {
      this.pagedResult = data;
      this.dtTrigger.next();
      this.spinner.hide();
    });
  }

  deleteMultiple() {
    const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
    if (listSelected.length > 0) {
      this.confirmationService.confirm(
        'Bạn có chắc chắn muốn xóa những khu vực được chọn?',
        () => {
          this.settingService.deleteMultipleLocation(listSelected.map(i => i.id)).subscribe(
            result => {
              this.alertService.success('Đã xóa thành công các khu vực được chọn!');
              this.refresh(0, this.pagedResult.pageSize);
            },
            err => {
              this.alertService.error(
                'Đã gặp lỗi, chưa xóa được các khu vực được chọn!'
              );
            }
          );
        }
      );
    } else {
      this.alertService.error('Bạn cần chọn ít nhất 1 khu vực cần xóa');
    }
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
  }

}