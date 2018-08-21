import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-give-up-detail',
  templateUrl: './give-up-detail.component.html',
  styleUrls: ['./give-up-detail.component.scss']
})
export class GiveUpDetailComponent implements OnInit {

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
