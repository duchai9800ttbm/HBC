import { Component, OnInit } from '@angular/core';
import { SoilCondition } from '../../../../../../../../shared/models/site-survey-report/soil-condition.model';

@Component({
  selector: 'app-soil-condition',
  templateUrl: './soil-condition.component.html',
  styleUrls: ['./soil-condition.component.scss']
})
export class SoilConditionComponent implements OnInit {
  footingImageUrls = [];
  investigationImageUrls = [];
  url;
  soilConditionModel: SoilCondition;
  constructor() { }

  ngOnInit() {
    this.soilConditionModel = new SoilCondition;
    this.soilConditionModel = {
      nenMongHienCo: {
        description: 'TEXT',
        images: []
      },
      thongTinCongTrinhGanDo: {
        description: '',
        images: []
      }
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
    }
  }
  deleteFootingImage() {
    const index = this.footingImageUrls.indexOf(this.url);
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
    }
  }
  deleteInvestigationImage() {
    const index = this.investigationImageUrls.indexOf(this.url);
    this.investigationImageUrls.splice(index, 1);
  }
}
