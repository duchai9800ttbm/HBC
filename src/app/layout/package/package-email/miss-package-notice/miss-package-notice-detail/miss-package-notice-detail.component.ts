import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-miss-package-notice-detail',
  templateUrl: './miss-package-notice-detail.component.html',
  styleUrls: ['./miss-package-notice-detail.component.scss']
})
export class MissPackageNoticeDetailComponent implements OnInit {

  constructor(
    private activetedRoute: ActivatedRoute,
  ) { }
  page;
  itemId;
  ngOnInit() {
    this.activetedRoute.queryParams.subscribe(result => {
      this.page = result.page;
      this.itemId = result.itemId;
    });
  }


}
