import { Component, OnInit } from '@angular/core';
import { DemoConso } from '../../../../../../../../shared/models/site-survey-report/demo-conso.model';

@Component({
  selector: 'app-demo-conso',
  templateUrl: './demo-conso.component.html',
  styleUrls: ['./demo-conso.component.scss']
})
export class DemoConsoComponent implements OnInit {
  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  demoConsoModel: DemoConso;
  constructor() { }

  ngOnInit() {
    this.demoConsoModel = new DemoConso();
    this.demoConsoModel = {
      phaVoKetCau: {
        description: 'Demo mô tả phá vỡ kết cấu ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
      giaCoKetCau: {
        description: 'Demo mô tả phá vỡ kết cấu ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
      dieuKien: {
        description: 'Demo mô tả phá vỡ kết cấu ',
        images: [
          {
            id: '12345',
            image: ''
          }
        ]
      },
    };
  }
  uploaDemobilisationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.demobilisationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteDemobilisationImage() {
    const index = this.demobilisationImageUrls.indexOf(this.url);
    this.demobilisationImageUrls.splice(index, 1);
  }

  uploaConsolidationImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.consolidationImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteConsolidationImage() {
    const index = this.consolidationImageUrls.indexOf(this.url);
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
  deleteAdjacentImage() {
    const index = this.adjacentImageUrls.indexOf(this.url);
    this.adjacentImageUrls.splice(index, 1);
  }


}
