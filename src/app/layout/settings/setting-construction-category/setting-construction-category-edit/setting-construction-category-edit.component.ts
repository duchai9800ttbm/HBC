import { Component, OnInit } from '@angular/core';
import { ConstructionCategoryListItem } from '../../../../shared/models/setting/construction-category-list-item';
import { Observable } from '../../../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-setting-construction-category-edit',
  templateUrl: './setting-construction-category-edit.component.html',
  styleUrls: ['./setting-construction-category-edit.component.scss']
})
export class SettingConstructionCategoryEditComponent implements OnInit {

  constructionCategory$: Observable<ConstructionCategoryListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.constructionCategory$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewConstructionCategory(params.get('id')));
  }

}
