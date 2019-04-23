import { Component, OnInit } from '@angular/core';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';

@Component({
  selector: 'app-setting-location-create',
  templateUrl: './setting-location-create.component.html',
  styleUrls: ['./setting-location-create.component.scss']
})
export class SettingLocationCreateComponent implements OnInit {

  location: LocationListItem = new LocationListItem();
  constructor() { }

  ngOnInit() {
  }

}
