import { Component, OnInit } from '@angular/core';
import { ServiceConstruction } from '../../../../../../../../shared/models/site-survey-report/service-construction.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';

@Component({
  selector: 'app-service-construction',
  templateUrl: './service-construction.component.html',
  styleUrls: ['./service-construction.component.scss']
})
export class ServiceConstructionComponent implements OnInit {
  serviceConstructionForm: FormGroup;
  supplySystemImageUrls = [];
  supplyPointImageUrls = [];
  drainageSystemImageUrls = [];
  drainagePointImageUrls = [];
  powerStationImageUrls = [];
  mediumVoltageSystemImageUrls = [];
  powerOtherImageUrls = [];
  url;
  viewMode;
  currentBidOpportunityId: number;
  serviceConstructionModel = new ServiceConstruction();
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
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
    this.serviceConstructionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));

  }
  checkFlag() {
    if (LiveformSiteReportComponent.formModel.id) {
      const flag = LiveformSiteReportComponent.formModel.viewFlag;
      this.viewMode = flag;
    } else {
      this.router.navigate([`/package/detail/${this.currentBidOpportunityId}/attend/build/liveformsite`]);
    }
  }
  initData() {
    const obj = LiveformSiteReportComponent.formModel.serviceConstruction;
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
    LiveformSiteReportComponent.formModel.serviceConstruction = new ServiceConstruction;
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongNuocHeThongHienHuu = {
      description: data.heThongNuocHienHuuDesc,
      images: this.supplySystemImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongNuocDiemDauNoi = {
      description: data.heThongNuocDiemDauNoi,
      images: this.supplyPointImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongNuocThoatHeThongHienHuu = {
      description: data.heThongNuocThoatHienHuuDesc,
      images: this.drainageSystemImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongNuocThoatDiemDauNoi = {
      description: data.heThongNuocThoatDiemDauNoiDesc,
      images: this.drainagePointImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongDienTramHaThe = {
      description: data.tramHaTheDesc,
      images: this.powerStationImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongDienDuongDayTrungThe = {
      description: data.duongDayTrungTheDesc,
      images: this.mediumVoltageSystemImageUrls
    };
    LiveformSiteReportComponent.formModel.serviceConstruction.heThongDienThongTinKhac = {
      description: data.heThongDienKhacDesc,
      images: this.powerOtherImageUrls
    };
  }


  uploadSupplySystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.supplySystemImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('heThongNuocHienHuuList').patchValue(this.supplySystemImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteSupplySystemImage(i) {
    const index = this.supplySystemImageUrls.indexOf(i);
    this.supplySystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocHienHuuList').patchValue(this.supplySystemImageUrls);
  }

  uploadSupplyPointImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.supplyPointImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('heThongNuocDiemDauNoiList').patchValue(this.supplyPointImageUrls);
        };
        reader.readAsDataURL(file);
      }

    }
  }
  deleteSupplyPointImage(i) {
    const index = this.supplyPointImageUrls.indexOf(i);
    this.supplyPointImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocDiemDauNoiList').patchValue(this.supplyPointImageUrls);
  }


  uploadDrainageSystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.drainageSystemImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('heThongNuocThoatHienHuuList').patchValue(this.drainageSystemImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDrainageSystemImage(i) {
    const index = this.drainageSystemImageUrls.indexOf(i);
    this.drainageSystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocThoatHienHuuList').patchValue(this.drainageSystemImageUrls);
  }

  uploadDrainagePointImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.drainagePointImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('heThongNuocThoatDiemDauNoiList').patchValue(this.drainagePointImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDrainagePointImage(i) {
    const index = this.drainagePointImageUrls.indexOf(i);
    this.drainagePointImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongNuocThoatDiemDauNoiList').patchValue(this.drainagePointImageUrls);
  }

  uploadPowerStationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.powerStationImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('tramHaTheList').patchValue(this.powerStationImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deletePowerStationImage(i) {
    const index = this.powerStationImageUrls.indexOf(i);
    this.powerStationImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('tramHaTheList').patchValue(this.powerStationImageUrls);
  }

  uploadMediumVoltageSystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.mediumVoltageSystemImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('duongDayTrungTheList').patchValue(this.mediumVoltageSystemImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteMediumVoltageSystemImage(i) {
    const index = this.mediumVoltageSystemImageUrls.indexOf(i);
    this.mediumVoltageSystemImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('duongDayTrungTheList').patchValue(this.mediumVoltageSystemImageUrls);
  }

  uploadPowerOtherImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.powerOtherImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.serviceConstructionForm.get('heThongDienKhacList').patchValue(this.powerOtherImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deletePowerOtherImage(i) {
    const index = this.powerOtherImageUrls.indexOf(i);
    this.powerOtherImageUrls.splice(index, 1);
    this.serviceConstructionForm.get('heThongDienKhacList').patchValue(this.powerOtherImageUrls);
  }
}
