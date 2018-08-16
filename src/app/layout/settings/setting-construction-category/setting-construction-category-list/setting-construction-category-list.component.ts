import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { ConstructionCategoryListItem } from '../../../../shared/models/setting/construction-category-list-item';
import { BehaviorSubject, Subject } from '../../../../../../node_modules/rxjs';
import { COMMON_CONSTANTS } from '../../../../shared/configs/common.config';
import { DATATABLE_CONFIG } from '../../../../shared/configs';
import { NgxSpinnerService } from '../../../../../../node_modules/ngx-spinner';
@Component({
    selector: 'app-setting-construction-category-list',
    templateUrl: './setting-construction-category-list.component.html',
    styleUrls: ['./setting-construction-category-list.component.scss']
})
export class SettingConstructionCategoryListComponent implements OnInit {
    dtTrigger: Subject<any> = new Subject();
    searchTerm$ = new BehaviorSubject<string>('');
    dtOptions: any = DATATABLE_CONFIG;
    checkboxSeclectAll: boolean;
    pagedResult: PagedResult<ConstructionCategoryListItem> = new PagedResult<
        ConstructionCategoryListItem
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

    deleteConstructionCategory(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa hạng mục thi công công trình này?',
            () => {
                this.settingService.deleteConstructionCategory(id).subscribe(
                    _ => {
                        this.alertService.success('Đã xóa thành công hạng mục thi công công trình!');
                        this.refresh(0, this.pagedResult.pageSize);
                    },
                    _ => {
                        this.alertService.error(
                            'Đã gặp lỗi, chưa xóa được hạng mục thi công công trình!'
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
        this.settingService.readConstructionCategory(this.searchTerm$.value, page, pageSize).subscribe(data => {
            this.pagedResult = data;
            this.dtTrigger.next();
            this.spinner.hide();
        });
    }

    deleteMultiple() {
        const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
        if (listSelected.length > 0) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những hạng mục thi công công trình được chọn?',
                () => {
                    this.settingService.deleteMultipleConstructionCategory(listSelected.map(i => i.id)).subscribe(
                        _ => {
                            this.alertService.success('Đã xóa thành công các các hạng mục được chọn!');
                            this.refresh(0, this.pagedResult.pageSize);
                        },
                        _ => {
                            this.alertService.error(
                                'Đã gặp lỗi, chưa xóa được các hạng mục!'
                            );
                        }
                    );
                }
            );
        } else {
            this.alertService.error('Bạn cần chọn ít nhất 1 hạng mục thi công công trình cần xóa');
        }
    }

    onSelectAll(value: boolean) {
        this.pagedResult.items.forEach(x => (x['checkboxSelected'] = value));
    }

}
