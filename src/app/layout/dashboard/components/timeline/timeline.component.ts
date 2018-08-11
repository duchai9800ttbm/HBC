import { Component, OnInit, Input } from '@angular/core';
import { TimelineOfDay } from '../../../../shared/models/index';

 @Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss']
})
export class TimelineComponent implements OnInit {

  @Input() timelineOfDays: TimelineOfDay[];

  constructor() { }

  ngOnInit() {
  }

}
