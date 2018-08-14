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
import { BehaviorSubject } from '../../../../../../../node_modules/rxjs';
@Component({
    selector: 'app-setting-reason-win-list',
    templateUrl: './setting-reason-win-list.component.html',
    styleUrls: ['./setting-reason-win-list.component.scss']
})
export class SettingReasonWinListComponent implements OnInit {
    searchTerm$ = new BehaviorSubject<string>('');
    filterModel = new PackageFilter();
    gridLoading = true;
    pagedResult: PagedResult<OpportunityReasonListItem[]> = new PagedResult<
        OpportunityReasonListItem[]
    >();
    mySelection: number[] = [];
    constructor(
        private confirmationService: ConfirmationService,
        private settingService: SettingService,
        private alertService: AlertService
    ) {}

    ngOnInit() {
        // this.refresh(0, 10);
        this.searchTerm$
        .debounceTime(COMMON_CONSTANTS.SearchDelayTimeInMs)
        .distinctUntilChanged()
        .subscribe(term =>
          this.refresh(0, this.pagedResult.pageSize)
        );
    }
    public onSelectedKeysChange(e) {
        console.log(this.mySelection);
    }

    deleteReasonWin(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa lý do này?',
            () => {
                this.settingService
                    .deleteOpportunityReason(id, SETTING_REASON.Win)
                    .subscribe(
                        result => {
                            this.alertService.success('Đã xóa lý do!');
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
        this.gridLoading = true;
        this.settingService
            .readOpportunityReason(this.searchTerm$.value, page, pageSize, SETTING_REASON.Win)
            .subscribe(data => {
                this.pagedResult = data;
                console.log(this.pagedResult);
                this.gridLoading = false;
            });
    }
}
