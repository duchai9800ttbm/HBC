import { Component, OnInit } from '@angular/core';
import { DATATABLE_CONFIG } from '../../../../../../shared/configs';
import { Subject } from '../../../../../../../../node_modules/rxjs';
@Component({
  selector: 'app-submitted-hsdt',
  templateUrl: './submitted-hsdt.component.html',
  styleUrls: ['./submitted-hsdt.component.scss']
})
export class SubmittedHsdtComponent implements OnInit {
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  constructor() { }

  ngOnInit() {
  }

}
