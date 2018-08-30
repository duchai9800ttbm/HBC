import { Component, OnInit, OnDestroy } from '@angular/core';
import { LiveformDataReportService } from '../../../../../../../shared/services/liveform-data-report.service';
import { Router } from '@angular/router';
import { ScaleOverall } from '../../../../../../../shared/models/site-survey-report/scale-overall.model';
import { url } from 'inspector';

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
  readValue(event) {
    this.siteArea = event.target.value;
    const x = this.siteArea;
    // console.log(x);
    if (x) { this.liveformDataReportService.saveData(x); console.log(x); }
  }
  // saveData(x) {
  //   this.liveformDataReportService.saveData(x);
  //   console.log(x);
  // }

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

  addDisplayImg() {
    window.onclick = e => {
      const x = (<HTMLInputElement>event.target).className;
      console.log(x);
    };
  }
}
