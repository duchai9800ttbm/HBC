import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { ConstructionCategoryListItem } from '../../../../shared/models/setting/construction-category-list-item';

@Component({
    selector: 'app-setting-construction-category-list',
    templateUrl: './setting-construction-category-list.component.html',
    styleUrls: ['./setting-construction-category-list.component.scss']
})
export class SettingConstructionCategoryListComponent implements OnInit {

    gridLoading = true;
    pagedResult: PagedResult<ConstructionCategoryListItem[]> = new PagedResult<
        ConstructionCategoryListItem[]
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

    deleteConstructionCategory(id: number) {
        this.confirmationService.confirm(
            'Bạn có chắc chắn muốn xóa hạng mục này?',
            () => {
                this.settingService.deleteConstructionCategory(id).subscribe(
                    _ => {
                        this.alertService.success('Đã xóa hạng mục!');
                        this.refresh(0, this.pagedResult.pageSize);
                    },
                    _ => {
                        this.alertService.error(
                            'Đã gặp lỗi, chưa xóa được hạng mục!'
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
        this.settingService.readConstructionCategory(page, pageSize).subscribe(data => {
            this.pagedResult = data;
            console.log(this.pagedResult);
            this.gridLoading = false;
        });
    }

    deleteMultiple() {
        if (this.mySelection.length) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những hạng mục được chọn?',
                () => {
                    this.settingService.deleteMultipleConstructionCategory(this.mySelection).subscribe(
                        _ => {
                            this.alertService.success('Đã xóa các hạng mục!');
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
            this.alertService.error('Bạn chưa chọn những hạng mục cần xóa');
        }
    }

}
