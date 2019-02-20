import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { ReportFollowService } from '../../shared/services/report-follow.service';
import { StartAndEndDate } from '../../shared/models/report-follow/startAndEndDate.model';
import { DataService } from '../../shared/services';
import { Observable } from 'rxjs';
import { DictionaryItem } from '../../shared/models';
import { StartAndEndConstructionCategory } from '../../shared/models/report-follow/startAndEndConstructionCategory.model';

@Component({
  selector: 'app-monitoring-report',
  templateUrl: './monitoring-report.component.html',
  styleUrls: ['./monitoring-report.component.scss']
})
export class MonitoringReportComponent implements OnInit {
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
  startAndEndConstructionCategory = new StartAndEndConstructionCategory();
  listMainBuildingCategory: Observable<DictionaryItem[]>;
  constructor(
    private router: Router,
    private reportFollowService: ReportFollowService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    const date = new Date();
    this.startDate = new Date(date.getFullYear(), 0, 1);
    this.endDate = date;
    // kpi-chair, win-bid, kpi-area
    this.startAndEndDate.startDate = this.startDate;
    this.startAndEndDate.endDate = this.endDate;
    this.reportFollowService.startAndEndDate.next(this.startAndEndDate);
    // construction-items
    this.startAndEndConstructionCategory.startDate = this.startDate;
    this.startAndEndConstructionCategory.endDate = this.endDate;
    this.startAndEndConstructionCategory.constructionCategory = null;
    this.reportFollowService.startAndEndConstructionCategory.next(this.startAndEndConstructionCategory);
    this.checkActiveTab();
    this.listMainBuildingCategory = this.dataService.getListMainConstructionComponents();
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

  toggleCollapseMenu(idreport) {
    this.widthReport = document.getElementById('wrapper-report').offsetWidth;
    console.log(this.widthReport);
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
    switch (this.idReport) {
      case 'kpi-chair':
      case 'win-bid':
      case 'kpi-area': {
        this.startAndEndDate.startDate = this.startDate;
        this.startAndEndDate.endDate = this.endDate;
        this.reportFollowService.startAndEndDate.next(this.startAndEndDate);
        break;
      }
      case 'construction-items': {
        this.startAndEndConstructionCategory.startDate = this.startDate;
        this.startAndEndConstructionCategory.endDate = this.endDate;
          this.reportFollowService.startAndEndConstructionCategory.next(this.startAndEndConstructionCategory);
        break;
      }
    }
  }
}
