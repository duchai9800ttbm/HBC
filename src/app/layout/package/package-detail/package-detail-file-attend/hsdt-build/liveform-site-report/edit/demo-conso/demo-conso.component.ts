import { Component, OnInit } from '@angular/core';
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
export class DemoConsoComponent implements OnInit {
  demoConsoForm: FormGroup;

  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  viewMode;
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
  checkFlag() {
    if ((LiveformSiteReportComponent.formModel.isCreateOrEdit)) {
      const flag = LiveformSiteReportComponent.viewFlag;
      this.viewMode = flag;
      if (flag) {
        const inputs = document.getElementsByTagName('input');
        for (let i = 0; i < inputs.length; i++) {
          inputs[i].style.pointerEvents = 'none';
        }
      }
    } else {
      this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
    }
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
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.demobilisationImageUrls.push({
              id: null,
              thumbSizeUrl: null,
              largeSizeUrl: null,
              file: file,
              base64: e.target.result
            });
            this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.demobilisationImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.demobilisationImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.demobilisationImageUrls.splice(index, 1);
    this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
  }

  uploadConsolidationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.consolidationImageUrls.push({
              id: null,
              image: {
                file: file,
                base64: e.target.result
              }
            });
            this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.consolidationImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.consolidationImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.consolidationImageUrls.splice(index, 1);
    this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
  }

  uploaAdjacentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        if (file.size < 10485760) {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.adjacentImageUrls.push({
              id: null,
              image: {
                file: file,
                base64: e.target.result
              }
            });
            this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
          };
          reader.readAsDataURL(file);
        } else {
          this.alertService.error(`Hình ảnh ${file.name} quá lớn! Vui lòng chọn hình ảnh khác`);
        }
      }
    }
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(this.adjacentImageUrls, this.currentBidOpportunityId)
      .subscribe(res => {
        this.adjacentImageUrls = res;
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
    if (i.id) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.id).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.adjacentImageUrls.splice(index, 1);
    this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
  }
}
