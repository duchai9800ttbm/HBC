import { Component, OnInit } from '@angular/core';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';

@Component({
  selector: 'app-setting-position-create',
  templateUrl: './setting-position-create.component.html',
  styleUrls: ['./setting-position-create.component.scss']
})
export class SettingPositionCreateComponent implements OnInit {
  location: LocationListItem = new LocationListItem();
  constructor() { }

  ngOnInit() {
  }

}
