import { Component, OnInit } from '@angular/core';
import { OpportunityReasonLoseModel } from '../../../../../shared/models/setting/opportunity-reason-lose-model';

@Component({
  selector: 'app-setting-reason-lose-create',
  templateUrl: './setting-reason-lose-create.component.html',
  styleUrls: ['./setting-reason-lose-create.component.scss']
})
export class SettingReasonLoseCreateComponent implements OnInit {

  reasonLose: OpportunityReasonLoseModel = new OpportunityReasonLoseModel();
  constructor() { }

  ngOnInit() {
  }

}
