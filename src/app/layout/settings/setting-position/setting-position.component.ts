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
import { COMMON_CONSTANTS } from '../../../shared/configs/common.config';
import { DATATABLE_CONFIG } from '../../../shared/configs';
import { NgxSpinnerService } from '../../../../../node_modules/ngx-spinner';
import { LevelListItem } from '../../../shared/models/setting/level-list-item';
@Component({
  selector: 'app-setting-position',
  templateUrl: './setting-position.component.html',
  styleUrls: ['./setting-position.component.scss']
})
export class SettingPositionComponent implements OnInit {
  loading = false;
  dtTrigger: Subject<any> = new Subject();
  searchTerm$ = new BehaviorSubject<string>('');
  dtOptions: any = DATATABLE_CONFIG;
  checkboxSeclectAll: boolean;
  gridLoading = true;
  pagedResult: PagedResult<LevelListItem> = new PagedResult<
    LevelListItem
    >();
  mySelection: number[] = [];
  constructor(
    private settingService: SettingService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit() {
    this.loading = true;
    this.searchTerm$
      .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
      .distinctUntilChanged()
      .subscribe(term =>
        this.refresh(0, this.pagedResult.pageSize)
      );
  }

  public onSelectedKeysChange(e) {
  }

  deleteLevel(item) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa Vị trí/Chức vụ này?',
      () => {
        this.settingService.deleteLevel(item.id).subscribe(
          result => {
            this.alertService.success(`Đã xóa thành công Vị trí/Chức vụ ${item.levelName}!`);
            this.refresh(0, this.pagedResult.pageSize);
          },
          err => {
            this.alertService.error(
              'Đã gặp lỗi, chưa xóa được Vị trí/Chức vụ!'
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
    this.settingService.readLevel(this.searchTerm$.value, page, pageSize).subscribe(data => {
      this.pagedResult = data;
      this.dtTrigger.next();
      this.loading = false;
    });
  }

  deleteMultiple() {
    const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
    if (listSelected.length > 0) {
      this.confirmationService.confirm(
        'Bạn có chắc chắn muốn xóa những Vị trí/Chức vụ được chọn?',
        () => {
          this.settingService.deleteMultipleLevel(listSelected.map(i => i.id)).subscribe(
            result => {
              this.alertService.success('Đã xóa thành công các Vị trí/Chức vụ được chọn!');
              this.refresh(0, this.pagedResult.pageSize);
            },
            err => {
              this.alertService.error(
                'Đã gặp lỗi, chưa xóa được các Vị trí/Chức vụ được chọn!'
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
