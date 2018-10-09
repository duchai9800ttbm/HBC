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
import { SiteSurveyReportService } from '../../../../../../../shared/services/site-survey-report.service';
import { DictionaryItem } from '../../../../../../../shared/models';
// const objectToFormData = require('object-to-formdata');

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent implements OnInit, OnDestroy {
  dtTrigger: Subject<any> = new Subject();
  showBeforeLogin: any = true;
  showAfterLogin: any;
  isData;
  showPopupConfirm = false;
  datePickerConfig = DATETIME_PICKER_CONFIG;
  stepNameList = [
    'ScaleOverallComponent',
    'DescribeOverallComponent',
    'TrafficComponent',
    'DemoConsoComponent',
    'ServiceConstructionComponent',
    'SoilConditionComponent',
    'UsefulInfoComponent'
  ];
  stepName;
  currentBidOpportunityId: number;
  packageData = new PackageInfoModel();
  listCustomerContact;
  ngayKhaoSat;
  constructor(
    private documentService: DocumentService,
    private siteSurveyReportService: SiteSurveyReportService,
    private packageService: PackageService,
    private router: Router,
    private alertService: AlertService,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    this.getInfoTenderPreparationPlanning();
    this.getCustomerContact();
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.packageService.getInforPackageID(this.currentBidOpportunityId).subscribe(result => {
      this.packageData = result;
    });
  }
  getCustomerContact() {
    this.siteSurveyReportService.getListCustomerContact(0, 10).subscribe(data => {
      this.listCustomerContact = data.items;
    });
  }
  getInfoTenderPreparationPlanning() {
    this.packageService.getTenderPreparationPlanning(this.currentBidOpportunityId).subscribe(data => {
      this.ngayKhaoSat = data.finishDate;
    });
  }
  submitLiveForm(event) {
    if (!event) {
      this.showPopupConfirm = false;
    } else {
      const objData = LiveformSiteReportComponent.formModel;
      this.showPopupConfirm = false;
      this.spinner.show();
      this.siteSurveyReportService
        .createOrUpdateSiteSurveyingReport(objData)
        .subscribe(() => {
          this.showPopupConfirm = false;
          this.spinner.hide();
          this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/info/scale`]);
          this.alertService.success('Đã cập nhật thành công!');
        }, err => {
          this.showPopupConfirm = false;
          this.spinner.hide();
          this.alertService.error('Đã xảy ra lỗi. Cập nhật không thành công!');
        });
      // LiveformSiteReportComponent.viewFlag = true;
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
  cancelCreateUpdate() {
    this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
  }

  disableSideMenu(event) {
    this.stepName = event.constructor.name;
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'none';
    elemm.style.visibility = 'hidden';
    elemm.style.position = 'absolute';
  }
  nextStep() {
    const index = this.stepNameList.indexOf(this.stepName);
    switch (index) {
      case 0: {
        const step = `describe`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 1: {
        const step = `traffic`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 2: {
        const step = `demo-conso`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 3: {
        const step = `service-construction`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 4: {
        const step = `soil`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 5: {
        const step = `moreinfo`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
    }
  }
  preStep() {
    const index = this.stepNameList.indexOf(this.stepName);
    switch (index) {
      case 2: {
        const step = `describe`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 3: {
        const step = `traffic`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 4: {
        const step = `demo-conso`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 5: {
        const step = `service-construction`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 6: {
        const step = `soil`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
      case 1: {
        const step = `scale`;
        const parameter = `/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite/edit/${step}`;
        this.router.navigate([parameter]);
        break;
      }
    }
  }
  ngOnDestroy() {
    const elem = document.getElementById('toggle-menu');
    const elemm = document.getElementById('header-table-build');
    elem.style.display = 'unset';
    elemm.style.visibility = 'unset';
    elemm.style.position = 'static';
  }
}
