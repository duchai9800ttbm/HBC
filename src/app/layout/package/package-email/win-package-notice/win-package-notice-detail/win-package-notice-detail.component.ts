import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-win-package-notice-detail',
  templateUrl: './win-package-notice-detail.component.html',
  styleUrls: ['./win-package-notice-detail.component.scss']
})
export class WinPackageNoticeDetailComponent implements OnInit {

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
