import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prospect-audit-history',
  templateUrl: './prospect-audit-history.component.html',
  styleUrls: ['./prospect-audit-history.component.scss']
})
export class ProspectAuditHistoryComponent implements OnInit {
  id: string;

  constructor(
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
