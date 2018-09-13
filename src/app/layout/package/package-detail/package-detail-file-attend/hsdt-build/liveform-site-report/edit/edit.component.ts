import { Component, OnInit } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService, SessionService } from '../../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { SiteSurveyReport } from '../../../../../../../shared/models/site-survey-report/site-survey-report';
import { LiveformDataReportService } from '../../../../../../../shared/services/liveform-data-report.service';
import { DocumentService } from '../../../../../../../shared/services/document.service';
import { LiveformSiteReportComponent } from '../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { ScaleOverall } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';
import { DescribeOverall } from '../../../../../../../shared/models/site-survey-report/describe-overall.model';
import { Traffic } from '../../../../../../../shared/models/site-survey-report/traffic.model';
import { DemoConso } from '../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { ServiceConstruction } from '../../../../../../../shared/models/site-survey-report/service-construction.model';
import { SoilCondition } from '../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { UsefulInfo } from '../../../../../../../shared/models/site-survey-report/useful-info.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit {
  static formModel: SiteSurveyReport = new SiteSurveyReport();

  dtTrigger: Subject<any> = new Subject();
  showBeforeLogin: any = true;
  showAfterLogin: any;
  isData;
  showPopupConfirm = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  currentBidOpportunityId: number;

  bidDocumentGroupListItem: SiteSurveyReport[];
  bidDocumentGroupListItemSearchResult: SiteSurveyReport[];

  // fakeData = [
  //   {
  //     id: 3,
  //     stt: 1,
  //     ttl: 'Báo cáo khảo sát công trường',
  //     lpv: 1,
  //     maker: 'Oliver Dang',
  //     date: '15/12/2017, 09:00',
  //     classify: 'MEP',
  //     classifyType: 'Nâng cấp, cải tiến (Renovation)',
  //     area: 12334234,
  //     totalBuild: 99999,
  //     numberOfFloor: 40,
  //     progress: 250,
  //     updateTimes: 2,
  //     updater: 'Oliver Dang',
  //     updateDate: '15/12/2017, 09:00',
  //     updateContent: 'Chọn lại loại công trình, thêm ảnh',
  //     updateDetail: 'Loại công trình mới'
  //   },
  //   {
  //     id: 4,
  //     stt: 2,
  //     ttl: 'Báo cáo khảo sát công trường',
  //     lpv: 1,
  //     maker: 'Oliver Dang',
  //     date: '15/12/2017, 09:00',
  //     classify: 'Sân bay',
  //     classifyType: 'Mới (New)',
  //     area: 12334234,
  //     totalBuild: 8888,
  //     numberOfFloor: 35,
  //     progress: 550,
  //     updateTimes: 1,
  //     updater: 'Oliver Dang',
  //     updateDate: '15/11/2017, 07:00',
  //     updateContent: 'Chọn lại loại công trình, thêm ảnh',
  //     updateDetail: 'Loại công trình mới'
  //   }
  // ];


  constructor(
    private documentService: DocumentService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService,
    private liveformDataReportService: LiveformDataReportService
  ) { }

  ngOnInit() {
    const elem = Array.from(document.querySelectorAll('#header-table, #toggle-menu'));
    elem.forEach(e => { (<HTMLElement>e).style.visibility = 'hidden'; (<HTMLElement>e).style.position = 'absolute'; });
    // check action
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    // this.createNewReport();
    // this.documentService.tenderSiteSurveyingReport(this.currentBidOpportunityId).subscribe(data => {
    //   EditComponent.formModel = data;
    // });
  }

  createNewReport() {
    const modelEmpty = new SiteSurveyReport();
    modelEmpty.bidOpportunityId = this.currentBidOpportunityId;
    // modelEmpty.ngayTao = LiveformSiteReportComponent.documentData.creatEmpl
    console.log(typeof (modelEmpty));
  }
  refresh(): void {
    this.spinner.show();
    this.dtTrigger.next();
    this.spinner.hide();
    this.alertService.success('Dữ liệu đã được cập nhật mới nhất!');
  }


  updateliveform() {
    this.showPopupConfirm = true;
  }
  closePopup() {
    this.showPopupConfirm = false;
  }
}
