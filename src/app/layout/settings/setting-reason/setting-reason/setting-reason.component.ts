import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../../../router.animations';

@Component({
  selector: 'app-setting-reason',
  templateUrl: './setting-reason.component.html',
  styleUrls: ['./setting-reason.component.scss'],
  animations: [routerTransition()]
})
export class SettingReasonComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
