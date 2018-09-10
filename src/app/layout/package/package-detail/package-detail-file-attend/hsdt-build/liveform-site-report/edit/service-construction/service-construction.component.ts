import { Component, OnInit } from '@angular/core';
import { ServiceConstruction } from '../../../../../../../../shared/models/site-survey-report/service-construction.model';

@Component({
  selector: 'app-service-construction',
  templateUrl: './service-construction.component.html',
  styleUrls: ['./service-construction.component.scss']
})
export class ServiceConstructionComponent implements OnInit {
  supplySystemImageUrls = [];
  supplyPointImageUrls = [];
  drainageSystemImageUrls = [];
  drainagePointImageUrls = [];
  powerStationImageUrls = [];
  mediumVoltageSystemImageUrls = [];
  powerOtherImageUrls = [];
  url;
  serviceConstructionModel: ServiceConstruction;
  constructor() {

  }

  ngOnInit() {
    this.serviceConstructionModel = new ServiceConstruction();
    this.serviceConstructionModel = {
      heThongNuoc: {
        heThongHienHuu: {
          description: 'TỪ GIAI ĐOẠN 1A',
          images: []
        },
        diemDauNoi: {
          description: 'TỪ GIAI ĐOẠN 1A',
          images: []
        }
      },
      heThongNuocThoat: {
        heThongHienHuu: {
          description: 'THOÁT NƯỚC TỰ NHIÊN THEO KÊNH SẴN CÓ RA RẠCH',
          images: []
        },
        diemDauNoi: {
          description: 'Không có',
          images: []
        }
      },
      heThongDien: {
        tramHaThe: {
          description: 'Có sẵn trạm',
          images: []
        },
        duongDayTrungThe: {
          description: 'Cách 50m',
          images: []
        },
        thongTinKhac: {
          description: 'Không có',
          images: []
        }
      }
    };
  }
  uploadSupplySystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.supplySystemImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteSupplySystemImage() {
    const index = this.supplySystemImageUrls.indexOf(this.url);
    this.supplySystemImageUrls.splice(index, 1);
  }

  uploadSupplyPointImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.supplyPointImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteSupplyPointImage() {
    const index = this.supplyPointImageUrls.indexOf(this.url);
    this.supplyPointImageUrls.splice(index, 1);
  }


  uploadDrainageSystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.drainageSystemImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDrainageSystemImage() {
    const index = this.drainageSystemImageUrls.indexOf(this.url);
    this.drainageSystemImageUrls.splice(index, 1);
  }

  uploadDrainagePointImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.drainagePointImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDrainagePointImage() {
    const index = this.drainagePointImageUrls.indexOf(this.url);
    this.drainagePointImageUrls.splice(index, 1);
  }

  uploadPowerStationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.powerStationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deletePowerStationImage() {
    const index = this.powerStationImageUrls.indexOf(this.url);
    this.powerStationImageUrls.splice(index, 1);
  }

  uploadMediumVoltageSystemImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.mediumVoltageSystemImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteMediumVoltageSystemImage() {
    const index = this.mediumVoltageSystemImageUrls.indexOf(this.url);
    this.mediumVoltageSystemImageUrls.splice(index, 1);
  }

  uploadPowerOtherImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.powerOtherImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deletePowerOtherImage() {
    const index = this.powerOtherImageUrls.indexOf(this.url);
    this.powerOtherImageUrls.splice(index, 1);
  }



}
