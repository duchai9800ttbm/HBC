import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { LevelListItem } from '../../../../shared/models/setting/level-list-item';

@Component({
  selector: 'app-setting-position-edit',
  templateUrl: './setting-position-edit.component.html',
  styleUrls: ['./setting-position-edit.component.scss']
})
export class SettingPositionEditComponent implements OnInit {
  level$: Observable<LevelListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.level$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewLevel(params.get('id')));
  }
}
