import { Component, OnInit } from '@angular/core';
import { DATETIME_PICKER_CONFIG } from '../../../../../../../shared/configs/datepicker.config';
// tslint:disable-next-line:import-blacklist
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService, SessionService } from '../../../../../../../shared/services';
import { NgxSpinnerService } from 'ngx-spinner';
import { SiteSurveyReport } from '../../../../../../../shared/models/site-survey-report/site-survey-report';
import { DocumentService } from '../../../../../../../shared/services/document.service';
import { LiveformSiteReportComponent } from '../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../package-detail.component';
import { ScaleOverall } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';
import { DescribeOverall } from '../../../../../../../shared/models/site-survey-report/describe-overall.model';
import { Traffic } from '../../../../../../../shared/models/site-survey-report/traffic.model';
import { DemoConso } from '../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { ServiceConstruction } from '../../../../../../../shared/models/site-survey-report/service-construction.model';
import { SoilCondition } from '../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { UsefulInfo, ContentItem } from '../../../../../../../shared/models/site-survey-report/useful-info.model';
import { Image } from '../../../../../../../shared/models/site-survey-report/image';
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';

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
  packageData = new PackageInfoModel();
  bidDocumentGroupListItem: SiteSurveyReport[];
  bidDocumentGroupListItemSearchResult: SiteSurveyReport[];

  constructor(
    private documentService: DocumentService,
    private packageService: PackageService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService,
    private sessionService: SessionService
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.currentBidOpportunityId).subscribe(result => {
      this.packageData = result;
    });
    this.documentService.tenderSiteSurveyingReport(this.currentBidOpportunityId).subscribe(data => {
      LiveformSiteReportComponent.formModel = data;
    });
  }

  submitLiveForm(event) {
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      const objData = LiveformSiteReportComponent.formModel;
      console.log(objData);
      this.documentService
        .createOrUpdateSiteSurveyingReport(objData)
        .subscribe();
      this.showPopupConfirm = false;
      this.alertService.success('Đã cập nhật thành công!');
      this.spinner.hide();
      setTimeout(
        this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/info/scale`]), 300);
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
  }
}
