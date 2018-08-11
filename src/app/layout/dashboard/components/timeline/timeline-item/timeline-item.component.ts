import { Component, OnInit, Input } from '@angular/core';
import { TimelineOfDay } from '../../../../../shared/models/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timeline-item',
  templateUrl: './timeline-item.component.html',
  styleUrls: ['./timeline-item.component.scss']
})
export class TimelineItemComponent implements OnInit {

  @Input() timelineItem: TimelineOfDay;
  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  goToItem(moduleName: string, moduleItemId: number | string, moduleItemName: string) {
    this.router.navigate([`/${moduleName.toLowerCase()}/detail/${moduleItemId}`]);

  }
}
