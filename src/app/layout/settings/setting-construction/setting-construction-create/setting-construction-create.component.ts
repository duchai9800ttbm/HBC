import { Component, OnInit } from '@angular/core';
import { ConstructionTypeListItem } from '../../../../shared/models/setting/construction-type-list-item';

@Component({
  selector: 'app-setting-construction-create',
  templateUrl: './setting-construction-create.component.html',
  styleUrls: ['./setting-construction-create.component.scss']
})
export class SettingConstructionCreateComponent implements OnInit {

  construction: ConstructionTypeListItem = new ConstructionTypeListItem();
  constructor() { }

  ngOnInit() {
  }

}
