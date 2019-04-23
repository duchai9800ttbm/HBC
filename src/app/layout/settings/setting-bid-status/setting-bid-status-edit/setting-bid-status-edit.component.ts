import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../node_modules/rxjs';
import { BidStatusListItem } from '../../../../shared/models/setting/bid-status-list-item';
import { ActivatedRoute, ParamMap } from '../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';

@Component({
  selector: 'app-setting-bid-status-edit',
  templateUrl: './setting-bid-status-edit.component.html',
  styleUrls: ['./setting-bid-status-edit.component.scss']
})
export class SettingBidStatusEditComponent implements OnInit {

  bidStatus$: Observable<BidStatusListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.bidStatus$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewBidStatus(params.get('id')));
  }

}
