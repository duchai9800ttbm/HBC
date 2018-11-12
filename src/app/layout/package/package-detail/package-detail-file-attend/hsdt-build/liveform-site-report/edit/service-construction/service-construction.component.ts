import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ServiceConstruction } from '../../../../../../../../shared/models/site-survey-report/service-construction.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { AlertService } from '../../../../../../../../shared/services';
import { SiteSurveyReportService } from '../../../../../../../../shared/services/site-survey-report.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-service-construction',
  templateUrl: './service-construction.component.html',
  styleUrls: ['./service-construction.component.scss']
})
export class ServiceConstructionComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('uploadSupplySystem') uploadSupplySystem;
  @ViewChild('uploadSupplyPoint') uploadSupplyPoint;
  @ViewChild('uploadDrainageSystem') uploadDrainageSystem;
  @ViewChild('uploadDrainagePoint') uploadDrainagePoint;
  @ViewChild('uploadPowerStation') uploadPowerStation;
  @ViewChild('uploadMediumVoltageSystem') uploadMediumVoltageSystem;
  @ViewChild('uploadPowerOther') uploadPowerOther;
  @ViewChild('autofocus') autofocus;
  serviceConstructionForm: FormGroup;
  supplySystemImageUrls = [];
  supplyPointImageUrls = [];
  drainageSystemImageUrls = [];
  drainagePointImageUrls = [];
  powerStationImageUrls = [];
  mediumVoltageSystemImageUrls = [];
  powerOtherImageUrls = [];
  url;
  isViewMode;
  imageUrlArray = [];
  indexOfImage;
  showPopupViewImage = false;
  currentBidOpportunityId: number;
  serviceConstructionModel = new ServiceConstruction();
  subscription: Subscription;
  constructor(
    private siteSurveyReportService: SiteSurveyReportService,
    private alertService: AlertService,
    private router: Router,
    private fb: FormBuilder
  ) {

  }

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
      if (this.isViewMode && this.serviceConstructionForm) {
        this.serviceConstructionForm.disable();
      }
      if (!this.isViewMode && this.serviceConstructionForm) {
        this.serviceConstructionForm.enable();
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
    this.serviceConstructionForm = this.fb.group({
      heThongNuocHienHuuDesc: [
        this.serviceConstructionModel.heThongNuocHeThongHienHuu
        && this.serviceConstructionModel.heThongNuocHeThongHienHuu.description
      ],
      heThongNuocHienHuuList: null,
      heThongNuocDiemDauNoiDesc: [
        this.serviceConstructionModel.heThongNuocDiemDauNoi
        && this.serviceConstructionModel.heThongNuocDiemDauNoi.description
      ],
      heThongNuocDiemDauNoiList: null,
      heThongNuocThoatHienHuuDesc: [
        this.serviceConstructionModel.heThongNuocThoatHeThongHienHuu
        && this.serviceConstructionModel.heThongNuocThoatHeThongHienHuu.description
      ],
      heThongNuocThoatHienHuuList: null,
      heThongNuocThoatDiemDauNoiDesc: [
        this.serviceConstructionModel.heThongNuocThoatDiemDauNoi
        && this.serviceConstructionModel.heThongNuocThoatDiemDauNoi.description
      ],
      heThongNuocThoatDiemDauNoiList: null,
      tramHaTheDesc: [
        this.serviceConstructionModel.heThongDienTramHaThe
        && this.serviceConstructionModel.heThongDienTramHaThe.description
      ],
      tramHaTheList: null,
      duongDayTrungTheDesc: [
        this.serviceConstructionModel.heThongDienDuongDayTrungThe
        && this.serviceConstructionModel.heThongDienDuongDayTrungThe.description],
      duongDayTrungTheList: null,
      heThongDienKhacDesc: [
        this.serviceConstructionModel.heThongDienThongTinKhac
        && this.serviceConstructionModel.heThongDienThongTinKhac.description
      ],
      heThongDienKhacList: null
    });
    if (this.isViewMode && this.serviceConstructionForm) {
      this.serviceConstructionForm.disable();
    }
    if (!this.isViewMode && this.serviceConstructionForm) {
      this.serviceConstructionForm.enable();
    }
    this.serviceConstructionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }
  checkFlag() {
    this.isViewMode = EditComponent.actionMode === 'info';
  }
  initData() {
    const obj = EditComponent.liveformData.serviceConstruction;
    if (obj) {
      this.serviceConstructionModel.heThongNuocHeThongHienHuu = obj.heThongNuocHeThongHienHuu && {
        description: obj.heThongNuocHeThongHienHuu.description,
        images: obj.heThongNuocHeThongHienHuu.images
      };
      this.serviceConstructionModel.heThongNuocDiemDauNoi = obj.heThongNuocDiemDauNoi && {
        description: obj.heThongNuocDiemDauNoi.description,
        images: obj.heThongNuocDiemDauNoi.images
      };
      this.serviceConstructionModel.heThongNuocThoatHeThongHienHuu = obj.heThongNuocThoatHeThongHienHuu && {
        description: obj.heThongNuocThoatHeThongHienHuu.description,
        images: obj.heThongNuocThoatHeThongHienHuu.images
      };
      this.serviceConstructionModel.heThongNuocThoatDiemDauNoi = obj.heThongNuocThoatDiemDauNoi && {
        description: obj.heThongNuocThoatDiemDauNoi.description,
        images: obj.heThongNuocThoatDiemDauNoi.images
      };
      this.serviceConstructionModel.heThongDienTramHaThe = obj.heThongDienTramHaThe && {
        description: obj.heThongDienTramHaThe.description,
        images: obj.heThongDienTramHaThe.images
      };
      this.serviceConstructionModel.heThongDienDuongDayTrungThe = obj.heThongDienDuongDayTrungThe && {
        description: obj.heThongDienDuongDayTrungThe.description,
        images: obj.heThongDienDuongDayTrungThe.images
      };
      this.serviceConstructionModel.heThongDienThongTinKhac = obj.heThongDienThongTinKhac && {
        description: obj.heThongDienThongTinKhac.description,
        images: obj.heThongDienThongTinKhac.images
      };
      this.supplySystemImageUrls = this.serviceConstructionModel.heThongNuocHeThongHienHuu ?
        this.serviceConstructionModel.heThongNuocHeThongHienHuu.images : [];
      this.supplyPointImageUrls = this.serviceConstructionModel.heThongNuocDiemDauNoi ?
        this.serviceConstructionModel.heThongNuocDiemDauNoi.images : [];
      this.drainageSystemImageUrls = this.serviceConstructionModel.heThongNuocThoatHeThongHienHuu ?
        this.serviceConstructionModel.heThongNuocThoatHeThongHienHuu.images : [];
      this.drainagePointImageUrls = this.serviceConstructionModel.heThongNuocThoatDiemDauNoi ?
        this.serviceConstructionModel.heThongNuocThoatDiemDauNoi.images : [];
      this.powerStationImageUrls = this.serviceConstructionModel.heThongDienTramHaThe ?
        this.serviceConstructionModel.heThongDienTramHaThe.images : [];
      this.mediumVoltageSystemImageUrls = this.serviceConstructionModel.heThongDienDuongDayTrungThe ?
        this.serviceConstructionModel.heThongDienDuongDayTrungThe.images : [];
      this.powerOtherImageUrls = this.serviceConstructionModel.heThongDienThongTinKhac ?
        this.serviceConstructionModel.heThongDienThongTinKhac.images : [];
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.liveformData.serviceConstruction = new ServiceConstruction;
    EditComponent.liveformData.serviceConstruction.heThongNuocHeThongHienHuu = {
      description: data.heThongNuocHienHuuDesc,
      images: this.supplySystemImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongNuocDiemDauNoi = {
      description: data.heThongNuocDiemDauNoiDesc,
      images: this.supplyPointImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongNuocThoatHeThongHienHuu = {
      description: data.heThongNuocThoatHienHuuDesc,
      images: this.drainageSystemImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongNuocThoatDiemDauNoi = {
      description: data.heThongNuocThoatDiemDauNoiDesc,
      images: this.drainagePointImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongDienTramHaThe = {
      description: data.tramHaTheDesc,
      images: this.powerStationImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongDienDuongDayTrungThe = {
      description: data.duongDayTrungTheDesc,
      images: this.mediumVoltageSystemImageUrls
    };
    EditComponent.liveformData.serviceConstruction.heThongDienThongTinKhac = {
      description: data.heThongDienKhacDesc,
      images: this.powerOtherImageUrls
    };
  }


  uploadSupplySystemImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.supplySystemImageUrls = [...this.supplySystemImageUrls, ...res];
        this.serviceConstructionForm.get('heThongNuocHienHuuList').patchValue(this.supplySystemImageUrls);
        this.uploadSupplySystem.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.supplySystemImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.supplySystemImageUrls.indexOf(x);
            this.supplySystemImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteSupplySystemImage(i) {
    const index = this.supplySystemImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.supplySystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocHienHuuList').patchValue(this.supplySystemImageUrls);
  }

  uploadSupplyPointImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.supplyPointImageUrls = [...this.supplyPointImageUrls, ...res];
        this.serviceConstructionForm.get('heThongNuocDiemDauNoiList').patchValue(this.supplyPointImageUrls);
        this.uploadSupplyPoint.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.supplyPointImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.supplyPointImageUrls.indexOf(x);
            this.supplyPointImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteSupplyPointImage(i) {
    const index = this.supplyPointImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.supplyPointImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocDiemDauNoiList').patchValue(this.supplyPointImageUrls);
  }


  uploadDrainageSystemImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.drainageSystemImageUrls = [...this.drainageSystemImageUrls, ...res];
        this.serviceConstructionForm.get('heThongNuocThoatHienHuuList').patchValue(this.drainageSystemImageUrls);
        this.uploadDrainageSystem.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.drainageSystemImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.drainageSystemImageUrls.indexOf(x);
            this.drainageSystemImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteDrainageSystemImage(i) {
    const index = this.drainageSystemImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.drainageSystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocThoatHienHuuList').patchValue(this.drainageSystemImageUrls);
  }

  uploadDrainagePointImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.drainagePointImageUrls = [...this.drainagePointImageUrls, ...res];
        this.serviceConstructionForm.get('heThongNuocThoatDiemDauNoiList').patchValue(this.drainagePointImageUrls);
        this.uploadDrainagePoint.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.drainagePointImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.drainagePointImageUrls.indexOf(x);
            this.drainagePointImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteDrainagePointImage(i) {
    const index = this.drainagePointImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.drainagePointImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocThoatDiemDauNoiList').patchValue(this.drainagePointImageUrls);
  }

  uploadPowerStationImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.powerStationImageUrls = [...this.powerStationImageUrls, ...res];
        this.serviceConstructionForm.get('tramHaTheList').patchValue(this.powerStationImageUrls);
        this.uploadPowerStation.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.powerStationImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.powerStationImageUrls.indexOf(x);
            this.powerStationImageUrls.splice(index, 1);
          }
        });
      });
  }
  deletePowerStationImage(i) {
    const index = this.powerStationImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.powerStationImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('tramHaTheList').patchValue(this.powerStationImageUrls);
  }

  uploadMediumVoltageSystemImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.mediumVoltageSystemImageUrls = [...this.mediumVoltageSystemImageUrls, ...res];
        this.serviceConstructionForm.get('duongDayTrungTheList').patchValue(this.mediumVoltageSystemImageUrls);
        this.uploadMediumVoltageSystem.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.mediumVoltageSystemImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.mediumVoltageSystemImageUrls.indexOf(x);
            this.mediumVoltageSystemImageUrls.splice(index, 1);
          }
        });
      });
  }
  deleteMediumVoltageSystemImage(i) {
    const index = this.mediumVoltageSystemImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.mediumVoltageSystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('duongDayTrungTheList').patchValue(this.mediumVoltageSystemImageUrls);
  }

  uploadPowerOtherImage(event) {
    const files = event.target.files;
    this.siteSurveyReportService
      .uploadImageSiteSurveyingReport(files, this.currentBidOpportunityId)
      .subscribe(res => {
        this.powerOtherImageUrls = [...this.powerOtherImageUrls, ...res];
        this.serviceConstructionForm.get('heThongDienKhacList').patchValue(this.powerOtherImageUrls);
        this.uploadPowerOther.nativeElement.value = null;
      }, err => {
        this.alertService.error('Upload hình ảnh thất bại. Xin vui lòng thử lại!');
        this.powerOtherImageUrls.forEach(x => {
          if (!x.id) {
            const index = this.powerOtherImageUrls.indexOf(x);
            this.powerOtherImageUrls.splice(index, 1);
          }
        });
      });
  }
  deletePowerOtherImage(i) {
    const index = this.powerOtherImageUrls.indexOf(i);
    if (i.guid) {
      this.siteSurveyReportService.deleteImageSiteSurveyingReport(i.guid).subscribe(res => {

      }, err => {
        this.alertService.error('Đã xảy ra lỗi, hình ảnh xóa không thành công');
      });
    }
    this.powerOtherImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongDienKhacList').patchValue(this.powerOtherImageUrls);
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
