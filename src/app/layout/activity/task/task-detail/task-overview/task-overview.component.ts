import { routerTransition } from '../../../../../router.animations';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-overview',
  templateUrl: './task-overview.component.html',
  styleUrls: ['./task-overview.component.scss'],
  animations: [routerTransition()]
})
export class TaskOverviewComponent implements OnInit {
  isCollapsedMain = false;
  isCollapsedAddress = false;
  isCollapsedDesc = false;
  constructor() { }

  ngOnInit() {
  }

}
