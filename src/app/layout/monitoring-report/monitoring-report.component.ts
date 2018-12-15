import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-monitoring-report',
  templateUrl: './monitoring-report.component.html',
  styleUrls: ['./monitoring-report.component.scss']
})
export class MonitoringReportComponent implements OnInit {
  time = new Date();
  isCollapseMenu = false;
  idReport = 'BC01';
  widthReport: number;
  constructor() { }

  ngOnInit() {
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

}
