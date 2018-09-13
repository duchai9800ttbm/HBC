import { Component, OnInit } from '@angular/core';
import { SoilCondition } from '../../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';

@Component({
  selector: 'app-soil-condition',
  templateUrl: './soil-condition.component.html',
  styleUrls: ['./soil-condition.component.scss']
})
export class SoilConditionComponent implements OnInit {
  soilConditionForm: FormGroup;

  footingImageUrls = [];
  investigationImageUrls = [];
  url;
  soilConditionModel: SoilCondition;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initData();
    this.soilConditionForm = this.fb.group({
      nenMongHienCoDesc: [this.soilConditionModel.nenMongHienCo && this.soilConditionModel.nenMongHienCo.description],
      nenMongHienCoList: null,
      thongTinCongTrinhGanDoDesc: [this.soilConditionModel.thongTinCongTrinhGanDo
        && this.soilConditionModel.thongTinCongTrinhGanDo.description],
      thongTinCongTrinhGanDoList: null
    });
    this.soilConditionForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initData() {
    const obj = EditComponent.formModel.soilCondition;
    if (obj) {
      this.soilConditionModel.nenMongHienCo = obj.nenMongHienCo && {
        description: obj.nenMongHienCo.description,
        images: obj.nenMongHienCo.images
      };
      this.soilConditionModel.thongTinCongTrinhGanDo = obj.thongTinCongTrinhGanDo && {
        description: obj.thongTinCongTrinhGanDo.description,
        images: obj.thongTinCongTrinhGanDo.images
      };
      this.footingImageUrls = this.soilConditionModel.nenMongHienCo ? this.soilConditionModel.nenMongHienCo.images : [];
      this.investigationImageUrls = this.soilConditionModel.thongTinCongTrinhGanDo ?
        this.soilConditionModel.thongTinCongTrinhGanDo.images : [];
    }
  }

  mappingToLiveFormData(data) {
    EditComponent.formModel.soilCondition = new SoilCondition;
    EditComponent.formModel.soilCondition.nenMongHienCo = {
      description: data.nenMongHienCoDesc,
      images: this.footingImageUrls
    };
    EditComponent.formModel.soilCondition.thongTinCongTrinhGanDo = {
      description: data.thongTinCongTrinhGanDoDesc,
      images: this.investigationImageUrls
    };
  }

  uploadFootingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.footingImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.soilConditionForm.get('nenMongHienCoList').patchValue(this.footingImageUrls);
    }
  }
  deleteFootingImage(i) {
    const index = this.footingImageUrls.indexOf(i);
    this.footingImageUrls.splice(index, 1);
  }

  uploadInvestigationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.investigationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
      this.soilConditionForm.get('thongTinCongTrinhGanDoList').patchValue(this.investigationImageUrls);
    }
  }
  deleteInvestigationImage(i) {
    const index = this.investigationImageUrls.indexOf(i);
    this.investigationImageUrls.splice(index, 1);
  }
}
