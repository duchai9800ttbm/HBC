import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { ActivatedRoute, ParamMap } from '../../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../../shared/services/setting.service';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';

@Component({
  selector: 'app-setting-reason-win-edit',
  templateUrl: './setting-reason-win-edit.component.html',
  styleUrls: ['./setting-reason-win-edit.component.scss']
})
export class SettingReasonWinEditComponent implements OnInit {

  reasonWin$: Observable<OpportunityReasonListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.reasonWin$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewOpportunityReason(params.get('id'), SETTING_REASON.Win));
  }

}
