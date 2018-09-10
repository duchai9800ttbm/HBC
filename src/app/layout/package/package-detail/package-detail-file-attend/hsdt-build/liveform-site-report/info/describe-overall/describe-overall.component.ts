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
}
