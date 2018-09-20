import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { PackageService } from '../../../../../../../shared/services/package.service';
import { PackageInfoModel } from '../../../../../../../shared/models/package/package-info.model';
// const objectToFormData = require('object-to-formdata');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  // static onload;

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
    private spinner: NgxSpinnerService
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
      this.documentService
        .createOrUpdateSiteSurveyingReport(objData)
        .subscribe(() => {
          this.showPopupConfirm = false;
          this.spinner.hide();
          this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/info/scale`]);
          this.alertService.success('Đã cập nhật thành công!');
        });
      LiveformSiteReportComponent.viewFlag = true;
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

  disableSideMenu(event) {
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'none';
    elemm.style.visibility = 'hidden';
    elemm.style.position = 'absolute';
  }
  ngOnDestroy() {
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'unset';
    elemm.style.visibility = 'unset';
    elemm.style.position = 'static';
  }
}
