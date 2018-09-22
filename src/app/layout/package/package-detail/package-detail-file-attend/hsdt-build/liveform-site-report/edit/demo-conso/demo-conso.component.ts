import { Component, OnInit } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';
import { LiveformSiteReportComponent } from '../../liveform-site-report.component';
import { PackageDetailComponent } from '../../../../../package-detail.component';
import { Router } from '@angular/router';

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
  viewMode;
  currentBidOpportunityId: number;
  demoConsoModel = new DemoConso();
  constructor(
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.currentBidOpportunityId = +PackageDetailComponent.packageId;
    this.checkFlag();
    this.initData();
    this.demoConsoForm = this.fb.group({
      phaVoKetCauDesc: [this.demoConsoModel.phaVoKetCau && this.demoConsoModel.phaVoKetCau.description],
      phaVoKetCauList: [null],
      giaCoKetCauDesc: [this.demoConsoModel.giaCoKetCau && this.demoConsoModel.giaCoKetCau.description],
      giaCoKetCauList: [null],
      dieuKienHinhAnhDesc: [this.demoConsoModel.dieuKien && this.demoConsoModel.dieuKien.description],
      dieuKienHinhAnhList: [null]
    });
    this.demoConsoForm.valueChanges.subscribe(data => this.mappingToLiveFormData(data));
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
        reader.onload = (e: any) => {
          this.demobilisationImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDemobilisationImage(i) {
    const index = this.demobilisationImageUrls.indexOf(i);
    this.demobilisationImageUrls.splice(index, 1);
    this.demoConsoForm.get('phaVoKetCauList').patchValue(this.demobilisationImageUrls);
  }

  uploadConsolidationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.consolidationImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteConsolidationImage(i) {
    const index = this.consolidationImageUrls.indexOf(i);
    this.consolidationImageUrls.splice(index, 1);
    this.demoConsoForm.get('giaCoKetCauList').patchValue(this.consolidationImageUrls);
  }

  uploaAdjacentImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.adjacentImageUrls.push({
            id: null,
            image: {
              file: file,
              base64: e.target.result
            }
          });
          this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
        };
        reader.readAsDataURL(file);
      }
    }
  }
  deleteAdjacentImage(i) {
    const index = this.adjacentImageUrls.indexOf(i);
    this.adjacentImageUrls.splice(index, 1);
    this.demoConsoForm.get('dieuKienHinhAnhList').patchValue(this.adjacentImageUrls);
  }
}
