import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-construction',
  templateUrl: './service-construction.component.html',
  styleUrls: ['./service-construction.component.scss']
})
export class ServiceConstructionComponent implements OnInit {
  supplySystemImageUrls = [];
  supplyPointImageUrls = [];
  drainageSystemImageUrls = [];
  drainagePointImageUrls = [];
  powerStationImageUrls = [];
  mediumVoltageSystemImageUrls = [];
  powerOtherImageUrls = [];
  url;

  constructor() { }

  ngOnInit() {
  }
}
