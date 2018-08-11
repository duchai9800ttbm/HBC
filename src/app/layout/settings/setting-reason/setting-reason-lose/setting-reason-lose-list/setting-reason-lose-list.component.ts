import { Component, OnInit } from '@angular/core';
import { PackageFilter } from '../../../../../shared/models/package/package-filter.model';
import { PagedResult } from '../../../../../shared/models';
import { LocationListItem } from '../../../../../shared/models/setting/location-list-item';
import {
    ConfirmationService,
    AlertService
} from '../../../../../shared/services';
import { SettingService } from '../../../../../shared/services/setting.service';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';

@Component({
    selector: 'app-setting-reason-lose-list',
    templateUrl: './setting-reason-lose-list.component.html',
    styleUrls: ['./setting-reason-lose-list.component.scss']
})
export class SettingReasonLoseListComponent implements OnInit {
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
        this.refresh(0, 10);
    }

    public onSelectedKeysChange(e) {
        console.log(this.mySelection);
    }

    deleteReasonLose(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa lý do này?',
            () => {
                this.settingService.deleteOpportunityReason(id, SETTING_REASON.Lose).subscribe(
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
            .readOpportunityReason(page, pageSize, SETTING_REASON.Lose)
            .subscribe(data => {
                this.pagedResult = data;
                console.log(this.pagedResult);
                this.gridLoading = false;
            });
    }
}
