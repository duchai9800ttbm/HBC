import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SettingService } from '../../../../../shared/services/setting.service';
import { BehaviorSubject } from 'rxjs';
import { PagedResult } from '../../../../../shared/models';
import { GroupUserService } from '../../../../../shared/services/group-user.service';
import { AlertService, ConfirmationService } from '../../../../../shared/services';

@Component({
  selector: 'app-group-configuration-list',
  templateUrl: './group-configuration-list.component.html',
  styleUrls: ['./group-configuration-list.component.scss']
})
export class GroupConfigurationListComponent implements OnInit, OnDestroy {
  private searchTerm$ = new BehaviorSubject<string>('');
  loading = false;
  pagedResult: PagedResult<any> = new PagedResult<any>();
  checkboxSeclectAll: boolean;
  constructor(
    private router: Router,
    private settingService: SettingService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit() {
    this.loading = true;
    if (this.settingService.searchTermGroupKPI) {
      this.searchTerm$ = this.settingService.searchTermGroupKPI;
    }
    this.settingService
      .searchKeyWordListGroupKPI(this.searchTerm$, 0, 10)
      .subscribe(result => {
        this.settingService.saveSearchTermGroupKPI(this.searchTerm$);
        this.rerender(result);
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  ngOnDestroy() {
    // this.searchTerm$.unsubscribe();
  }

  rerender(pagedResult: any) {
    this.pagedResult = pagedResult;
  }

  createGroupConfig() {
    this.router.navigate([`/settings/kpi-target/group-config/create`]);
  }

  editGroupConfig(id: number) {
    this.router.navigate([`/settings/kpi-target/group-config/edit/${id}`]);
  }

  getListGroupKPIFuc() {
    this.settingService
      .getListGroupKPI(this.searchTerm$.value, this.pagedResult.currentPage, this.pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  pagedResultChange(pagedResult: any) {
    this.settingService
      .getListGroupKPI(this.searchTerm$.value, pagedResult.currentPage, pagedResult.pageSize)
      .subscribe(result => {
        this.rerender(result);
        this.loading = false;
      }, err => {
        this.loading = false;
      });
  }

  refresh(page: string | number, pageSize: string | number) {
    this.loading = true;
    this.settingService.getListGroupKPI(this.searchTerm$.value, page, pageSize).subscribe(data => {
      this.pagedResult = data;
      this.loading = false;
    });
  }

  deleteGroupConfig(kpiGroupId: number) {
    this.confirmationService.confirm(
      'Bạn có chắc chắn xóa nhóm được chọn?',
      () => {
        this.settingService.deleteGroupKPI(kpiGroupId).subscribe(repsone => {
          this.getListGroupKPIFuc();
          this.alertService.success('Xóa nhóm thành công.');
        }, err => {
          this.alertService.error('Đã xảy ra lỗi, xóa nhóm không thành công');
        });
      });
  }

  multiDeleteGroupConfig() {
    const deleteIds = this.pagedResult.items
      .filter(x => x.checkboxSelected)
      .map(x => x.id);
    if (deleteIds.length === 0) {
      this.alertService.error(
        'Bạn phải chọn ít nhất nhóm để xóa!'
      );
    } else {
      this.confirmationService.confirm(
        'Bạn có chắc chắn xóa những nhóm được chọn?',
        () => {
          this.settingService.deleteMutipleGroupKPI(deleteIds).subscribe(response => {
            this.refresh(0, 10);
            this.alertService.success('Xóa nhóm thành công');
            this.checkboxSeclectAll = false;
          },
            err => {
              this.alertService.error('Đã xảy ra lỗi, xóa nhóm không thành công');
            });
        }
      );
    }
  }

  onSelectAll(value: boolean) {
    this.pagedResult.items.forEach(x => (x.checkboxSelected = value));
  }

  changeActive() {
    
  }
}
