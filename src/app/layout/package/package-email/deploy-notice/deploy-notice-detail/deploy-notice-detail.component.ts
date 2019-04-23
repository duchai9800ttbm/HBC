import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-deploy-notice-detail',
  templateUrl: './deploy-notice-detail.component.html',
  styleUrls: ['./deploy-notice-detail.component.scss']
})
export class DeployNoticeDetailComponent implements OnInit {

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
