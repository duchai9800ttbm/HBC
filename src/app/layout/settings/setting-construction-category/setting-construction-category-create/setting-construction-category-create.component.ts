import { Component, OnInit } from '@angular/core';
import { ConstructionCategoryListItem } from '../../../../shared/models/setting/construction-category-list-item';

@Component({
  selector: 'app-setting-construction-category-create',
  templateUrl: './setting-construction-category-create.component.html',
  styleUrls: ['./setting-construction-category-create.component.scss']
})
export class SettingConstructionCategoryCreateComponent implements OnInit {

  constructionCategory: ConstructionCategoryListItem = new ConstructionCategoryListItem();
  constructor() { }

  ngOnInit() {
  }

}
