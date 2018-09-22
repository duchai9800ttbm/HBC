import { Component, OnInit } from '@angular/core';
import { Traffic } from '../../../../../../../../shared/models/site-survey-report/traffic.model';
import { EditComponent } from '../edit.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { Router } from '@angular/router';
import { PackageDetailComponent } from '../../../../../package-detail.component';

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
  viewMode;
  currentBidOpportunityId: number;
  trafficModel = new Traffic();
  constructor(
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

  }
  checkFlag() {
    if (LiveformSiteReportComponent.formModel.id) {
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
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.disadvantageImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDisadvantageImage(i) {
    const index = this.disadvantageImageUrls.indexOf(i);
    this.disadvantageImageUrls.splice(index, 1);
    this.trafficForm.get('chiTietDiaHinhKhoKhanList').patchValue(this.disadvantageImageUrls);
  }

  uploaAdvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.advantageImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteAdvantageImage(i) {
    const index = this.advantageImageUrls.indexOf(i);
    this.advantageImageUrls.splice(index, 1);
    this.trafficForm.get('chiTietDiaHinhThuanLoiList').patchValue(this.advantageImageUrls);
  }

  uploadDirectionImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.directionImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDirectionImage(i) {
    const index = this.directionImageUrls.indexOf(i);
    this.directionImageUrls.splice(index, 1);
    this.trafficForm.get('huongVaoCongTruongList').patchValue(this.directionImageUrls);
  }

  uploadExistingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.existingImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('duongHienCoTrenCongTruongList').patchValue(this.existingImageUrls);
        };
        reader.readAsDataURL(file);
      }
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
        reader.onload = (e: any) => {
          this.roadImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteRoadImage(i) {
    const index = this.roadImageUrls.indexOf(i);
    this.roadImageUrls.splice(index, 1);
    this.trafficForm.get('yeuCauDuongTamList').patchValue(this.roadImageUrls);
  }

  uploadFenceImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.fenceImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteFenceImage(i) {
    const index = this.fenceImageUrls.indexOf(i);
    this.fenceImageUrls.splice(index, 1);
    this.trafficForm.get('yeuCauHangRaoList').patchValue(this.fenceImageUrls);
  }
}
