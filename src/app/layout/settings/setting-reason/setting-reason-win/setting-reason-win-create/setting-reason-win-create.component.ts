import { Component, OnInit } from '@angular/core';
import { OpportunityReasonWinModel } from '../../../../../shared/models/setting/opportunity-reason-win-model';

@Component({
  selector: 'app-setting-reason-win-create',
  templateUrl: './setting-reason-win-create.component.html',
  styleUrls: ['./setting-reason-win-create.component.scss']
})
export class SettingReasonWinCreateComponent implements OnInit {

  reasonWin: OpportunityReasonWinModel = new OpportunityReasonWinModel();
  constructor() { }

  ngOnInit() {
  }

}
