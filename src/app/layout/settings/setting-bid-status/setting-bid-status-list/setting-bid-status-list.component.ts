import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { BidStatusListItem } from '../../../../shared/models/setting/bid-status-list-item';
import { BehaviorSubject, Subject } from '../../../../../../node_modules/rxjs';
import { COMMON_CONSTANTS } from '../../../../shared/configs/common.config';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { NgxSpinnerService } from '../../../../../../node_modules/ngx-spinner';
@Component({
    selector: 'app-setting-bid-status-list',
    templateUrl: './setting-bid-status-list.component.html',
    styleUrls: ['./setting-bid-status-list.component.scss']
})
export class SettingBidStatusListComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    searchTerm$ = new BehaviorSubject<string>('');
    dtOptions: any = DATATABLE_CONFIG;
    checkboxSeclectAll: boolean;
    pagedResult: PagedResult<BidStatusListItem> = new PagedResult<
        BidStatusListItem
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
                this.refresh(0, this.pagedResult.pageSize)
            );
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
                        this.alertService.success('Đã xóa thành công tình trạng gói thầu!');
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
        this.settingService.readBidStatus(this.searchTerm$.value, page, pageSize).subscribe(data => {
            this.pagedResult = data;
            this.dtTrigger.next();
            this.spinner.hide();
        });
    }

    deleteMultiple() {
        const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
        if (listSelected.length > 0) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những tình trạng gói thầu được chọn?',
                () => {
                    this.settingService.deleteMultipleBidStatus(listSelected.map(i => i.id)).subscribe(
                        result => {
                            this.alertService.success('Đã xóa thành công các tình trạng gói thầu được chọn!');
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
            this.alertService.error('Bạn cần chọn ít nhất 1 tình trạng gói thầu cần xóa');
        }

    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
    }

}
