import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ReportFollowService } from '../../shared/services/report-follow.service';
import { StartAndEndDate } from '../../shared/models/report-follow/startAndEndDate.model';
import { DataService, AlertService, ConfirmationService, SessionService } from '../../shared/services';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../shared/models';
import { StartAndEndConstructionCategory } from '../../shared/models/report-follow/startAndEndConstructionCategory.model';
import { StartAndEndConstructionType } from '../../shared/models/report-follow/startAndEndConstructionType.model';
import DateTimeConvertHelper from '../../shared/helpers/datetime-convert-helper';
import { UserModel } from '../../shared/models/user/user.model';

@Component({
  selector: 'app-monitoring-report',
  templateUrl: './monitoring-report.component.html',
  styleUrls: ['./monitoring-report.component.scss']
})
export class MonitoringReportComponent implements OnInit {
  @ViewChild('tabOptionKpiType') tabOptionKpiType: ElementRef;
  time = new Date();
  isCollapseMenu = false;
  idReport = 'kpi-chair';
  widthReport: number;
  urlArray = [
    'kpi-chair', 'win-bid', 'kpi-area', 'construction-items', 'type-construction',
    'win-rate-contractors', 'win-rate-quarter-of-year', 'floor-area',
    'number-win-bid', 'potential-projects'
  ];
  startDate: Date;
  endDate: Date;
  startAndEndDate = new StartAndEndDate();
  // startAndEndConstructionCategory = new StartAndEndConstructionCategory();
  // startAndEndConstructionType = new StartAndEndConstructionType();
  listMainBuildingCategory: DictionaryItem[];
  listBuildingProjectType: DictionaryItem[];
  isViewReport = false;
  userModel: UserModel;
  listPrivileges = [];
  isManageReport;
  messgeCanNote: string = null;
  get alertWarning(): string {
    if (!DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate) || !DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)) {
      return 'Bạn cần chọn thời gian xem báo cáo';
    } else if (((DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate)
      - DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)) > 0) && this.isViewReport) {
      return 'Thời gian Từ ngày cần nhỏ hơn thời gian Đến ngày';
    } else {
      return null;
    }
  }
  constructor(
    private router: Router,
    private reportFollowService: ReportFollowService,
    private dataService: DataService,
    private alertService: AlertService,
    private confirmationService: ConfirmationService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.userModel = this.sessionService.userInfo;
    this.listPrivileges = this.userModel.privileges;
    if (this.listPrivileges) {
      this.isManageReport = this.listPrivileges.some(x => x === 'ManageTrackingReports');
    }
    if (!this.isManageReport) {
      this.router.navigate(['/no-permission']);
    }

    const date = new Date();
    this.startDate = new Date(date.getFullYear(), 0, 1);
    this.endDate = date;
    // kpi-chair, win-bid, kpi-area
    this.startAndEndDate.startDate = this.startDate;
    this.startAndEndDate.endDate = this.endDate;
    this.startAndEndDate.constructionCategory = null;
    this.startAndEndDate.constructionType = null;

    // Note
    const yearSub = this.endDate.getFullYear() - this.startDate.getFullYear();
    console.log('yearSub', yearSub);
    if (yearSub === 0) {
      this.messgeCanNote = null;
      this.startAndEndDate.isEditNote = true;
    } else {
      this.messgeCanNote = 'Để xem được ghi chú của từng năm báo cáo, bạn cần chọn thời gian xem báo cáo trong cùng 1 năm.';
      this.startAndEndDate.isEditNote = false;
    }

    this.reportFollowService.startAndEndDate.next(this.startAndEndDate);

    this.checkActiveTab();
    this.dataService.getListMainConstructionComponents().subscribe(response => this.listMainBuildingCategory = response);
    this.dataService.getListConstructonTypes().subscribe(response => this.listBuildingProjectType = response);
  }

  checkActiveTab() {
    this.urlArray.forEach(item => {
      if (this.router.url.includes(item)) {
        this.idReport = item;
        return;
      }
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.widthReport = document.getElementById('wrapper-report').offsetWidth;
    if (this.widthReport <= 910) {
      document.getElementById('wrapper-report').classList.add('flex-column');
      document.getElementById('menu-report').classList.add('mb-2');
      document.getElementById('menu-report').classList.add('menu-report--fixed');
      document.getElementById('reports-table').classList.remove('pl-3');
      document.getElementById('reports-table').classList.add('reports--margintop');
      this.isCollapseMenu = true;
      const listReports = document.getElementsByName('list-report');
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('d-none');
        }
      }


    }
    if (this.widthReport > 910) {
      document.getElementById('wrapper-report').classList.remove('flex-column');
      document.getElementById('menu-report').classList.remove('mb-2');
      document.getElementById('menu-report').classList.remove('menu-report--fixed');
      document.getElementById('reports-table').classList.add('pl-3');
      document.getElementById('reports-table').classList.remove('reports--margintop');
      this.isCollapseMenu = false;
      const listReports = document.getElementsByName('list-report');
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('d-none');
        }
      }

    }
  }

  @HostListener('document:click', ['$event'])
  public documentClick(event: any): void {
    if (this.contains(event.target)) {
    }
    if (!this.contains(event.target)) {
      if (this.widthReport <= 910) {
        this.isCollapseMenu = false;
        this.collapseMenu();
      }
    }
  }

  contains(target: any): boolean {
    return this.tabOptionKpiType.nativeElement.contains(target) ||
      (this.tabOptionKpiType ? this.tabOptionKpiType.nativeElement.contains(target) : false);
  }

  toggleCollapseMenu(idreport) {
    this.widthReport = document.getElementById('wrapper-report').offsetWidth;
    this.idReport = idreport;
    if (this.widthReport <= 910) {
      this.collapseMenu();
    }
  }

  collapseMenu() {
    this.isCollapseMenu = !this.isCollapseMenu;
    const listReports = document.getElementsByName('list-report');
    if (this.isCollapseMenu) {
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.add('d-none');
        }
      }
    }
    if (!this.isCollapseMenu) {
      for (let i = 0; i < listReports.length; i++) {
        if (listReports[i].id === this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('menu-report__toggle');
        }
        if (listReports[i].id !== this.idReport) {
          (<HTMLLIElement>listReports[i]).classList.remove('d-none');
        }
      }
    }
  }

  autoExpand(event) {
    event.target.style.height = event.target.scrollHeight + 'px';
  }

  viewReport() {
    this.isViewReport = true;
    if (DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate)
      && DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)
      && !((DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate)
        - DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)) > 0)) {
      switch (this.idReport) {
        case 'kpi-chair':
        case 'win-bid':
        case 'kpi-area':
        case 'win-rate-contractors':
        case 'win-rate-quarter-of-year':
        case 'floor-area':
        case 'number-win-bid':
        case 'potential-projects':
          {
            this.startAndEndDate.startDate = this.startDate;
            this.startAndEndDate.endDate = this.endDate;
            break;
          }
        case 'construction-items': {
          this.startAndEndDate.startDate = this.startDate;
          this.startAndEndDate.endDate = this.endDate;
          // tslint:disable-next-line:max-line-length
          const constructionCategoryName = this.listMainBuildingCategory.find(item => item.id === this.startAndEndDate.constructionCategory);
          // tslint:disable-next-line:max-line-length
          this.startAndEndDate.constructionCategoryName = constructionCategoryName && constructionCategoryName.text ? constructionCategoryName.text : '';
          break;
        }
        case 'type-construction': {
          this.startAndEndDate.startDate = this.startDate;
          this.startAndEndDate.endDate = this.endDate;
          const constructionTypeName = this.listBuildingProjectType.find(item => item.id === this.startAndEndDate.constructionType);
          this.startAndEndDate.constructionTypeName = constructionTypeName && constructionTypeName.text ? constructionTypeName.text : '';
          break;
        }
      }
      // Note
      const yearSub = this.endDate.getFullYear() - this.startDate.getFullYear();
      if (yearSub === 0) {
        this.messgeCanNote = null;
        this.startAndEndDate.isEditNote = true;
      } else {
        this.messgeCanNote = 'Để xem được ghi chú của từng năm báo cáo, bạn cần chọn thời gian xem báo cáo trong cùng 1 năm.';
        this.startAndEndDate.isEditNote = false;
      }
      this.reportFollowService.startAndEndDate.next(this.startAndEndDate);
    }
  }

  exportExcel() {
    this.isViewReport = true;
    if (DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate)
      && DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)
      && !((DateTimeConvertHelper.fromDtObjectToTimestamp(this.startDate)
        - DateTimeConvertHelper.fromDtObjectToTimestamp(this.endDate)) > 0)) {
      if (!this.startAndEndDate.constructionCategory || !this.startAndEndDate.constructionType) {
        let messegeReportName = '';
        if (!this.startAndEndDate.constructionCategory && !this.startAndEndDate.constructionType) {
          // tslint:disable-next-line:max-line-length
          messegeReportName = '<strong>Báo cáo chỉ tiêu KPI theo hạng mục thi công</strong> & <strong>Báo cáo chỉ tiêu KPI theo loại công trình</strong>';
        } else if (!this.startAndEndDate.constructionCategory) {
          messegeReportName = '<strong>Báo cáo chỉ tiêu KPI theo hạng mục thi công</strong>';
        } else if (!this.startAndEndDate.constructionType) {
          messegeReportName = '<strong>Báo cáo chỉ tiêu KPI theo loại công trình</strong>';
        }
        this.confirmationService.confirmHTML(
          // tslint:disable-next-line:max-line-length
          `<div>${messegeReportName}, bạn chưa chọn chỉ tiêu nào để xem. Bạn có muốn tiếp tục?</div>
                  <div>Nếu <strong>ĐỒNG Ý</strong>: File xuất ra sẽ không chứa loại báo cáo này.</div>
                  <div>Nếu <strong>HỦY</strong>: Vui lòng chọn chỉ tiêu xem báo cáo.</div>`,
          () => {
            this.reportFollowService.exportReportToExcel(
              DateTimeConvertHelper.fromDtObjectToTimestamp(this.startAndEndDate.startDate),
              DateTimeConvertHelper.fromDtObjectToTimestamp(this.startAndEndDate.endDate),
              this.startAndEndDate.constructionCategory,
              this.startAndEndDate.constructionType,
            ).subscribe(response => {
            }, err => {
              this.alertService.error('Đã có lỗi xảy ra. Vui lòng thử lại');
            });
          });
      }
      if (!(!this.startAndEndDate.constructionCategory || !this.startAndEndDate.constructionType)) {
        this.reportFollowService.exportReportToExcel(
          DateTimeConvertHelper.fromDtObjectToTimestamp(this.startAndEndDate.startDate),
          DateTimeConvertHelper.fromDtObjectToTimestamp(this.startAndEndDate.endDate),
          this.startAndEndDate.constructionCategory,
          this.startAndEndDate.constructionType,
        ).subscribe(response => {
        }, err => {
          this.alertService.error('Đã có lỗi xảy ra. Vui lòng thử lại');
        });
      }

    }

  }
}
