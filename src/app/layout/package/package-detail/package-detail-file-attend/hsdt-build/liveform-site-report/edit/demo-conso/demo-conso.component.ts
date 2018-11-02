import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-demo-conso',
  templateUrl: './demo-conso.component.html',
  styleUrls: ['./demo-conso.component.scss']
})
export class DemoConsoComponent implements OnInit, AfterViewInit {
  @ViewChild('uploadDemobilisation') uploadDemobilisation;
  @ViewChild('uploadConsolidation') uploadConsolidation;
  @ViewChild('uploaAdjacent') uploaAdjacent;
  @ViewChild('autofocus') autofocus;
  demoConsoForm: FormGroup;

  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  isViewMode = false;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  demoConsoModel = new DemoConso();
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
    this.demoConsoForm = this.fb.group({
      phaVoKetCauDesc: [this.demoConsoModel.phaVoKetCau && this.demoConsoModel.phaVoKetCau.description],
      phaVoKetCauList: [null],
      giaCoKetCauDesc: [this.demoConsoModel.giaCoKetCau && this.demoConsoModel.giaCoKetCau.description],
      giaCoKetCauList: [null],
      dieuKienHinhAnhDesc: [this.demoConsoModel.dieuKien && this.demoConsoModel.dieuKien.description],
      dieuKienHinhAnhList: [null]
    });
    this.demoConsoForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  ngAfterViewInit() {
    if (!this.isViewMode) {
      this.autofocus.nativeElement.focus();
    }
  }
  checkFlag() {
    this.isViewMode = LiveformSiteReportComponent.actionMode === 'viewMode';
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.demoConso;
    if (obj) {
      this.demoConsoModel.phaVoKetCau = obj.phaVoKetCau && {
        description: obj.phaVoKetCau.description,
        images: obj.phaVoKetCau.images
      };
      this.demoConsoModel.giaCoKetCau = obj.giaCoKetCau && {
        description: obj.giaCoKetCau.description,
        images: obj.giaCoKetCau.images
      };
      this.demoConsoModel.dieuKien = obj.dieuKien && {
        description: obj.dieuKien.description,
        images: obj.dieuKien.images
      };
      this.demobilisationImageUrls = this.demoConsoModel.phaVoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.consolidationImageUrls = this.demoConsoModel.giaCoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.adjacentImageUrls = this.demoConsoModel.dieuKien ? this.demoConsoModel.dieuKien.images : [];
    }
  }


  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.demoConso = new DemoConso;
    LiveformSiteReportComponent.formModel.demoConso.phaVoKetCau = {
      description: data.phaVoKetCauDesc,
      images: this.demobilisationImageUrls
    };
    LiveformSiteReportComponent.formModel.demoConso.giaCoKetCau = {
      description: data.giaCoKetCauDesc,
      images: this.consolidationImageUrls
    };
    LiveformSiteReportComponent.formModel.demoConso.dieuKien = {
      description: data.dieuKienHinhAnhDesc,
      images: this.adjacentImageUrls
    };
  }


  uploadDemobilisationImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.demobilisationImageUrls = [...this.demobilisationImageUrls, ...res];
        this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
        this.uploadDemobilisation.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.demobilisationImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.demobilisationImageUrls.indexOf(x);
            this.demobilisationImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteDemobilisationImage(i) {
    const index = this.demobilisationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.demobilisationImageUrls.splice(index, 1);
    this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
  }

  uploadConsolidationImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.consolidationImageUrls = [...this.consolidationImageUrls, ...res];
        this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
        this.uploadConsolidation.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.consolidationImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.consolidationImageUrls.indexOf(x);
            this.consolidationImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteConsolidationImage(i) {
    const index = this.consolidationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.consolidationImageUrls.splice(index, 1);
    this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
  }

  uploaAdjacentImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.adjacentImageUrls = [...this.adjacentImageUrls, ...res];
        this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
        this.uploaAdjacent.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.adjacentImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.adjacentImageUrls.indexOf(x);
            this.adjacentImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteAdjacentImage(i) {
    const index = this.adjacentImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.adjacentImageUrls.splice(index, 1);
    this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
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
