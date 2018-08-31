import { Component, OnInit, AfterViewInit, OnChanges, AfterContentInit } from '@angular/core';
import { Router, Event, NavigationStart, NavigationEnd, NavigationError } from '@angular/router';
import { DATETIME_PICKER_CONFIG } from '../../../../../../shared/configs/datepicker.config';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService, AlertService } from '../../../../../../shared/services';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
@Component({
  selector: 'app-site-survey-report',
  templateUrl: './site-survey-report.component.html',
  styleUrls: ['./site-survey-report.component.scss']
})
export class SiteSurveyReportComponent implements OnInit, AfterViewInit {
  dtTrigger: Subject<any> = new Subject();
  showBeforeLogin: any = true;
  showAfterLogin: any;
  isData;
  showPopupConfirm = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  currentDocumentId: number;
  fakeData = [
    {
      id: 0,
      stt: 1,
      ttl: 'Tài liệu nghìn đô',
      lpv: 4,
      maker: 'Khanh Hoang',
      date: '30/08/2018',
      classify: 'MEP',
      classifyType: 'Nâng cấp, cải tiến (Renovation)',
      area: 12334234,
      totalBuild: 99999,
      numberOfFloor: 40,
      progress: 250
    },
    {
      id: 1,
      stt: 2,
      ttl: 'Tài liệu tỉ đô',
      lpv: 3,
      maker: 'Khanh Hoang 1',
      date: '30/08/2018',
      classify: 'Hạ tầng',
      classifyType: 'Mới (New)',
      area: 12334234,
      totalBuild: 7654332,
      numberOfFloor: 25,
      progress: 400
    }
  ];
  isDeleteDocument;
  isEditDocument;
  isViewDocumentDetail;
  listPrivileges = [];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService,
  ) { }

  ngOnInit() {
    (this.fakeData.length) ? this.isData = true : this.isData = false;
    this.currentDocumentId = this.fakeData[0].id;
    // const a = new Array(this.fakeData.forEach(e => e.id));
    // setTimeout(() => {
    //   this.userModel = this.sessionService.userInfo;
    //   this.listPrivileges = this.userModel.privileges;
    //   if (this.listPrivileges) {
    //     this.isDeleteDocument = this.listPrivileges.some(x => x === 'DeleteDocument');
    //     this.isEditDocument = this.listPrivileges.some(x => x === 'EditDocument');
    //     this.isViewDocumentDetail = this.listPrivileges.some(x => x === 'ViewDocument');
    //   }
    // }, 300);
  }

  ngAfterViewInit() {
    const linkView = location.href.match(/([^\/]*)\/*$/)[1];
    if (linkView === 'sitereport') {
      const elem = Array.from(document.querySelectorAll('#contentDisplay, #toggle-menu-child, #header-table-child'));
      elem.forEach(e => { (<HTMLElement>e).style.visibility = 'hidden'; (<HTMLElement>e).style.position = 'absolute'; });
      console.log(elem);
    } else {
      const elem = Array.from(document.querySelectorAll('#header-table, #toggle-menu, #template0, #template1'));
      elem.forEach(e => { (<HTMLElement>e).style.visibility = 'hidden'; (<HTMLElement>e).style.position = 'absolute'; });
      console.log(elem);
    }
  }
  refresh(): void {
    this.spinner.show();
    this.dtTrigger.next();
    this.spinner.hide();
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }

  updateliveform() {
    this.showPopupConfirm = true;
    console.log(this.showPopupConfirm);
  }
  closePopup() {
    this.showPopupConfirm = false;
  }
}
