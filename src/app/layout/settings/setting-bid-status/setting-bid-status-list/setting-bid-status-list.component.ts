import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { BidStatusListItem } from '../../../../shared/models/setting/bid-status-list-item';

@Component({
    selector: 'app-setting-bid-status-list',
    templateUrl: './setting-bid-status-list.component.html',
    styleUrls: ['./setting-bid-status-list.component.scss']
})
export class SettingBidStatusListComponent implements OnInit {

    gridLoading = true;
    pagedResult: PagedResult<BidStatusListItem[]> = new PagedResult<
        BidStatusListItem[]
        >();
    mySelection: number[] = [];
    constructor(
        private settingService: SettingService,
        private confirmationService: ConfirmationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
        this.refresh(0, 10);
    }

    public onSelectedKeysChange(e) {
        console.log(this.mySelection);
    }

    deleteLocation(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa tình trạng gói thầu này?',
            () => {
                this.settingService.deleteBidStatus(id).subscribe(
                    result => {
                        this.alertService.success('Đã xóa tình trạng gói thầu!');
                        this.refresh(0, this.pagedResult.pageSize);
                    },
                    err => {
                        this.alertService.error(
                            'Đã gặp lỗi, chưa xóa được tình trạng gói thầu!'
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
        this.settingService.readBidStatus(page, pageSize).subscribe(data => {
            this.pagedResult = data;
            console.log(this.pagedResult);
            this.gridLoading = false;
        });
    }

    deleteMultiple() {
        if (this.mySelection.length) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những tình trạng gói thầu được chọn?',
                () => {
                    this.settingService.deleteMultipleBidStatus(this.mySelection).subscribe(
                        result => {
                            this.alertService.success('Đã xóa các tình trạng gói thầu!');
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        err => {
                            this.alertService.error(
                                'Đã gặp lỗi, chưa xóa được các tình trạng gói thầu!'
                            );
                        }
                    );
                }
            );
        } else {
            this.alertService.error('Bạn chưa chọn những tình trạng gói thầu cần xóa');
        }

    }
}
