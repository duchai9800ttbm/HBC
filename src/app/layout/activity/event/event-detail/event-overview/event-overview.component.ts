import { routerTransition } from '../../../../../router.animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-event-overview',
  templateUrl: './event-overview.component.html',
  styleUrls: ['./event-overview.component.scss'],
  animations: [routerTransition()]
})
export class EventOverviewComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  constructor() { }

  ngOnInit() {
  }

}
