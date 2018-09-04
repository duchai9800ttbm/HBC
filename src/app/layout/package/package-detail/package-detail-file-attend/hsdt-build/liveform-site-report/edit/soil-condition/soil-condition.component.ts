import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-soil-condition',
  templateUrl: './soil-condition.component.html',
  styleUrls: ['./soil-condition.component.scss']
})
export class SoilConditionComponent implements OnInit {
  footingImageUrls = [];
  investigationImageUrls = [];
  url;

  constructor() { }

  ngOnInit() {
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
  deleteImg0() {
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
  deleteImg1() {
    const index = this.investigationImageUrls.indexOf(this.url);
    this.investigationImageUrls.splice(index, 1);
  }
}
