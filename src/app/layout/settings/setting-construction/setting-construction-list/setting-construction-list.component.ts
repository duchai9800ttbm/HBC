import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { ConstructionTypeListItem } from '../../../../shared/models/setting/construction-type-list-item';
import { BehaviorSubject, Subject } from '../../../../../../node_modules/rxjs';
import { COMMON_CONSTANTS } from '../../../../shared/configs/common.config';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { NgxSpinnerService } from '../../../../../../node_modules/ngx-spinner';
@Component({
    selector: 'app-setting-construction-list',
    templateUrl: './setting-construction-list.component.html',
    styleUrls: ['./setting-construction-list.component.scss']
})
export class SettingConstructionListComponent implements OnInit {
    loading = false;
    dtTrigger: Subject<any> = new Subject();
    searchTerm$ = new BehaviorSubject<string>('');
    dtOptions: any = DATATABLE_CONFIG;
    checkboxSeclectAll: boolean;
    pagedResult: PagedResult<ConstructionTypeListItem> = new PagedResult<
        ConstructionTypeListItem
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

    deleteLocation(item) {
        if (item && (item.isDelete === false)) {
            // tslint:disable-next-line:max-line-length
            this.confirmationService.openNotifi(`Loại công trình này đã được thiết lập chỉ tiêu KPI hoặc đang được sử dụng trong gói thầu. Vui lòng không xoá.`);
            return;
        }
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa loại công trình này?',
            () => {
                this.settingService.deleteConstruction(item.id).subscribe(
                    _ => {
                        this.alertService.success(`Đã xóa thành công loại công trình ${item.constructionTypeName}!`);
                        this.refresh(0, this.pagedResult.pageSize);
                    },
                    _ => {
                        this.alertService.error(
                            'Đã gặp lỗi, chưa xóa được loại công trình!'
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
        this.settingService.readConstruction(this.searchTerm$.value, page, pageSize).subscribe(data => {
            this.pagedResult = data;
            this.dtTrigger.next();
            this.loading = false;
        });
    }

    deleteMultiple() {
        const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
        if (listSelected.length > 0) {
            const deleteArray = listSelected.filter(item => item.isDelete === false);
            if (deleteArray.length > 0) {
                // tslint:disable-next-line:max-line-length
                this.confirmationService.openNotifi(`Có loại công trình đã được thiết lập chỉ tiêu KPI hoặc đang được sử dụng trong gói thầu. Vui lòng không xoá.`);
                return;
            }

            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những loại công trình được chọn?',
                () => {
                    this.settingService.deleteMultipleConstructionType(listSelected.map(i => i.id)).subscribe(
                        _ => {
                            this.alertService.success('Đã xóa thành công các loại công trình được chọn!');
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        _ => {
                            this.alertService.error(
                                'Đã gặp lỗi, chưa xóa được các loại công trình!'
                            );
                        }
                    );
                }
            );
        } else {
            this.alertService.error('Bạn cần chọn ít nhất 1 loại công trình cần xóa');
        }
    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
    }

}
