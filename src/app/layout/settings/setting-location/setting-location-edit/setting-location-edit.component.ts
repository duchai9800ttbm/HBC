import { Component, OnInit } from '@angular/core';
import { LocationListItem } from '../../../../shared/models/setting/location-list-item';
import { Observable } from '../../../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-setting-location-edit',
  templateUrl: './setting-location-edit.component.html',
  styleUrls: ['./setting-location-edit.component.scss']
})
export class SettingLocationEditComponent implements OnInit {

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
