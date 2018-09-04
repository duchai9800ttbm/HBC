import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-describe-overall',
  templateUrl: './describe-overall.component.html',
  styleUrls: ['./describe-overall.component.scss']
})
export class DescribeOverallComponent implements OnInit {
  topographyImageUrls = [];
  existingBuildImageUrls = [];
  stacaleImageUrls = [];
  url;
  constructor() { }

  ngOnInit() {
  }
  uploadTopographyImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.topographyImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg0() {
    const index = this.topographyImageUrls.indexOf(this.url);
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
    }
  }
  deleteImg1() {
    const index = this.existingBuildImageUrls.indexOf(this.url);
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
    }
  }
  deleteImg2() {
    const index = this.stacaleImageUrls.indexOf(this.url);
    this.stacaleImageUrls.splice(index, 1);
  }


}
