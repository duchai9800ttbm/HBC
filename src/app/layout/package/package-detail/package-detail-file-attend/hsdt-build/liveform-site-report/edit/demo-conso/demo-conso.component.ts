import { Component, OnInit } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EditComponent } from '../edit.component';

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
  demoConsoModel: DemoConso;
  constructor(
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.demoConsoModel = {
      phaVoKetCau: {
        description: 'KHÔNG CÓ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
      giaCoKetCau: {
        description: 'KHÔNG CÓ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
      dieuKien: {
        description: 'KHÔNG CÓ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
    };


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
    const obj = EditComponent.formModel.demoConso;
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
    } else {

      this.demoConsoModel = {
        phaVoKetCau: {
          description: 'Text edit',
          images: [{
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          },
          {
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
          ]
        },
        giaCoKetCau: {
          description: 'Text edit',
          images: [{
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          },
          {
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
          ]
        },
        dieuKien: {
          description: 'Text edit',
          images: [{
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          },
          {
            id: '1',
            image: 'https://images.pexels.com/photos/268364/pexels-photo-268364.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
          }
          ]
        }
      };
    }
  }


  mappingToLiveFormData(data) {
    EditComponent.formModel.demoConso = new DemoConso;
    EditComponent.formModel.demoConso.phaVoKetCau = {
      description: data.phaVoKetCauDesc,
      images: this.demobilisationImageUrls
    };
    EditComponent.formModel.demoConso.giaCoKetCau = {
      description: data.giaCoKetCauDesc,
      images: this.consolidationImageUrls
    };
    EditComponent.formModel.demoConso.dieuKien = {
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
