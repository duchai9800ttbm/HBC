import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-audit',
  templateUrl: './event-audit.component.html',
  styleUrls: ['./event-audit.component.scss']
})
export class EventAuditComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
