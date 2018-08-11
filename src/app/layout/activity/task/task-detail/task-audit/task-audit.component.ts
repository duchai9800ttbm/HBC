import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-task-audit',
  templateUrl: './task-audit.component.html',
  styleUrls: ['./task-audit.component.scss']
})
export class TaskAuditComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
