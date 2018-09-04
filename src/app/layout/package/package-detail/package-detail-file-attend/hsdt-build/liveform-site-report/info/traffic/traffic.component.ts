import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-traffic',
  templateUrl: './traffic.component.html',
  styleUrls: ['./traffic.component.scss']
})
export class TrafficComponent implements OnInit {
  disadvantageImageUrls = [];
  advantageImageUrls = [];
  directionImageUrls = [];
  existingImageUrls = [];
  roadImageUrls = [];
  fenceImageUrls = [];
  url;
  constructor() { }

  ngOnInit() {
  }

  uploaDisadvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.disadvantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg0() {
    const index = this.disadvantageImageUrls.indexOf(this.url);
    this.disadvantageImageUrls.splice(index, 1);
  }

  uploaAdvantageImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.advantageImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg1() {
    const index = this.advantageImageUrls.indexOf(this.url);
    this.advantageImageUrls.splice(index, 1);
  }

  uploadDirectionImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.directionImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg2() {
    const index = this.directionImageUrls.indexOf(this.url);
    this.directionImageUrls.splice(index, 1);
  }

  uploadExistingImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.existingImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg3() {
    const index = this.existingImageUrls.indexOf(this.url);
    this.existingImageUrls.splice(index, 1);
  }

  uploadRoadImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.roadImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg4() {
    const index = this.roadImageUrls.indexOf(this.url);
    this.roadImageUrls.splice(index, 1);
  }

  uploadFenceImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.fenceImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg5() {
    const index = this.fenceImageUrls.indexOf(this.url);
    this.fenceImageUrls.splice(index, 1);
  }

}
