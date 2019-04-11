import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { Traffic } from '../../../../../../../../shared/models/site-survey-report/traffic.model';
import { EditComponent } from '../edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { Subscription } from 'rxjs';
import Utils from '../../../../../../../../shared/helpers/utils.helper';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit, AfterViewInit, OnDestroy {
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
      if (this.isViewMode && this.trafficForm) {
        this.trafficForm.disable();
      }
      if (!this.isViewMode && this.trafficForm) {
        this.trafficForm.enable();
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
    if (this.isViewMode && this.trafficForm) {
      this.trafficForm.disable();
    }
    if (!this.isViewMode && this.trafficForm) {
      this.trafficForm.enable();
    }
    this.trafficForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }
  initData() {
    const obj = EditComponent.liveformData.traffic;
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
    EditComponent.liveformData.traffic = new Traffic;
    EditComponent.liveformData.traffic.chiTietDiaHinhKhoKhan = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.disadvantageImageUrls
    };
    EditComponent.liveformData.traffic.chiTietDiaHinhThuanLoi = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.advantageImageUrls
    };
    EditComponent.liveformData.traffic.loiVaoCongTrinhHuongVao = {
      description: data.huongVaoCongTruongDesc,
      images: this.directionImageUrls
    };
    EditComponent.liveformData.traffic.loiVaoCongTrinhDuongHienCo = {
      description: data.duongHienCoTrenCongTruongDesc,
      images: this.existingImageUrls
    };
    EditComponent.liveformData.traffic.loiVaoCongTrinhYeuCauDuongTam = {
      description: data.yeuCauDuongTamDesc,
      images: this.roadImageUrls
    };
    EditComponent.liveformData.traffic.loiVaoCongTrinhYeuCauHangRao = {
      description: data.yeuCauHangRaoDesc,
      images: this.fenceImageUrls
    };
  }

  uploaDisadvantageImage(event) {
    const files = event.target.files;
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploaDisadvantageLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploaDisadvantageLoading').classList.remove('loader');
          this.disadvantageImageUrls = [...this.disadvantageImageUrls, ...res];
          this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
          this.uploaDisadvantage.nativeElement.value = null;
        }, err => {
          document.getElementById('uploaDisadvantageLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.disadvantageImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.disadvantageImageUrls.indexOf(x);
              this.disadvantageImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploaAdvantageLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploaAdvantageLoading').classList.remove('loader');
          this.advantageImageUrls = [...this.advantageImageUrls, ...res];
          this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
          this.uploaAdvantage.nativeElement.value = null;
        }, err => {
          document.getElementById('uploaAdvantageLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.advantageImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.advantageImageUrls.indexOf(x);
              this.advantageImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadDirectionLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadDirectionLoading').classList.remove('loader');
          this.directionImageUrls = [...this.directionImageUrls, ...res];
          this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
          this.uploadDirection.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadDirectionLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.directionImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.directionImageUrls.indexOf(x);
              this.directionImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadExistingLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadExistingLoading').classList.remove('loader');
          this.existingImageUrls = [...this.existingImageUrls, ...res];
          this.trafficForm.get('duongHienCoTrenCongTruongList').patchValue(this.existingImageUrls);
          this.uploadExisting.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadExistingLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.existingImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.existingImageUrls.indexOf(x);
              this.existingImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadRoadLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadRoadLoading').classList.remove('loader');
          this.roadImageUrls = [...this.roadImageUrls, ...res];
          this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
          this.uploadRoad.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadRoadLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.roadImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.roadImageUrls.indexOf(x);
              this.roadImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
    if (Utils.checkTypeFileImage(files)) {
      document.getElementById('uploadFenceLoading').classList.add('loader');
      this.siteSurveyReportService
        .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
        .subscribe(res => {
          document.getElementById('uploadFenceLoading').classList.remove('loader');
          this.fenceImageUrls = [...this.fenceImageUrls, ...res];
          this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
          this.uploadFence.nativeElement.value = null;
        }, err => {
          document.getElementById('uploadFenceLoading').classList.remove('loader');
          this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
          this.fenceImageUrls.forEach(x => {
            if (!x.id) {
              const index = this.fenceImageUrls.indexOf(x);
              this.fenceImageUrls.splice(index, 1);
            }
          });
        });
    } else {
      this.alertService.error('Hệ thống không hỗ trợ upload loại file này. Những loại file được hỗ trợ bao gồm jpg, .jpeg');
    }
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
  onFocus(e) {
    const input = e.target.parentNode.firstElementChild;
    e.target.addEventListener('keyup', elem => {
      if (elem.keyCode === 13) {
        input.click();
      }
    });
  }
}
