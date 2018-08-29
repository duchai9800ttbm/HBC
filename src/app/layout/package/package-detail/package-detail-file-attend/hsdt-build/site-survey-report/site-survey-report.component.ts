import { Component, OnInit, AfterViewChecked, AfterViewInit } from '@angular/core';
import { link } from 'fs';

@Component({
  selector: 'app-site-survey-report',
  templateUrl: './site-survey-report.component.html',
  styleUrls: ['./site-survey-report.component.scss']
})
export class SiteSurveyReportComponent implements OnInit, AfterViewInit {
  constructor() {
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    // Đang test nên để ở đây ^^
    const linkView = location.href.match(/([^\/]*)\/*$/)[1];
    if (linkView === 'sitereport') {
      const elem = Array.from(document.querySelectorAll('#contentDisplay, #toggle-menu-child, #header-table-child'));
      elem.forEach(e => e.parentNode.removeChild(e));
    } else {
      const elem = Array.from(document.querySelectorAll('#header-table, #toggle-menu, #template0, #template1'));
      elem.forEach(x => x.parentNode.removeChild(x));
    }
  }
}
