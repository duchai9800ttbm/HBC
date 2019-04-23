import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-detail',
  templateUrl: './assign-detail.component.html',
  styleUrls: ['./assign-detail.component.scss']
})
export class AssignDetailComponent implements OnInit {

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
