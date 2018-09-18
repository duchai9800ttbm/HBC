import { Component, OnInit } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';

@Component({
  selector: 'app-demo-conso',
  templateUrl: './demo-conso.component.html',
  styleUrls: ['./demo-conso.component.scss']
})
export class DemoConsoComponent implements OnInit {
  demoConsoForm: FormGroup;

  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  demoConsoModel = new DemoConso();
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.initData();
    this.demoConsoForm = this.fb.group({
      phaVoKetCauDesc: [this.demoConsoModel.phaVoKetCau && this.demoConsoModel.phaVoKetCau.description],
      chiTietDiaHinhKhoKhanList: [null],
      giaCoKetCauDesc: [this.demoConsoModel.giaCoKetCau && this.demoConsoModel.giaCoKetCau.description],
      chiTietDiaHinhThuanLoiList: [null],
      dieuKienHinhAnhDesc: [this.demoConsoModel.dieuKien && this.demoConsoModel.dieuKien.description],
      huongVaoCongTruongList: [null]
    });
    this.demoConsoForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
  }

  initData() {
    const obj = LiveformSiteReportComponent.formModel.demoConso;
    if (obj) {
      this.demoConsoModel.phaVoKetCau = obj.phaVoKetCau && {
        description: obj.phaVoKetCau.description,
        images: obj.phaVoKetCau.images
      };
      this.demoConsoModel.giaCoKetCau = obj.giaCoKetCau && {
        description: obj.giaCoKetCau.description,
        images: obj.giaCoKetCau.images
      };
      this.demoConsoModel.dieuKien = obj.dieuKien && {
        description: obj.dieuKien.description,
        images: obj.dieuKien.images
      };
      this.demobilisationImageUrls = this.demoConsoModel.phaVoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.consolidationImageUrls = this.demoConsoModel.giaCoKetCau ? this.demoConsoModel.phaVoKetCau.images : [];
      this.adjacentImageUrls = this.demoConsoModel.dieuKien ? this.demoConsoModel.dieuKien.images : [];
    }
  }


  mappingToLiveFormData(data) {
    LiveformSiteReportComponent.formModel.demoConso = new DemoConso;
    LiveformSiteReportComponent.formModel.demoConso.phaVoKetCau = {
      description: data.phaVoKetCauDesc,
      images: this.demobilisationImageUrls
    };
    LiveformSiteReportComponent.formModel.demoConso.giaCoKetCau = {
      description: data.giaCoKetCauDesc,
      images: this.consolidationImageUrls
    };
    LiveformSiteReportComponent.formModel.demoConso.dieuKien = {
      description: data.dieuKienHinhAnhDesc,
      images: this.adjacentImageUrls
    };
  }


  uploadDemobilisationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.demobilisationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDemobilisationImage(i) {
    const index = this.demobilisationImageUrls.indexOf(i);
    this.demobilisationImageUrls.splice(index, 1);
  }

  uploadConsolidationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.consolidationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteConsolidationImage(i) {
    const index = this.consolidationImageUrls.indexOf(i);
    this.consolidationImageUrls.splice(index, 1);
  }

  uploaAdjacentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.adjacentImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteAdjacentImage(i) {
    const index = this.adjacentImageUrls.indexOf(i);
    this.adjacentImageUrls.splice(index, 1);
  }


}
