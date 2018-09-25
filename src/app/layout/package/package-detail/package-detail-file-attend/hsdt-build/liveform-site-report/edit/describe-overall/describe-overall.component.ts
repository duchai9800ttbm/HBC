import { Component, OnInit } from '@angular/core';
import { DescribeOverall } from '../../../../../../../../shared/models/site-survey-report/describe-overall.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-describe-overall',
  templateUrl: './describe-overall.component.html',
  styleUrls: ['./describe-overall.component.scss']
})
export class DescribeOverallComponent implements OnInit {
  describeForm: FormGroup;

  topographyImageUrls = [];
  existingBuildImageUrls = [];
  stacaleImageUrls = [];
  url;
  viewMode;
  currentBidOpportunityId: number;
  describeModel = new DescribeOverall();
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
    this.describeForm = this.fb.group({
      chiTietDiaHinhDesc: [this.describeModel.chiTietDiaHinh && this.describeModel.chiTietDiaHinh.description],
      chiTietDiaHinhList: [null],
      kienTrucHienHuuDesc: [this.describeModel.kienTrucHienHuu && this.describeModel.kienTrucHienHuu.description],
      kienTrucHienHuuList: [null],
      yeuCauChuongNgaiDesc: [this.describeModel.yeuCauChuongNgai && this.describeModel.yeuCauChuongNgai.description],
      yeuCauChuongNgaiList: [null],
    });
    this.describeForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
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
    const obj = LiveformSiteReportComponent.formModel.describeOverall;
    if (obj) {
      this.describeModel.chiTietDiaHinh = obj.chiTietDiaHinh && {
        description: obj.chiTietDiaHinh.description,
        images: obj.chiTietDiaHinh.images
      };
      this.describeModel.kienTrucHienHuu = obj.kienTrucHienHuu && {
        description: obj.kienTrucHienHuu.description,
        images: obj.kienTrucHienHuu.images
      };
      this.describeModel.yeuCauChuongNgai = obj.yeuCauChuongNgai && {
        description: obj.yeuCauChuongNgai.description,
        images: obj.yeuCauChuongNgai.images
      };
      this.topographyImageUrls = this.describeModel.chiTietDiaHinh ? this.describeModel.chiTietDiaHinh.images : [];
      this.existingBuildImageUrls = this.describeModel.kienTrucHienHuu ? this.describeModel.kienTrucHienHuu.images : [];
      this.stacaleImageUrls = this.describeModel.yeuCauChuongNgai ? this.describeModel.yeuCauChuongNgai.images : [];
    }
  }

  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.describeOverall = new DescribeOverall;
    LiveformSiteReportComponent.formModel.describeOverall.chiTietDiaHinh = {
      description: data.chiTietDiaHinhDesc,
      images: this.topographyImageUrls
    };
    LiveformSiteReportComponent.formModel.describeOverall.kienTrucHienHuu = {
      description: data.kienTrucHienHuuDesc,
      images: this.existingBuildImageUrls
    };
    LiveformSiteReportComponent.formModel.describeOverall.yeuCauChuongNgai = {
      description: data.yeuCauChuongNgaiDesc,
      images: this.stacaleImageUrls
    };
  }

  uploadTopographyImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.topographyImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.describeForm.get('chiTietDiaHinhList').patchValue(this.topographyImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteTopographyImage(i) {
    const index = this.topographyImageUrls.indexOf(i);
    this.topographyImageUrls.splice(index, 1);
    this.describeForm.get('chiTietDiaHinhList').patchValue(this.topographyImageUrls);
  }

  uploadExistingBuildImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.existingBuildImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.describeForm.get('kienTrucHienHuuList').patchValue(this.existingBuildImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteExistingBuildImage(i) {
    const index = this.existingBuildImageUrls.indexOf(i);
    this.existingBuildImageUrls.splice(index, 1);
    this.describeForm.get('kienTrucHienHuuList').patchValue(this.existingBuildImageUrls);
  }

  uploadStacaleImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.stacaleImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.describeForm.get('yeuCauChuongNgaiList').patchValue(this.stacaleImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteStacaleImage(i) {
    const index = this.stacaleImageUrls.indexOf(i);
    this.stacaleImageUrls.splice(index, 1);
    this.describeForm.get('yeuCauChuongNgaiList').patchValue(this.stacaleImageUrls);
  }
}
