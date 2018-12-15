import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-kpi-target',
  templateUrl: './setting-kpi-target.component.html',
  styleUrls: ['./setting-kpi-target.component.scss']
})
export class SettingKpiTargetComponent implements OnInit {
  isCollapseMenu = false;
  idReport = 'BC01';
  widthReport: number;
  constructor() { }

  ngOnInit() {
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

}
