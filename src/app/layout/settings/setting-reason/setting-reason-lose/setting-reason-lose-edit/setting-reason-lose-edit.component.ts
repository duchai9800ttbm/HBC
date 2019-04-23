import { Component, OnInit } from '@angular/core';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { ActivatedRoute, ParamMap } from '../../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../../shared/services/setting.service';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';

@Component({
  selector: 'app-setting-reason-lose-edit',
  templateUrl: './setting-reason-lose-edit.component.html',
  styleUrls: ['./setting-reason-lose-edit.component.scss']
})
export class SettingReasonLoseEditComponent implements OnInit {

  reasonLose$: Observable<OpportunityReasonListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.reasonLose$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewOpportunityReason(params.get('id'), SETTING_REASON.Lose));
  }

}
