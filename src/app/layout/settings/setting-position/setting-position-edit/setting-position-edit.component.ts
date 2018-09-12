import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-setting-position-edit',
  templateUrl: './setting-position-edit.component.html',
  styleUrls: ['./setting-position-edit.component.scss']
})
export class SettingPositionEditComponent implements OnInit {
  location$: Observable<LocationListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.location$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewLocation(params.get('id')));
  }
}
