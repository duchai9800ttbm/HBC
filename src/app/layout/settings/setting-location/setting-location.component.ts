import { Component, OnInit } from '@angular/core';
import { PackageFilter } from '../../../shared/models/package/package-filter.model';
import { PagedResult, DictionaryItem } from '../../../shared/models';
import {
    DataService,
    ConfirmationService,
    AlertService
} from '../../../shared/services';
import { Observable, BehaviorSubject } from '../../../../../node_modules/rxjs';
import { SettingService } from '../../../shared/services/setting.service';
import { LocationListItem } from '../../../shared/models/setting/location-list-item';
import { COMMON_CONSTANTS } from '../../../shared/configs/common.config';

@Component({
    selector: 'app-setting-location',
    templateUrl: './setting-location.component.html',
    styleUrls: ['./setting-location.component.scss']
})
export class SettingLocationComponent implements OnInit {
    searchTerm$ = new BehaviorSubject<string>('');
    gridLoading = true;
    pagedResult: PagedResult<LocationListItem[]> = new PagedResult<
        LocationListItem[]
    >();
    mySelection: number[] = [];
    constructor(
        private settingService: SettingService,
        private confirmationService: ConfirmationService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
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
        console.log(this.mySelection);
    }

    deleteLocation(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa khu vực này?',
            () => {
                this.settingService.deleteLocation(id).subscribe(
                    result => {
                        this.alertService.success('Đã xóa khu vực!');
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
        this.gridLoading = true;
        this.settingService.readLocation(this.searchTerm$.value, page, pageSize).subscribe(data => {
            this.pagedResult = data;
            this.gridLoading = false;
        });
    }

    deleteMultiple() {
        if (this.mySelection.length) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những khu vực được chọn?',
                () => {
                    this.settingService.deleteMultipleLocation(this.mySelection).subscribe(
                        result => {
                            this.alertService.success('Đã xóa các khu vực!');
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        err => {
                            this.alertService.error(
                                'Đã gặp lỗi, chưa xóa được các khu vực!'
                            );
                        }
                    );
                }
            );
        } else {
            this.alertService.error('Bạn chưa chọn những khu vực cần xóa');
        }
    }

}
