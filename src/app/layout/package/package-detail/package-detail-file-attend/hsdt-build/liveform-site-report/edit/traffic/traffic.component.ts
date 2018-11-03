import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Traffic } from '../../../../../../../../shared/models/site-survey-report/traffic.model';
import { EditComponent } from '../edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit, AfterViewInit {
  @ViewChild('uploaDisadvantage') uploaDisadvantage;
  @ViewChild('uploaAdvantage') uploaAdvantage;
  @ViewChild('uploadDirection') uploadDirection;
  @ViewChild('uploadExisting') uploadExisting;
  @ViewChild('uploadRoad') uploadRoad;
  @ViewChild('uploadFence') uploadFence;
  @ViewChild('autofocus') autofocus;
  trafficForm: FormGroup;

  disadvantageImageUrls = [];
  advantageImageUrls = [];
  directionImageUrls = [];
  existingImageUrls = [];
  roadImageUrls = [];
  fenceImageUrls = [];
  url;
  isViewMode;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  trafficModel = new Traffic();
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
    this.trafficForm = this.fb.group({
      chiTietDiaHinhKhoKhanDesc: [this.trafficModel.chiTietDiaHinhKhoKhan && this.trafficModel.chiTietDiaHinhKhoKhan.description],
      chiTietDiaHinhKhoKhanList: [null],
      chiTietDiaHinhThuanLoiDesc: [this.trafficModel.chiTietDiaHinhThuanLoi && this.trafficModel.chiTietDiaHinhThuanLoi.description],
      chiTietDiaHinhThuanLoiList: [null],
      huongVaoCongTruongDesc: [this.trafficModel.loiVaoCongTrinhHuongVao && this.trafficModel.loiVaoCongTrinhHuongVao.description],
      huongVaoCongTruongList: [null],
      duongHienCoTrenCongTruongDesc: [this.trafficModel.loiVaoCongTrinhDuongHienCo
        && this.trafficModel.loiVaoCongTrinhDuongHienCo.description],
      duongHienCoTrenCongTruongList: null,
      yeuCauDuongTamDesc: [this.trafficModel.loiVaoCongTrinhYeuCauDuongTam
        && this.trafficModel.loiVaoCongTrinhYeuCauDuongTam.description],
      yeuCauDuongTamList: null,
      yeuCauHangRaoDesc: [this.trafficModel.loiVaoCongTrinhYeuCauHangRao
        && this.trafficModel.loiVaoCongTrinhYeuCauHangRao.description],
      yeuCauHangRaoList: null
    });
    this.trafficForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
    if (this.isViewMode) {
      this.trafficForm.disable();
    }

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
    const obj = LiveformSiteReportComponent.formModel.traffic;
    if (obj) {
      this.trafficModel.chiTietDiaHinhKhoKhan = obj.chiTietDiaHinhKhoKhan && {
        description: obj.chiTietDiaHinhKhoKhan.description,
        images: obj.chiTietDiaHinhKhoKhan.images
      };
      this.trafficModel.chiTietDiaHinhThuanLoi = obj.chiTietDiaHinhThuanLoi && {
        description: obj.chiTietDiaHinhThuanLoi.description,
        images: obj.chiTietDiaHinhThuanLoi.images
      };
      this.trafficModel.loiVaoCongTrinhHuongVao = obj.loiVaoCongTrinhHuongVao && {
        description: obj.loiVaoCongTrinhHuongVao.description,
        images: obj.loiVaoCongTrinhHuongVao.images
      };
      this.trafficModel.loiVaoCongTrinhDuongHienCo = obj.loiVaoCongTrinhDuongHienCo && {
        description: obj.loiVaoCongTrinhDuongHienCo.description,
        images: obj.loiVaoCongTrinhDuongHienCo.images
      };
      this.trafficModel.loiVaoCongTrinhYeuCauDuongTam = obj.loiVaoCongTrinhYeuCauDuongTam && {
        description: obj.loiVaoCongTrinhYeuCauDuongTam.description,
        images: obj.loiVaoCongTrinhYeuCauDuongTam.images
      };
      this.trafficModel.loiVaoCongTrinhYeuCauHangRao = obj.loiVaoCongTrinhYeuCauHangRao && {
        description: obj.loiVaoCongTrinhYeuCauHangRao.description,
        images: obj.loiVaoCongTrinhYeuCauHangRao.images
      };
      this.disadvantageImageUrls = this.trafficModel.chiTietDiaHinhKhoKhan ? this.trafficModel.chiTietDiaHinhKhoKhan.images : [];
      this.advantageImageUrls = this.trafficModel.chiTietDiaHinhThuanLoi ? this.trafficModel.chiTietDiaHinhThuanLoi.images : [];
      this.directionImageUrls = this.trafficModel.loiVaoCongTrinhHuongVao ? this.trafficModel.loiVaoCongTrinhHuongVao.images : [];
      this.existingImageUrls = this.trafficModel.loiVaoCongTrinhDuongHienCo ? this.trafficModel.loiVaoCongTrinhDuongHienCo.images : [];
      this.roadImageUrls = this.trafficModel.loiVaoCongTrinhYeuCauDuongTam ? this.trafficModel.loiVaoCongTrinhYeuCauDuongTam.images : [];
      this.fenceImageUrls = this.trafficModel.loiVaoCongTrinhYeuCauHangRao ? this.trafficModel.loiVaoCongTrinhYeuCauHangRao.images : [];
    }
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.traffic = new Traffic;
    LiveformSiteReportComponent.formModel.traffic.chiTietDiaHinhKhoKhan = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.disadvantageImageUrls
    };
    LiveformSiteReportComponent.formModel.traffic.chiTietDiaHinhThuanLoi = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.advantageImageUrls
    };
    LiveformSiteReportComponent.formModel.traffic.loiVaoCongTrinhHuongVao = {
      description: data.huongVaoCongTruongDesc,
      images: this.directionImageUrls
    };
    LiveformSiteReportComponent.formModel.traffic.loiVaoCongTrinhDuongHienCo = {
      description: data.duongHienCoTrenCongTruongDesc,
      images: this.existingImageUrls
    };
    LiveformSiteReportComponent.formModel.traffic.loiVaoCongTrinhYeuCauDuongTam = {
      description: data.yeuCauDuongTamDesc,
      images: this.roadImageUrls
    };
    LiveformSiteReportComponent.formModel.traffic.loiVaoCongTrinhYeuCauHangRao = {
      description: data.yeuCauHangRaoDesc,
      images: this.fenceImageUrls
    };
  }

  uploaDisadvantageImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.disadvantageImageUrls = [...this.disadvantageImageUrls, ...res];
        this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
        this.uploaDisadvantage.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.disadvantageImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.disadvantageImageUrls.indexOf(x);
            this.disadvantageImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteDisadvantageImage(i) {
    const index = this.disadvantageImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.disadvantageImageUrls.splice(index, 1);
    this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
  }

  uploaAdvantageImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.advantageImageUrls = [...this.advantageImageUrls, ...res];
        this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
        this.uploaAdvantage.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.advantageImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.advantageImageUrls.indexOf(x);
            this.advantageImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteAdvantageImage(i) {
    const index = this.advantageImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.advantageImageUrls.splice(index, 1);
    this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
  }

  uploadDirectionImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.directionImageUrls = [...this.directionImageUrls, ...res];
        this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
        this.uploadDirection.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.directionImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.directionImageUrls.indexOf(x);
            this.directionImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteDirectionImage(i) {
    const index = this.directionImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.directionImageUrls.splice(index, 1);
    this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
  }

  uploadExistingImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.existingImageUrls = [...this.existingImageUrls, ...res];
        this.trafficForm.get('duongHienCoTrenCongTruongList').patchValue(this.existingImageUrls);
        this.uploadExisting.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.existingImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.existingImageUrls.indexOf(x);
            this.existingImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteExistingImage(i) {
    const index = this.existingImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.existingImageUrls.splice(index, 1);
    this.trafficForm.get('duongHienCoTrenCongTruongList').patchValue(this.existingImageUrls);
  }

  uploadRoadImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.roadImageUrls = [...this.roadImageUrls, ...res];
        this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
        this.uploadRoad.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.roadImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.roadImageUrls.indexOf(x);
            this.roadImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteRoadImage(i) {
    const index = this.roadImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.roadImageUrls.splice(index, 1);
    this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
  }

  uploadFenceImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.fenceImageUrls = [...this.fenceImageUrls, ...res];
        this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
        this.uploadFence.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.fenceImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.fenceImageUrls.indexOf(x);
            this.fenceImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteFenceImage(i) {
    const index = this.fenceImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.fenceImageUrls.splice(index, 1);
    this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
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
