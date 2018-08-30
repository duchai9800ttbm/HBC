import { Component, OnInit } from '@angular/core';

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
  constructor() { }

  ngOnInit() {
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
  deleteImg0() {
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
  deleteImg1() {
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
  deleteImg2() {
    const index = this.adjacentImageUrls.indexOf(this.url);
    this.adjacentImageUrls.splice(index, 1);
  }

}
