import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-opportunity-audit',
  templateUrl: './opportunity-audit.component.html',
  styleUrls: ['./opportunity-audit.component.scss']
})
export class OpportunityAuditComponent implements OnInit {

  id: string;

  constructor(
    private route: ActivatedRoute,

  ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(value => this.id = value.id);

  }

}
