import { Component, OnInit } from '@angular/core';
import { ConstructionTypeListItem } from '../../../../shared/models/setting/construction-type-list-item';
import { Observable } from '../../../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-setting-construction-edit',
  templateUrl: './setting-construction-edit.component.html',
  styleUrls: ['./setting-construction-edit.component.scss']
})
export class SettingConstructionEditComponent implements OnInit {

  construction$: Observable<ConstructionTypeListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.construction$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewConstruction(params.get('id')));
  }

}
