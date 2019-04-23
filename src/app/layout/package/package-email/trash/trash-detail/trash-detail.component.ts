import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '../../../../../../../node_modules/@angular/router';

@Component({
  selector: 'app-trash-detail',
  templateUrl: './trash-detail.component.html',
  styleUrls: ['./trash-detail.component.scss']
})
export class TrashDetailComponent implements OnInit {

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
