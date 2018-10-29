import { Component, OnInit } from '@angular/core';
import { PackageFilter } from '../../../../../shared/models/package/package-filter.model';
import { PagedResult } from '../../../../../shared/models';
import { LocationListItem } from '../../../../../shared/models/setting/location-list-item';
import {
    ConfirmationService,
    AlertService
} from '../../../../../shared/services';
import { SettingService } from '../../../../../shared/services/setting.service';
import { SETTING_REASON, COMMON_CONSTANTS } from '../../../../../shared/configs/common.config';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { BehaviorSubject, Subject } from '../../../../../../../node_modules/rxjs';
import { DATATABLE_CONFIG } from '../../../../../shared/configs';
import { NgxSpinnerService } from '../../../../../../../node_modules/ngx-spinner';
@Component({
    selector: 'app-setting-reason-win-list',
    templateUrl: './setting-reason-win-list.component.html',
    styleUrls: ['./setting-reason-win-list.component.scss']
})
export class SettingReasonWinListComponent implements OnInit {
    loading = false;
    dtTrigger: Subject<any> = new Subject();
    searchTerm$ = new BehaviorSubject<string>('');
    dtOptions: any = DATATABLE_CONFIG;
    checkboxSeclectAll: boolean;
    pagedResult: PagedResult<OpportunityReasonListItem> = new PagedResult<
        OpportunityReasonListItem
    >();
    mySelection: number[] = [];
    constructor(
        private confirmationService: ConfirmationService,
        private settingService: SettingService,
        private alertService: AlertService,
        private spinner: NgxSpinnerService
    ) {}

    ngOnInit() {
        // this.refresh(0, 10);
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

    deleteReasonWin(item) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa lý do trúng thầu này?',
            () => {
                this.settingService
                    .deleteOpportunityReason(item.id, SETTING_REASON.Win)
                    .subscribe(
                        result => {
                            this.alertService.success(`Đã xóa thành công lý do trúng thầu ${item.reasonName}!`);
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        err => {
                            this.alertService.success(
                                'Đã gặp lỗi, chưa xóa được lý do!'
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
        this.settingService
            .readOpportunityReason(this.searchTerm$.value, page, pageSize, SETTING_REASON.Win)
            .subscribe(data => {
                this.pagedResult = data;
                this.dtTrigger.next();
                this.loading = false;
            });
    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
    }

    deleteMultiple() {
        const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
        if (listSelected.length > 0) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những lý do được chọn?',
                () => {
                    this.settingService.deleteMultipleOpportunityReason(listSelected.map(i => i.id), SETTING_REASON.Win).subscribe(
                        _ => {
                            this.alertService.success('Đã xóa thành công các lý do được chọn!');
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        _ => {
                            this.alertService.error(
                                'Đã gặp lỗi, chưa xóa được các lý do!'
                            );
                        }
                    );
                }
            );
        } else {
            this.alertService.error('Bạn cần chọn ít nhất 1 lý do cần xóa');
        }
    }
}
