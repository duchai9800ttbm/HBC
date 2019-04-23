import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-kick-off-detail',
  templateUrl: './kick-off-detail.component.html',
  styleUrls: ['./kick-off-detail.component.scss']
})
export class KickOffDetailComponent implements OnInit {


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
