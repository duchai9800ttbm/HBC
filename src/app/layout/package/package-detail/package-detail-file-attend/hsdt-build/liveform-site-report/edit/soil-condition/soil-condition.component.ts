import { Component, OnInit } from '@angular/core';
import { SoilCondition } from '../../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-soil-condition',
  templateUrl: './soil-condition.component.html',
  styleUrls: ['./soil-condition.component.scss']
})
export class SoilConditionComponent implements OnInit {
  soilConditionForm: FormGroup;

  footingImageUrls = [];
  investigationImageUrls = [];
  url;
  viewMode;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  soilConditionModel = new SoilCondition();
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
    this.soilConditionForm = this.fb.group({
      nenMongHienCoDesc: [this.soilConditionModel.nenMongHienCo && this.soilConditionModel.nenMongHienCo.description],
      nenMongHienCoList: null,
      thongTinCongTrinhGanDoDesc: [this.soilConditionModel.thongTinCongTrinhGanDo
        && this.soilConditionModel.thongTinCongTrinhGanDo.description],
      thongTinCongTrinhGanDoList: null
    });
    this.soilConditionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  checkFlag() {
    const flag = LiveformSiteReportComponent.isViewMode;
    this.viewMode = flag;
    if (flag) {
      const inputs = document.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        inputs[i].style.pointerEvents = 'none';
      }
    }
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.soilCondition;
    if (obj) {
      this.soilConditionModel.nenMongHienCo = obj.nenMongHienCo && {
        description: obj.nenMongHienCo.description,
        images: obj.nenMongHienCo.images
      };
      this.soilConditionModel.thongTinCongTrinhGanDo = obj.thongTinCongTrinhGanDo && {
        description: obj.thongTinCongTrinhGanDo.description,
        images: obj.thongTinCongTrinhGanDo.images
      };
      this.footingImageUrls = this.soilConditionModel.nenMongHienCo ? this.soilConditionModel.nenMongHienCo.images : [];
      this.investigationImageUrls = this.soilConditionModel.thongTinCongTrinhGanDo ?
        this.soilConditionModel.thongTinCongTrinhGanDo.images : [];
    }
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.soilCondition = new SoilCondition;
    LiveformSiteReportComponent.formModel.soilCondition.nenMongHienCo = {
      description: data.nenMongHienCoDesc,
      images: this.footingImageUrls
    };
    LiveformSiteReportComponent.formModel.soilCondition.thongTinCongTrinhGanDo = {
      description: data.thongTinCongTrinhGanDoDesc,
      images: this.investigationImageUrls
    };
  }

  uploadFootingImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.footingImageUrls = [...this.footingImageUrls, ...res];
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.footingImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.footingImageUrls.indexOf(x);
            this.footingImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteFootingImage(i) {
    const index = this.footingImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.footingImageUrls.splice(index, 1);
    this.soilConditionForm.get('nenMongHienCoList').patchValue(this.footingImageUrls);
  }

  uploadInvestigationImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.investigationImageUrls = [...this.investigationImageUrls, ...res];
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.investigationImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.investigationImageUrls.indexOf(x);
            this.investigationImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteInvestigationImage(i) {
    const index = this.investigationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.investigationImageUrls.splice(index, 1);
    this.soilConditionForm.get('thongTinCongTrinhGanDoList').patchValue(this.investigationImageUrls);
  }
  viewFullScreenImage(listImage, indexImage?) {
    this.showPopupViewImage = true;
    this.imageUrlArray = [...listImage];
    this.indexOfImage = indexImage;
  }
  closeView() {
    this.showPopupViewImage = false;
  }
}
