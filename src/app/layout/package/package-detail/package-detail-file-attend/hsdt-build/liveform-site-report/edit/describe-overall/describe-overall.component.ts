import { Component, OnInit } from '@angular/core';
import { DescribeOverall } from '../../../../../../../../shared/models/site-survey-report/describe-overall.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';

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
  describeModel: DescribeOverall;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initData();

    this.describeForm = this.fb.group({
      chiTietDiaHinhDesc: [this.describeModel.chiTietDiaHinh && this.describeModel.chiTietDiaHinh.description],
      chiTietDiaHinhList: [null],
      kienTrucHienHuuDesc: [this.describeModel.chiTietDiaHinh && this.describeModel.chiTietDiaHinh.description],
      kienTrucHienHuuList: [null],
      yeuCauChuongNgaiDesc: [this.describeModel.chiTietDiaHinh && this.describeModel.chiTietDiaHinh.description],
      yeuCauChuongNgaiList: [null],
    });
    this.describeForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initData() {
    const obj = EditComponent.formModel.describeOverall;
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
    EditComponent.formModel.describeOverall = new DescribeOverall;
    EditComponent.formModel.describeOverall.chiTietDiaHinh = {
      description: data.hinhAnhPhoiCanhDesc,
      images: this.topographyImageUrls
    };
    EditComponent.formModel.describeOverall.kienTrucHienHuu = {
      description: data.thongTinVeKetCauDesc,
      images: this.existingBuildImageUrls
    };
    EditComponent.formModel.describeOverall.yeuCauChuongNgai = {
      description: data.nhungYeuCauDacBietDesc,
      images: this.stacaleImageUrls
    };
  }

  uploadTopographyImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.topographyImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.describeForm.get('chiTietDiaHinhList').patchValue(this.topographyImageUrls);
    }
  }
  deleteTopographyImage(i) {
    const index = this.topographyImageUrls.indexOf(i);
    this.topographyImageUrls.splice(index, 1);
  }

  uploadExistingBuildImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.existingBuildImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.describeForm.get('kienTrucHienHuuList').patchValue(this.existingBuildImageUrls);
    }
  }
  deleteExistingBuildImage(i) {
    const index = this.existingBuildImageUrls.indexOf(i);
    this.existingBuildImageUrls.splice(index, 1);
  }

  uploadStacaleImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.stacaleImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.describeForm.get('yeuCauChuongNgaiList').patchValue(this.stacaleImageUrls);
    }
  }
  deleteStacaleImage(i) {
    const index = this.stacaleImageUrls.indexOf(i);
    this.stacaleImageUrls.splice(index, 1);
  }


}
