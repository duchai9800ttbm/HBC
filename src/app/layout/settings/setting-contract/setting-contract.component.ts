import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PagedResult } from '../../../shared/models';
import { Contract } from '../../../shared/models/setting/contract';
import { ConfirmationService, AlertService } from '../../../shared/services';
import { SettingService } from '../../../shared/services/setting.service';
import { COMMON_CONSTANTS } from '../../../shared/configs/common.config';

@Component({
  selector: 'app-setting-contract',
  templateUrl: './setting-contract.component.html',
  styleUrls: ['./setting-contract.component.scss']
})
export class SettingContractComponent implements OnInit {
  loading = false;
  searchTerm$ = new BehaviorSubject<string>('');
  checkboxSeclectAll: boolean;
  pagedResult: PagedResult<Contract> = new PagedResult<Contract>();
  constructor(
    private settingService: SettingService,
    private confirmationService: ConfirmationService,
    private alertService: AlertService,
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
  onSelectAll(check: boolean) {
    this.pagedResult.items.forEach(x => (x['checkboxSelected'] = check));
  }
  deleteTypeOfContract(contract) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn muốn xóa Loại hợp đồng này?',
      () => {
        this.settingService.deleteTypeOfContract(contract.id).subscribe(
          result => {
            this.alertService.success(`Đã xóa thành công Loại hợp đồng ${contract.contractNameVi}!`);
            this.refresh(0, this.pagedResult.pageSize);
          },
          err => this.alertService.error('Đã gặp lỗi, chưa xóa được Loại hợp đồng')
        );
      }
    );
  }
  deleteMultiTypeOfContract() {
    const listSelected = this.pagedResult.items.filter(i => i.checkboxSelected);
    if (listSelected.length > 0) {
      this.confirmationService.confirm(
        'Bạn có chắc chắn muốn xóa những Loại hợp đồng được chọn?',
        () => {
          this.settingService.deleteMultiTypeOfContract(listSelected.map(i => i.id)).subscribe(
            result => {
              this.alertService.success('Đã xóa thành công các Loại hợp đồng được chọn!');
              this.refresh(0, this.pagedResult.pageSize);
            },
            err => {
              this.alertService.error(
                'Đã gặp lỗi, chưa xóa được các Loại hợp đồng đã chọn!'
              );
            }
          );
        }
      );
    } else {
      this.alertService.error('Bạn cần chọn ít nhất 1 Loại hợp đồng cần xóa');
    }
  }
  refresh(page: string | number, pageSize: string | number) {
    this.settingService.searchTypeOfContract(this.searchTerm$.value, page, pageSize).subscribe(contracts => {
      this.pagedResult = contracts;
      this.loading = false;
    });
  }
  pagedResultChange(pagedResult: any) {
    this.refresh(pagedResult.currentPage, pagedResult.pageSize);
  }

}
