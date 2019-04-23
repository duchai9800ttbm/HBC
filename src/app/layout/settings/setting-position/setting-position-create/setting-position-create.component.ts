import { Component, OnInit } from '@angular/core';
import { LevelListItem } from '../../../../shared/models/setting/level-list-item';

@Component({
  selector: 'app-setting-position-create',
  templateUrl: './setting-position-create.component.html',
  styleUrls: ['./setting-position-create.component.scss']
})
export class SettingPositionCreateComponent implements OnInit {
  level: LevelListItem = new LevelListItem();
  constructor() { }

  ngOnInit() {
  }

}
