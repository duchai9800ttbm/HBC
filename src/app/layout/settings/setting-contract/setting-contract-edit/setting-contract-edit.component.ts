import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SettingService } from '../../../../shared/services/setting.service';
import { Contract } from '../../../../shared/models/setting/contract';

@Component({
  selector: 'app-setting-contract-edit',
  templateUrl: './setting-contract-edit.component.html',
  styleUrls: ['./setting-contract-edit.component.scss']
})
export class SettingContractEditComponent implements OnInit {
  contract$: Observable<Contract>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private settingService: SettingService
  ) { }

  ngOnInit() {
    this.contract$ = this.activatedRoute.paramMap
      .switchMap((params: ParamMap) =>
        this.settingService.detailTypeOfContract(params.get('id')));
  }

}
