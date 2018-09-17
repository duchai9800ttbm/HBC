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
  trafficModel = new Traffic();
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
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

  }

  initData() {
    const obj = EditComponent.formModel.traffic;
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
    EditComponent.formModel.traffic = new Traffic;
    EditComponent.formModel.traffic.chiTietDiaHinhKhoKhan = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.disadvantageImageUrls
    };
    EditComponent.formModel.traffic.chiTietDiaHinhThuanLoi = {
      description: data.chiTietDiaHinhKhoKhanDesc,
      images: this.advantageImageUrls
    };
    EditComponent.formModel.traffic.loiVaoCongTrinhHuongVao = {
      description: data.huongVaoCongTruongDesc,
      images: this.directionImageUrls
    };
    EditComponent.formModel.traffic.loiVaoCongTrinhDuongHienCo = {
      description: data.duongHienCoTrenCongTruongDesc,
      images: this.existingImageUrls
    };
    EditComponent.formModel.traffic.loiVaoCongTrinhYeuCauDuongTam = {
      description: data.yeuCauDuongTamDesc,
      images: this.roadImageUrls
    };
    EditComponent.formModel.traffic.loiVaoCongTrinhYeuCauHangRao = {
      description: data.yeuCauHangRaoDesc,
      images: this.fenceImageUrls
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
