import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { SoilCondition } from '../../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { Subscription } from 'rxjs';
import Utils from '../../../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-soil-condition',
  templateUrl: './soil-condition.component.html',
  styleUrls: ['./soil-condition.component.scss']
})
export class SoilConditionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploadFooting') uploadFooting;
  @ViewChild('uploadInvestigation') uploadInvestigation;
  @ViewChild('autofocus') autofocus;
  soilConditionForm: FormGroup;

  footingImageUrls = [];
  investigationImageUrls = [];
  url;
  isViewMode;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  soilConditionModel = new SoilCondition();
  subscription: Subscription;
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    const loadingData$ = this.siteSurveyReportService.watchingSignalLoad().subscribe(signal => {
      this.checkFlag();
      this.initData();
      this.createForm();
      loadingData$.unsubscribe();
    });
    this.subscription = this.siteSurveyReportService.watchingSignalEdit().subscribe(signal => {
      this.isViewMode = !signal;
      if (this.isViewMode && this.soilConditionForm) {
        this.soilConditionForm.disable();
      }
      if (!this.isViewMode && this.soilConditionForm) {
        this.soilConditionForm.enable();
      }
      this.checkFlag();
      this.initData();
      this.createForm();
      this.checkFlag();
    });
  }
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  ngAfterViewInit() {
    if (!this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }
  createForm() {
    this.soilConditionForm = this.fb.group({
      nenMongHienCoDesc: [this.soilConditionModel.nenMongHienCo && this.soilConditionModel.nenMongHienCo.description],
      nenMongHienCoList: null,
      thongTinCongTrinhGanDoDesc: [this.soilConditionModel.thongTinCongTrinhGanDo
        && this.soilConditionModel.thongTinCongTrinhGanDo.description],
      thongTinCongTrinhGanDoList: null
    });
    if (this.isViewMode && this.soilConditionForm) {
      this.soilConditionForm.disable();
    }
    if (!this.isViewMode && this.soilConditionForm) {
      this.soilConditionForm.enable();
    }
    this.soilConditionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }

  initData() {
    const obj = EditComponent.liveformData.soilCondition;
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
    EditComponent.liveformData.soilCondition = new SoilCondition;
    EditComponent.liveformData.soilCondition.nenMongHienCo = {
      description: data.nenMongHienCoDesc,
      images: this.footingImageUrls
    };
    EditComponent.liveformData.soilCondition.thongTinCongTrinhGanDo = {
      description: data.thongTinCongTrinhGanDoDesc,
      images: this.investigationImageUrls
    };
  }

  uploadFootingImage(event) {
    const files = event.target.files;
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadFootingLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadFootingLoading').classList.remove('loader');
          this.footingImageUrls = [...this.footingImageUrls, ...res];
          this.soilConditionForm.get('nenMongHienCoList').patchValue(this.footingImageUrls);
          this.uploadFooting.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadFootingLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.footingImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.footingImageUrls.indexOf(x);
              this.footingImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadInvestigationLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadInvestigationLoading').classList.remove('loader');
          this.investigationImageUrls = [...this.investigationImageUrls, ...res];
          this.soilConditionForm.get('thongTinCongTrinhGanDoList').patchValue(this.investigationImageUrls);
          this.uploadInvestigation.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadInvestigationLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.investigationImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.investigationImageUrls.indexOf(x);
              this.investigationImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
  onFocus(e) {
    const input = e.target.parentNode.firstElementChild;
    e.target.addEventListener('keyup', elem => {
      if (elem.keyCode === 13) {
        input.click();
      }
    });
  }
}
