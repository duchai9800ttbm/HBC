import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-conso',
  templateUrl: './demo-conso.component.html',
  styleUrls: ['./demo-conso.component.scss']
})
export class DemoConsoComponent implements OnInit {
  demobilisationImageUrls = [];
  consolidationImageUrls = [];
  adjacentImageUrls = [];
  url;
  constructor() { }

  ngOnInit() {
  }
}
