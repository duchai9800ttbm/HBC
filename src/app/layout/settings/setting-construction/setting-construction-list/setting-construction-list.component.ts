import { Component, OnInit } from '@angular/core';
import { PagedResult } from '../../../../shared/models';
import { SettingService } from '../../../../shared/services/setting.service';
import { ConfirmationService, AlertService } from '../../../../shared/services';
import { ConstructionTypeListItem } from '../../../../shared/models/setting/construction-type-list-item';
import { BehaviorSubject } from '../../../../../../node_modules/rxjs';
import { COMMON_CONSTANTS } from '../../../../shared/configs/common.config';
@Component({
    selector: 'app-setting-construction-list',
    templateUrl: './setting-construction-list.component.html',
    styleUrls: ['./setting-construction-list.component.scss']
})
export class SettingConstructionListComponent implements OnInit {
    searchTerm$ = new BehaviorSubject<string>('');
    gridLoading = true;
    pagedResult: PagedResult<ConstructionTypeListItem[]> = new PagedResult<
        ConstructionTypeListItem[]
        >();
    mySelection: number[] = [];
    constructor(
        private settingService: SettingService,
        private confirmationService: ConfirmationService,
        private alertService: AlertService
    ) { }

    ngOnInit() {
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
            'Bạn có chắc chắn muốn xóa loại công trình này?',
            () => {
                this.settingService.deleteConstruction(id).subscribe(
                    _ => {
                        this.alertService.success('Đã xóa loại công trình!');
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
        this.gridLoading = true;
        this.settingService.readConstruction(this.searchTerm$.value, page, pageSize).subscribe(data => {
            this.pagedResult = data;
            console.log(this.pagedResult);
            this.gridLoading = false;
        });
    }

    deleteMultiple() {
        if (this.mySelection.length) {
            this.confirmationService.confirm(
                'Bạn có chắc chắn muốn xóa những loại công trình được chọn?',
                () => {
                    this.settingService.deleteMultipleConstructionType(this.mySelection).subscribe(
                        _ => {
                            this.alertService.success('Đã xóa các loại công trình!');
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
            this.alertService.error('Bạn chưa chọn những loại công trình cần xóa');
        }
    }

}
