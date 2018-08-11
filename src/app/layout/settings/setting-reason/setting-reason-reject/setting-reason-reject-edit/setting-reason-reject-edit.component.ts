import { Component, OnInit } from '@angular/core';
import { Observable } from '../../../../../../../node_modules/rxjs';
import { OpportunityReasonListItem } from '../../../../../shared/models/setting/opportunity-reason-list-item';
import { ActivatedRoute, ParamMap } from '../../../../../../../node_modules/@angular/router';
import { SettingService } from '../../../../../shared/services/setting.service';
import { SETTING_REASON } from '../../../../../shared/configs/common.config';

@Component({
  selector: 'app-setting-reason-reject-edit',
  templateUrl: './setting-reason-reject-edit.component.html',
  styleUrls: ['./setting-reason-reject-edit.component.scss']
})
export class SettingReasonRejectEditComponent implements OnInit {

  reasonReject$: Observable<OpportunityReasonListItem>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.reasonReject$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.viewOpportunityReason(params.get('id'), SETTING_REASON.Cancel));
  }

}
