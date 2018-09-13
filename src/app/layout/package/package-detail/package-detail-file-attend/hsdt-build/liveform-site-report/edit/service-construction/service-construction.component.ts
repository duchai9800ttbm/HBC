import { Component, OnInit } from '@angular/core';
import { ServiceConstruction } from '../../../../../../../../shared/models/site-survey-report/service-construction.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';

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
  serviceConstructionModel: ServiceConstruction;
  constructor(
    private fb: FormBuilder
  ) {

  }

  ngOnInit() {
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


    this.initData();

    this.serviceConstructionForm = this.fb.group({
      heThongNuocHienHuuDesc: [
        this.serviceConstructionModel.heThongNuoc.heThongHienHuu
        && this.serviceConstructionModel.heThongNuoc.heThongHienHuu.description
      ],
      heThongNuocHienHuuList: null,
      heThongNuocDiemDauNoiDesc: [
        this.serviceConstructionModel.heThongNuoc.diemDauNoi
        && this.serviceConstructionModel.heThongNuoc.diemDauNoi.description
      ],
      heThongNuocDiemDauNoiList: null,
      heThongNuocThoatHienHuuDesc: [
        this.serviceConstructionModel.heThongNuocThoat.heThongHienHuu
        && this.serviceConstructionModel.heThongNuocThoat.heThongHienHuu.description
      ],
      heThongNuocThoatHienHuuList: null,
      heThongNuocThoatDiemDauNoiDesc: [
        this.serviceConstructionModel.heThongNuocThoat.diemDauNoi
        && this.serviceConstructionModel.heThongNuocThoat.diemDauNoi.description
      ],
      heThongNuocThoatDiemDauNoiList: null,
      tramHaTheDesc: [
        this.serviceConstructionModel.heThongDien.tramHaThe
        && this.serviceConstructionModel.heThongDien.tramHaThe.description
      ],
      tramHaTheList: null,
      duongDayTrungTheDesc: [
        this.serviceConstructionModel.heThongDien.duongDayTrungThe
        && this.serviceConstructionModel.heThongDien.duongDayTrungThe.description],
      duongDayTrungTheList: null,
      heThongDienKhacDesc: [
        this.serviceConstructionModel.heThongDien
        && this.serviceConstructionModel.heThongDien.thongTinKhac.description
      ],
      heThongDienKhacList: null
    });
    this.serviceConstructionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));

  }

  initData() {
    const obj = EditComponent.formModel.serviceConstruction;
    if (obj) {
      this.serviceConstructionModel.heThongNuoc.heThongHienHuu = obj.heThongNuoc.heThongHienHuu && {
        description: obj.heThongNuoc.heThongHienHuu.description,
        images: obj.heThongNuoc.heThongHienHuu.images
      };
      this.serviceConstructionModel.heThongNuoc.diemDauNoi = obj.heThongNuoc.diemDauNoi && {
        description: obj.heThongNuoc.diemDauNoi.description,
        images: obj.heThongNuoc.diemDauNoi.images
      };
      this.serviceConstructionModel.heThongNuocThoat.heThongHienHuu = obj.heThongNuocThoat.heThongHienHuu && {
        description: obj.heThongNuocThoat.heThongHienHuu.description,
        images: obj.heThongNuocThoat.heThongHienHuu.images
      };
      this.serviceConstructionModel.heThongNuocThoat.diemDauNoi = obj.heThongNuocThoat.diemDauNoi && {
        description: obj.heThongNuocThoat.diemDauNoi.description,
        images: obj.heThongNuocThoat.diemDauNoi.images
      };
      this.serviceConstructionModel.heThongDien.tramHaThe = obj.heThongDien.tramHaThe && {
        description: obj.heThongDien.tramHaThe.description,
        images: obj.heThongDien.tramHaThe.images
      };
      this.serviceConstructionModel.heThongDien.duongDayTrungThe = obj.heThongDien.duongDayTrungThe && {
        description: obj.heThongDien.duongDayTrungThe.description,
        images: obj.heThongDien.duongDayTrungThe.images
      };
      this.serviceConstructionModel.heThongDien.thongTinKhac = obj.heThongDien.thongTinKhac && {
        description: obj.heThongDien.thongTinKhac.description,
        images: obj.heThongDien.thongTinKhac.images
      };
      this.supplySystemImageUrls = this.serviceConstructionModel.heThongNuoc.heThongHienHuu ?
        this.serviceConstructionModel.heThongNuoc.heThongHienHuu.images : [];
      this.supplyPointImageUrls = this.serviceConstructionModel.heThongNuoc.diemDauNoi ?
        this.serviceConstructionModel.heThongNuoc.diemDauNoi.images : [];
      this.drainageSystemImageUrls = this.serviceConstructionModel.heThongNuocThoat.heThongHienHuu ?
        this.serviceConstructionModel.heThongNuocThoat.heThongHienHuu.images : [];
      this.drainagePointImageUrls = this.serviceConstructionModel.heThongNuocThoat.diemDauNoi ?
        this.serviceConstructionModel.heThongNuocThoat.diemDauNoi.images : [];
      this.powerStationImageUrls = this.serviceConstructionModel.heThongDien.tramHaThe ?
        this.serviceConstructionModel.heThongDien.tramHaThe.images : [];
      this.mediumVoltageSystemImageUrls = this.serviceConstructionModel.heThongDien.duongDayTrungThe ?
        this.serviceConstructionModel.heThongDien.duongDayTrungThe.images : [];
      this.powerOtherImageUrls = this.serviceConstructionModel.heThongDien.thongTinKhac ?
        this.serviceConstructionModel.heThongDien.thongTinKhac.images : [];
    } else {

      this.serviceConstructionModel = {
        heThongNuoc: {
          heThongHienHuu: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          },
          diemDauNoi: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          }
        },
        heThongNuocThoat: {
          heThongHienHuu: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          },
          diemDauNoi: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          }
        },
        heThongDien: {
          tramHaThe: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          },
          duongDayTrungThe: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          },
          thongTinKhac: {
            description: 'Text edit',
            images: [{
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            },
            {
              id: '1',
              image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
            }
            ]
          }
        }
      };
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.formModel.serviceConstruction = new ServiceConstruction;
    EditComponent.formModel.serviceConstruction.heThongNuoc = {
      heThongHienHuu: {
        description: data.heThongNuocHienHuuDesc,
        images: this.supplySystemImageUrls
      },
      diemDauNoi: {
        description: data.heThongNuocDiemDauNoiDesc,
        images: this.supplyPointImageUrls
      }
    };
    EditComponent.formModel.serviceConstruction.heThongNuocThoat = {
      heThongHienHuu: {
        description: data.heThongNuocThoatHienHuuDesc,
        images: this.drainageSystemImageUrls
      },
      diemDauNoi: {
        description: data.heThongNuocThoatDiemDauNoiDesc,
        images: this.drainagePointImageUrls
      }
    };
    EditComponent.formModel.serviceConstruction.heThongDien = {
      tramHaThe: {
        description: data.tramHaTheDesc,
        images: this.powerStationImageUrls
      },
      duongDayTrungThe: {
        description: data.duongDayTrungTheDesc,
        images: this.mediumVoltageSystemImageUrls
      },
      thongTinKhac: {
        description: data.heThongDienKhacDesc,
        images: this.powerOtherImageUrls
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
      this.serviceConstructionForm.get('heThongNuocHienHuuList').patchValue(this.supplySystemImageUrls);
    }
  }
  deleteSupplySystemImage(i) {
    const index = this.supplySystemImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('heThongNuocDiemDauNoiList').patchValue(this.supplyPointImageUrls);
    }
  }
  deleteSupplyPointImage(i) {
    const index = this.supplyPointImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('heThongNuocThoatHienHuuList').patchValue(this.drainageSystemImageUrls);
    }
  }
  deleteDrainageSystemImage(i) {
    const index = this.drainageSystemImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('heThongNuocThoatDiemDauNoiList').patchValue(this.drainagePointImageUrls);
    }
  }
  deleteDrainagePointImage(i) {
    const index = this.drainagePointImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('tramHaTheList').patchValue(this.powerStationImageUrls);
    }
  }
  deletePowerStationImage(i) {
    const index = this.powerStationImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('duongDayTrungTheList').patchValue(this.mediumVoltageSystemImageUrls);
    }
  }
  deleteMediumVoltageSystemImage(i) {
    const index = this.mediumVoltageSystemImageUrls.indexOf(i);
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
      this.serviceConstructionForm.get('heThongDienKhacList').patchValue(this.powerOtherImageUrls);
    }
  }
  deletePowerOtherImage(i) {
    const index = this.powerOtherImageUrls.indexOf(i);
    this.powerOtherImageUrls.splice(index, 1);
  }



}
