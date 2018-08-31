import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveformDataReportService } from '../../../../../../../shared/services/liveform-data-report.service';
import { Router } from '@angular/router';
import { ScaleOverall } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';

@Component({
  selector: 'app-scale-overall',
  templateUrl: './scale-overall.component.html',
  styleUrls: ['./scale-overall.component.scss']
})
export class ScaleOverallComponent implements OnInit, OnDestroy {
  siteArea;
  totalBuildArea;
  floorNumbers;
  progress;

  perspectiveImageUrls = [];
  structureImageUrls = [];
  requirementsImageUrls = [];
  url;
  scaleModel: ScaleOverall;

  constructor(
    private liveformDataReportService: LiveformDataReportService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  ngOnDestroy() {
    // this.liveformDataReportService.saveData(this.scaleModel);
  }

  uploadPerspectiveImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.perspectiveImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg0() {
    const index = this.perspectiveImageUrls.indexOf(this.url);
    this.perspectiveImageUrls.splice(index, 1);
  }

  uploadStructureImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.structureImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg1() {
    const index = this.structureImageUrls.indexOf(this.url);
    this.structureImageUrls.splice(index, 1);
  }

  uploadRequirementsImage(event) {
    const files = event.target.files;
    if (files) {
      for (const file of files) {
        const reader = new FileReader();
        reader.onload = (e: any) => this.requirementsImageUrls.push(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  }
  deleteImg2() {
    const index = this.requirementsImageUrls.indexOf(this.url);
    this.requirementsImageUrls.splice(index, 1);
  }

  addDisplayImg() {
    window.onclick = e => {
      const x = (<HTMLInputElement>event.target).className;
      console.log(x);
    };
  }

  readValue(event) {
    this.siteArea = event.target.value;
    const x = this.siteArea;
    if (x) { this.liveformDataReportService.saveData(x); }
  }
}
