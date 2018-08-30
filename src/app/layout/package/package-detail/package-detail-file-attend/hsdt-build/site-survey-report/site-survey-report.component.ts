import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
@Component({
  selector: 'app-site-survey-report',
  templateUrl: './site-survey-report.component.html',
  styleUrls: ['./site-survey-report.component.scss']
})
export class SiteSurveyReportComponent implements OnInit, AfterViewInit {
  isData;
  showPopupConfirm = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  fakeData = [
    {
      stt: 0,
      ttl: 'Tài liệu nghìn đô',
      lpv: 4,
      maker: 'Khanh Hoang',
      date: '30/08/2018'
    },
    {
      stt: 1,
      ttl: 'Tài liệu tỉ đô',
      lpv: 2,
      maker: 'Khanh Hoang 1',
      date: '30/08/2018'
    }
  ];

  constructor(
    private router: Router,
  ) {
    router.events.subscribe((event: Event) => {

      if (event instanceof NavigationStart) {
        // Show loading indicator
      }

      if (event instanceof NavigationEnd) {
        // Hide loading indicator
      }

      if (event instanceof NavigationError) {
        // Hide loading indicator
        // Present error to user
        console.log(event.error);
      }
    });
  }

  ngOnInit() {
    (this.fakeData.length) ? this.isData = true : this.isData = false;
  }
  updateliveform() {
    this.showPopupConfirm = true;
    console.log(this.showPopupConfirm);
  }
  closePopup() {
    this.showPopupConfirm = false;
  }
  ngAfterViewInit() {
    // Đang test nên để ở đây ^^
    const linkView = location.href.match(/([^\/]*)\/*$/)[1];
    if (linkView === 'sitereport') {
      const elem = Array.from(document.querySelectorAll('#contentDisplay, #toggle-menu-child, #header-table-child'));
      // elem.forEach(e => e.parentNode.removeChild(e));
      elem.forEach(e => (<HTMLElement>e).style.display = 'none');
      console.log(elem);
    } else {
      const elem = Array.from(document.querySelectorAll('#header-table, #toggle-menu, #template0, #template1'));
      // elem.forEach(x => x.parentNode.removeChild(x));
      elem.forEach(e => (<HTMLElement>e).style.display = 'none');
      console.log(elem);
    }
  }
}
