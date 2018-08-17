import { Component, OnInit } from '@angular/core';
import { Subject } from '../../../../../../node_modules/rxjs/Subject';
import { DATATABLE_CONFIG } from '../../../../shared/configs/datatable.config';

@Component({
  selector: 'app-give-up',
  templateUrl: './give-up.component.html',
  styleUrls: ['./give-up.component.scss']
})
export class GiveUpComponent implements OnInit {

  checkboxSeclectAll: boolean;
  dtOptions: any = DATATABLE_CONFIG;
  dtTrigger: Subject<any> = new Subject();
  constructor() { }

  ngOnInit() {
    this.dtOptions = DATATABLE_CONFIG;
  }

  onSelectAll(value: boolean) {
  }
}
