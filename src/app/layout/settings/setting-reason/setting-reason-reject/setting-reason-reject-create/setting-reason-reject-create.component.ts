import { Component, OnInit } from '@angular/core';
import { OpportunityReasonRejectModel } from '../../../../../shared/models/setting/opportunity-reason-reject-model';

@Component({
  selector: 'app-setting-reason-reject-create',
  templateUrl: './setting-reason-reject-create.component.html',
  styleUrls: ['./setting-reason-reject-create.component.scss']
})
export class SettingReasonRejectCreateComponent implements OnInit {

  reasonReject: OpportunityReasonRejectModel = new OpportunityReasonRejectModel();
  constructor() { }

  ngOnInit() {
  }

}
