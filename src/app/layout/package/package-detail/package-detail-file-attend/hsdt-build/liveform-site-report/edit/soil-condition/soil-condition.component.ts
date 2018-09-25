import { Component, OnInit } from '@angular/core';
import { SoilCondition } from '../../../../../../../../shared/models/site-survey-report/soil-condition.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';

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
  viewMode;
  currentBidOpportunityId: number;
  soilConditionModel = new SoilCondition();
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
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
    const obj = LiveformSiteReportComponent.formModel.soilCondition;
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
    LiveformSiteReportComponent.formModel.soilCondition = new SoilCondition;
    LiveformSiteReportComponent.formModel.soilCondition.nenMongHienCo = {
      description: data.nenMongHienCoDesc,
      images: this.footingImageUrls
    };
    LiveformSiteReportComponent.formModel.soilCondition.thongTinCongTrinhGanDo = {
      description: data.thongTinCongTrinhGanDoDesc,
      images: this.investigationImageUrls
    };
  }

  uploadFootingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.footingImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.soilConditionForm.get('nenMongHienCoList').patchValue(this.footingImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteFootingImage(i) {
    const index = this.footingImageUrls.indexOf(i);
    this.footingImageUrls.splice(index, 1);
    this.soilConditionForm.get('nenMongHienCoList').patchValue(this.footingImageUrls);
  }

  uploadInvestigationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.investigationImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.soilConditionForm.get('thongTinCongTrinhGanDoList').patchValue(this.investigationImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteInvestigationImage(i) {
    const index = this.investigationImageUrls.indexOf(i);
    this.investigationImageUrls.splice(index, 1);
    this.soilConditionForm.get('thongTinCongTrinhGanDoList').patchValue(this.investigationImageUrls);
  }
}
