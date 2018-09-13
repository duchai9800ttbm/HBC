import { Component, OnInit } from '@angular/core';
import { Traffic } from '../../../../../../../../shared/models/site-survey-report/traffic.model';
import { EditComponent } from '../edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit {
  trafficForm: FormGroup;

  disadvantageImageUrls = [];
  advantageImageUrls = [];
  directionImageUrls = [];
  existingImageUrls = [];
  roadImageUrls = [];
  fenceImageUrls = [];
  url;
  trafficModel: Traffic;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initData();
    this.trafficForm = this.fb.group({
      chiTietDiaHinhKhoKhanDesc: [this.trafficModel.chiTietDiaHinh.khoKhan && this.trafficModel.chiTietDiaHinh.khoKhan.description],
      chiTietDiaHinhKhoKhanList: [null],
      chiTietDiaHinhThuanLoiDesc: [this.trafficModel.chiTietDiaHinh.thuanLoi && this.trafficModel.chiTietDiaHinh.thuanLoi.description],
      chiTietDiaHinhThuanLoiList: [null],
      huongVaoCongTruongDesc: [this.trafficModel.loiVaoCongTrinh.huongVao && this.trafficModel.loiVaoCongTrinh.huongVao.description],
      huongVaoCongTruongList: [null],
      duongHienCoTrenCongTruongDesc: [this.trafficModel.loiVaoCongTrinh.duongHienCo
        && this.trafficModel.loiVaoCongTrinh.duongHienCo.description],
      duongHienCoTrenCongTruongList: null,
      yeuCauDuongTamDesc: [this.trafficModel.loiVaoCongTrinh.yeuCauDuongTam
        && this.trafficModel.loiVaoCongTrinh.yeuCauDuongTam.description],
      yeuCauDuongTamList: null,
      yeuCauHangRaoDesc: [this.trafficModel.loiVaoCongTrinh.yeuCauHangRao
        && this.trafficModel.loiVaoCongTrinh.yeuCauHangRao.description],
      yeuCauHangRaoList: null
    });
    this.trafficForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));

  }

  initData() {
    const obj = EditComponent.formModel.traffic;
    if (obj) {
      this.trafficModel.chiTietDiaHinh.khoKhan = obj.chiTietDiaHinh.khoKhan && {
        description: obj.chiTietDiaHinh.khoKhan.description,
        images: obj.chiTietDiaHinh.khoKhan.images
      };
      this.trafficModel.chiTietDiaHinh.thuanLoi = obj.chiTietDiaHinh.thuanLoi && {
        description: obj.chiTietDiaHinh.thuanLoi.description,
        images: obj.chiTietDiaHinh.thuanLoi.images
      };
      this.trafficModel.loiVaoCongTrinh.huongVao = obj.loiVaoCongTrinh.huongVao && {
        description: obj.loiVaoCongTrinh.huongVao.description,
        images: obj.loiVaoCongTrinh.huongVao.images
      };
      this.trafficModel.loiVaoCongTrinh.duongHienCo = obj.loiVaoCongTrinh.duongHienCo && {
        description: obj.loiVaoCongTrinh.duongHienCo.description,
        images: obj.loiVaoCongTrinh.duongHienCo.images
      };
      this.trafficModel.loiVaoCongTrinh.yeuCauDuongTam = obj.loiVaoCongTrinh.yeuCauDuongTam && {
        description: obj.loiVaoCongTrinh.yeuCauDuongTam.description,
        images: obj.loiVaoCongTrinh.yeuCauDuongTam.images
      };
      this.trafficModel.loiVaoCongTrinh.yeuCauHangRao = obj.loiVaoCongTrinh.yeuCauHangRao && {
        description: obj.loiVaoCongTrinh.yeuCauHangRao.description,
        images: obj.loiVaoCongTrinh.yeuCauHangRao.images
      };
      this.disadvantageImageUrls = this.trafficModel.chiTietDiaHinh.khoKhan ? this.trafficModel.chiTietDiaHinh.khoKhan.images : [];
      this.advantageImageUrls = this.trafficModel.chiTietDiaHinh.thuanLoi ? this.trafficModel.chiTietDiaHinh.thuanLoi.images : [];
      this.directionImageUrls = this.trafficModel.loiVaoCongTrinh.huongVao ? this.trafficModel.loiVaoCongTrinh.huongVao.images : [];
      this.existingImageUrls = this.trafficModel.loiVaoCongTrinh.duongHienCo ? this.trafficModel.loiVaoCongTrinh.duongHienCo.images : [];
      this.roadImageUrls = this.trafficModel.loiVaoCongTrinh.yeuCauDuongTam ? this.trafficModel.loiVaoCongTrinh.yeuCauDuongTam.images : [];
      this.fenceImageUrls = this.trafficModel.loiVaoCongTrinh.yeuCauHangRao ? this.trafficModel.loiVaoCongTrinh.yeuCauHangRao.images : [];
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.formModel.traffic = new Traffic;
    EditComponent.formModel.traffic.chiTietDiaHinh = {
      khoKhan: {
        description: data.chiTietDiaHinhKhoKhanDesc,
        images: this.disadvantageImageUrls
      },
      thuanLoi: {
        description: data.chiTietDiaHinhThuanLoiDesc,
        images: this.advantageImageUrls
      }
    };
    EditComponent.formModel.traffic.loiVaoCongTrinh = {
      huongVao: {
        description: data.huongVaoCongTruongDesc,
        images: this.directionImageUrls
      },
      duongHienCo: {
        description: data.duongHienCoTrenCongTruongDesc,
        images: this.existingImageUrls
      },
      yeuCauDuongTam: {
        description: data.yeuCauDuongTamDesc,
        images: this.roadImageUrls
      },
      yeuCauHangRao: {
        description: data.yeuCauHangRaoDesc,
        images: this.fenceImageUrls
      }
    };
  }

  uploaDisadvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.disadvantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
    }
  }
  deleteDisadvantageImage(i) {
    const index = this.disadvantageImageUrls.indexOf(i);
    this.disadvantageImageUrls.splice(index, 1);
  }

  uploaAdvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.advantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
    }
  }
  deleteAdvantageImage(i) {
    const index = this.advantageImageUrls.indexOf(i);
    this.advantageImageUrls.splice(index, 1);
  }

  uploadDirectionImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.directionImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
    }
  }
  deleteDirectionImage(i) {
    const index = this.directionImageUrls.indexOf(i);
    this.directionImageUrls.splice(index, 1);
  }

  uploadExistingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.existingImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('duongHienCoTrenCongTruongList').patchValue(this.existingImageUrls);
    }
  }
  deleteExistingImage(i) {
    const index = this.existingImageUrls.indexOf(i);
    this.existingImageUrls.splice(index, 1);
  }

  uploadRoadImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.roadImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
    }
  }
  deleteRoadImage(i) {
    const index = this.roadImageUrls.indexOf(i);
    this.roadImageUrls.splice(index, 1);
  }

  uploadFenceImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fenceImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
    }
  }
  deleteFenceImage(i) {
    const index = this.fenceImageUrls.indexOf(i);
    this.fenceImageUrls.splice(index, 1);
  }
}
